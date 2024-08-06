export default {
    supportedCssProperties: [
        'background-color',
        'background', // Shorthand for multiple background properties
        'background-image',
        'background-position',
        'border(.)+',        // Shorthand for border-width, border-style, and border-color
        'margin(.)+',         // Shorthand for all margin directions
        'padding(.)+',
        'width',
        'height',
        'max-width',
        'max-height',
        'color',
        'font-size',
        'font-weight',
        'text-align',
        'text-decoration',
        '-webkit-text-decoration-color', // Prefix for text-decoration-color
        'text-indent',
        'text-transform',
        'letter-spacing',
        // 'display', // For 'block' or 'inline-block'
        'list-style-type',
        'list-style-position',
    ],
    supportedHTMLTags: [
        'p',
        'span',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'br',
        'strong', 'em',
        'blockquote',
        'ul', 'li', 'ol',
        'pre',
        'a',
        'image',
        'img',
        'table', 'td', 'tr', 'tbody',
        'code'
    ]
}
