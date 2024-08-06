import Settings from "./Settings.js";
import CssParser from "./CssParser.js";

export default class HTML2Table {
    constructor(element) {
        this._excludeElementPattern = null;
        this.parent = element;
        this.settings = Settings;
        this.cssParser = new CssParser;
        this.img = new Image
    }

    excludeElementByPattern(pattern) {
        this._excludeElementPattern = new RegExp(pattern)
        return this;
    }

    convert(element) {
        if (this._excludeElementPattern) {
            if (this._excludeElementPattern.test(element.className) || this._excludeElementPattern.test(element.id)) {
                return null;
            }
        }

        let css = this.cssParser.parse(element);

        if (element instanceof SVGElement) {
            return this.convertSvgToImage(element)
        }

        if (this.settings.supportedHTMLTags.includes(element.tagName.toLowerCase()) && !css.isHorizontal) {
            // if not horizontal
            console.log(element)
            return this.getCloneNode(element);
        }

        let table = document.createElement('table');

        table.setAttribute('align', css.shouldCenter ? 'center' : 'left')
        table.setAttribute('width', css['width']);
        table.setAttribute('border', 0);
        table.setAttribute('cellpadding', 0);
        table.setAttribute('cellspacing', 0);

        Object.keys(css).forEach((prop) => {
            table.style[prop] = css[prop];
        })

        let tbody = document.createElement('tbody');

        let _tr = document.createElement('tr');

        let children = element.childNodes;

        let isText = !css.isHorizontal && Array.from(children).filter((child) => child.nodeType === Node.ELEMENT_NODE && ['DIV', 'SECTION', 'ARTICLE', 'MAIN', 'ASIDE'].includes(child.tagName)).length === 0;
        // console.log(isText, element)

        if (isText) {
            let elementClone = this.getCloneNode(element)
            let _innerTable = this.createTable(css)
            // console.log(element, _innerTable, css)
            let innerTableRow = document.createElement('tr');
            let innerTableData = document.createElement('td');
            innerTableData.innerHTML = elementClone.innerHTML;
            innerTableRow.appendChild(innerTableData);
            _innerTable.querySelector('tbody').appendChild(innerTableRow)
            let td = document.createElement('td');

            td.appendChild(_innerTable)
            _tr.appendChild(td);
        } else {
            for (let i = 0; i <= children.length - 1; i++) {
                let node = children[i];
                let child;
                if (node.nodeType === Node.ELEMENT_NODE) {

                    child = this.convert(node);
                } else {
                    child = document.createElement('span');
                    child.innerText = node.textContent;
                }
                // console.log(element,node, child)
                if (!child) {
                    continue;
                }

                let td = document.createElement('td');
                td.setAttribute('align', 'center');
                td.setAttribute('valign', 'top')
                td.appendChild(child);
                if (css.isHorizontal) {
                    console.log(element)
                    _tr.appendChild(td)
                    continue;
                }

                let tr = document.createElement('tr')

                tr.appendChild(td);
                tbody.appendChild(tr);
            }
        }


        if (children.length === 0) {
            let td = document.createElement('td');
            td.innerText = element.innerText;
            _tr.appendChild(td);
        }

        if (_tr.children.length !== 0) {
            tbody.appendChild(_tr);
        }

        table.appendChild(tbody)

        return table;
    }

    createTable() {
        let table = document.createElement('table');
        table.setAttribute('border', 0);
        table.setAttribute('cellpadding', 0);
        table.setAttribute('cellspacing', 0);

        let tbody = document.createElement('tbody');
        table.appendChild(tbody);
        return table;
    }

    convertSvgToImage(element) {
        if (!element instanceof SVGElement) {
            return element;
        }
        let imgEl = document.createElement('img');

        let img = new Image();
        const canvas = document.createElement('canvas');
        const svgData = new XMLSerializer().serializeToString(element);

        img.onload = function () {
            // Set canvas size
            canvas.width = element.getBoundingClientRect().width;
            canvas.height = element.getBoundingClientRect().height;

            // Draw the SVG onto the canvas
            canvas.getContext('2d').drawImage(img, 0, 0);

            // Convert canvas to PNG

            // Display the PNG
            imgEl.src = canvas.toDataURL('image/png');

            console.log(imgEl)
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);

        return imgEl;
    }

    getCloneNode(element) {
        // console.log(element)
        let cloneChild = element.cloneNode(false)
        if (element.nodeType === Node.ELEMENT_NODE) {
            let _css = this.cssParser.parse(element);
            Object.keys(_css).forEach((prop) => {
                cloneChild.style[prop] = _css[prop];
            })

            Array.from(element.attributes).forEach((attribute) => {
                if (['href', 'src'].includes(attribute.name)) {
                    return;
                }
                cloneChild.removeAttribute(attribute.name)
            })
        }

        let children = element.childNodes;
        // first apply css style to children
        Array.from(children).forEach((child) => {
            cloneChild.appendChild(child instanceof SVGElement ? this.convertSvgToImage(child) : this.getCloneNode(child))
        })

        return cloneChild;
    }
}
