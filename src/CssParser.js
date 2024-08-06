import settings from "./Settings.js";
import convertToPixel from "./helpers/convertToPixel.js";

export default class CssParser {
    constructor() {
        this.supportedCSSProperties = settings.supportedCssProperties
    }

    parse(element) {
        // initially parse supported css properties
        // change non-pixel unit to pixel unit
        let elementCSSProperties = window.getComputedStyle(element);
        let settings = {};

        switch (elementCSSProperties.display) {
            case 'flex' || 'inline-flex':
                settings.isHorizontal = elementCSSProperties.flexDirection === 'row' && elementCSSProperties.flexWrap !== 'wrap';
                break;
            case 'grid':
                settings.isHorizontal = elementCSSProperties.gridTemplateColumns !== 'none';
                break;
        }

        if (elementCSSProperties.margin === '0 auto') {
            settings.shouldCenter = true;
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
                    let value = convertToPixel(elementCSSProperties[property], parentElement, property.includes(['Top', 'Bottom', 'height']))
                    if (value && parentElement) {
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
                    settings[property] = value ? value : elementCSSProperties[property];
                } catch (e) {
                    console.log(property, elementCSSProperties[property])
                }

            }
        })

        return settings;
    }
}
