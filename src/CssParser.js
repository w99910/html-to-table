import settings from "./Settings.js";
import convertToPixel from "./helpers/convertToPixel.js";

function getClassStylesFromEmbeddedSheets() {
    const embeddedStylesheets = [];

    for (let i = 0; i < document.styleSheets.length; i++) {
        const styleSheet = document.styleSheets[i];

        // Only consider embedded stylesheets (no href attribute)
        if (!styleSheet.href) {
            embeddedStylesheets.push(styleSheet);
        }
    }

    const classStyles = {};

    embeddedStylesheets.forEach(styleSheet => {
        const rules = styleSheet.cssRules || styleSheet.rules; // Get all CSS rules

        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];

            // Check if the rule is a style rule
            if (rule.type === CSSRule.STYLE_RULE) {
                const selectors = rule.selectorText.split(',');

                selectors.forEach(selector => {
                    selector = selector.trim();

                    // Normalize special selectors like * and pseudo-elements
                    if (!classStyles[selector]) {
                        classStyles[selector] = {};
                    }

                    // Store the CSS properties and values
                    for (let j = 0; j < rule.style.length; j++) {
                        const property = rule.style[j];
                        const value = rule.style.getPropertyValue(property);

                        classStyles[selector][property] = value;
                    }
                });
            }
        }
    });

    return classStyles;
}

// Example usage
const classStyles = getClassStylesFromEmbeddedSheets();

export default class CssParser {
    constructor() {
        this.supportedCSSProperties = settings.supportedCssProperties
    }

    parse(element, shouldConvertToPercent = false, excludeProperties = []) {
        if (!element) return {}
        // initially parse supported css properties
        // change non-pixel unit to pixel unit
        let elementCSSProperties = window.getComputedStyle(element);
        let css = {};

        css.tableAlign = 'left';

        if (elementCSSProperties.textAlign !== 'start') {
            css.tableAlign = elementCSSProperties.textAlign
        }

        css.tableVAlign = 'top'
        switch (elementCSSProperties.justifyContent) {
            case 'start':
                elementCSSProperties.flexDirection === 'column' ? css.tableVAlign = 'top' : css.tableAlign = 'left';
                break;
            case 'center':
                elementCSSProperties.flexDirection === 'column' ? css.tableVAlign = 'center' : css.tableAlign = 'center';
                break;
            case 'end':
                elementCSSProperties.flexDirection === 'column' ? css.tableVAlign = 'bottom' : css.tableAlign = 'right';
                break;
        }

        switch (elementCSSProperties.alignItems) {
            case 'start':
                elementCSSProperties.flexDirection === 'column' ? css.tableAlign = 'top' : css.tableVAlign = 'left';
                break;
            case 'center':
                elementCSSProperties.flexDirection === 'column' ? css.tableAlign = 'center' : css.tableVAlign = 'center';
                break;
            case 'end':
                elementCSSProperties.flexDirection === 'column' ? css.tableAlign = 'bottom' : css.tableVAlign = 'right';
                break;
        }

        if (['left', 'center', 'right'].includes(elementCSSProperties.alignSelf)) {
            css.margin = 'auto auto'
        }

        let margin = elementCSSProperties.margin.split(' ');
        if (margin[0] && margin[0] === 'auto') {
            css.tableAlign = 'center';
        }

        if (margin[1] && margin[1] === 'auto') {
            css.tableVAlign = 'center'
        }
        let isValidCSS = (checkProperty) => {
            for (const property of this.supportedCSSProperties) { // Use a for...of loop
                if (new RegExp(property + "$").test(checkProperty) && !excludeProperties.includes(property)) {
                    return true; // Return true and exit the function immediately
                }
            }
            return false;
        }

        const getCSSPropertiesFromClasses = () => {
            // window.getComputedStyle returns the computed styles based on the current window
            let stylesFromCSS = {};
            if (classStyles['*']) {
                stylesFromCSS = { ...classStyles['*'] }
            }
            element.classList?.forEach((className) => {
                let classProperties = classStyles['.' + className];
                if (!classProperties) {
                    return;
                }
                Object.keys(classProperties).forEach((prop) => {
                    stylesFromCSS[prop] = classProperties[prop]
                })
            })
            return stylesFromCSS;
        }

        let cssPropertiesFromClass = getCSSPropertiesFromClasses();

        let parentElement = element.parentElement;
        Object.keys(elementCSSProperties).forEach((property) => {
            if (isValidCSS(property)) {
                try {
                    if (property.startsWith('font')) {
                        css[property] = elementCSSProperties[property];
                        return;
                    }
                    // priortize the style properties from classes since the window computed styles are based on the current window so it is likely to be inconsistent in other devices
                    let value = element.style[property]

                    if (value?.toString().trim().length === 0) {
                        value = convertToPixel(cssPropertiesFromClass[property] ?? elementCSSProperties[property], parentElement)
                    }

                    if (value && parentElement && shouldConvertToPercent) {
                        if (property.includes('width') || property.includes('left') || property.includes('right')) {
                            value = ((value / parentElement.getBoundingClientRect().width) * 100) + '%';
                        }

                        if (property.includes('height') || property.includes('top') || property.includes('bottom')) {
                            value = ((value / parentElement.getBoundingClientRect().height) * 100) + '%';
                        }

                    }
                    if (property === 'display' && !elementCSSProperties[property].includes('block')) {
                        return;
                    }
                    if (typeof value === 'number') {
                        value += 'px';
                    }
                    css[property] = value ? value : elementCSSProperties[property];
                    // css[property] = value;
                } catch (e) {
                    console.log(property, elementCSSProperties[property])
                }

            }
        })

        // force box sizing to border-box
        // css.boxSizing = "border-box"

        return css;
    }
}
