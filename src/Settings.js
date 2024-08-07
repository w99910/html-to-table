export default {
    supportedCssProperties: [
        'backgroundColor',
        'background', // Shorthand for multiple background properties
        'backgroundImage',
        'backgroundPosition',
        'border(.)+',        // Shorthand for border-width, border-style, and border-color
        'margin(.)+',         // Shorthand for all margin directions
        'padding(.)+',
        'width',
        'height',
        'maxWidth',
        'maxHeight',
        'color',
        'fontSize',
        'font',
        'fontWeight',
        'textAlign',
        'textDecoration',
        '-webkitTextDecorationColor', // Prefix for text-decoration-color
        'textIndent',
        'textTransform',
        'letterSpacing',
        // 'display', // For 'block' or 'inline-block'
        'listStyleType',
        'listStylePosition',
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
        'svg',
        'table', 'td', 'tr', 'tbody',
        'code'
    ]
}
