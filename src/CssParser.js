import settings from "./Settings.js";
import convertToPixel from "./helpers/convertToPixel.js";

export default class CssParser {
    constructor() {
        this.supportedCSSProperties = settings.supportedCssProperties
    }

    parse(element, shouldConvertToPercent = false) {
        if (!element) return {}
        // initially parse supported css properties
        // change non-pixel unit to pixel unit
        let elementCSSProperties = window.getComputedStyle(element);
        let settings = {};

        settings.tableAlign = 'left';

        if (elementCSSProperties.textAlign !== 'start') {
            settings.tableAlign = elementCSSProperties.textAlign
        }

        settings.tableVAlign = 'top'
        switch (elementCSSProperties.justifyContent) {
            case 'start' :
               elementCSSProperties.flexDirection === 'column'? settings.tableVAlign = 'top': settings.tableAlign = 'left';
                break;
            case 'center':
                elementCSSProperties.flexDirection === 'column'? settings.tableVAlign = 'center': settings.tableAlign = 'center';
                break;
            case 'end':
                elementCSSProperties.flexDirection === 'column'? settings.tableVAlign = 'bottom': settings.tableAlign = 'right';
                break;
        }

        switch (elementCSSProperties.alignItems) {
            case 'start' :
                elementCSSProperties.flexDirection === 'column'? settings.tableAlign = 'top': settings.tableVAlign = 'left';
                break;
            case 'center':
                elementCSSProperties.flexDirection === 'column'? settings.tableAlign = 'center': settings.tableVAlign = 'center';
                break;
            case 'end':
                elementCSSProperties.flexDirection === 'column'? settings.tableAlign = 'bottom': settings.tableVAlign = 'right';
                break;
        }

        if (['left', 'center', 'right'].includes(elementCSSProperties.alignSelf)) {
            settings.margin = 'auto auto'
        }

        let margin = elementCSSProperties.margin.split(' ');
        if (margin[0] && margin[0] === 'auto') {
            settings.tableAlign = 'center';
        }

        if (margin[1] && margin[1] === 'auto') {
            settings.tableVAlign = 'center'
        }
        let isValidCSS = (checkProperty) => {
            for (const property of this.supportedCSSProperties) { // Use a for...of loop
                if (new RegExp(property + "$").test(checkProperty)) {
                    return true; // Return true and exit the function immediately
                }
            }
            return false;
        }
        let parentElement = element.parentElement;
        Object.keys(elementCSSProperties).forEach((property) => {
            if (isValidCSS(property)) {
                try {
                    if (property.startsWith('font')) {
                        settings[property] = elementCSSProperties[property];
                        return;
                    }
                    let value = convertToPixel(elementCSSProperties[property], parentElement)

                    if (value && parentElement && shouldConvertToPercent) {
                        if (property.includes('width') || property.includes('left') || property.includes('right')) {
                            value = ((value / parentElement.getBoundingClientRect().width) * 100) + '%';
                        }

                        if (property.includes('height') || property.includes('top') || property.includes('bottom')) {
                            value = ((value / parentElement.getBoundingClientRect().height) * 100) + '%';
                        }

                    }
                    if(property.includes('width')){
                        // console.log(element, value, elementCSSProperties[property])
                    }
                    if (property === 'display' && !elementCSSProperties[property].includes('block')) {
                        return;
                    }
                    if (typeof value === 'number') {
                        value += 'px';
                        if (value === '0px') {
                            value = 'auto'
                        }

                    }
                    settings[property] = value ? value : elementCSSProperties[property];
                } catch (e) {
                    console.log(property, elementCSSProperties[property])
                }

            }
        })
        return settings;
    }
}
