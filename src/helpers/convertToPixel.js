export default function (_value, parentElement) {
    let splitBySpace = _value.split(' ');
    let value = splitBySpace[0];
    const numberValue = parseFloat(value); // Extract numeric part

    if (isNaN(numberValue)) {
        return false;
    }
    if (value.endsWith('px')) {
        return numberValue; // Already in pixels
    } else if (value.endsWith('%')) {
        return value;
    } else if (value.endsWith('em') || value.endsWith('rem')) {
        const fontSize = parseFloat(getComputedStyle(parentElement).fontSize);
        return numberValue * fontSize;
    } else if (value.endsWith('vw')) {
        const viewportWidth = window.innerWidth;
        return (numberValue / 100) * viewportWidth;
    } else if (value.endsWith('vh')) {
        const viewportHeight = window.innerHeight;
        return (numberValue / 100) * viewportHeight;
    } else if (value.endsWith('vmin')) {
        const viewportMin = Math.min(window.innerWidth, window.innerHeight);
        return (numberValue / 100) * viewportMin;
    } else if (value.endsWith('vmax')) {
        const viewportMax = Math.max(window.innerWidth, window.innerHeight);
        return (numberValue / 100) * viewportMax;
    } else {
        return numberValue;
    }
}
