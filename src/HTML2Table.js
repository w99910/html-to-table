import Settings from "./Settings.js";
import CssParser from "./CssParser.js";

export default class HTML2Table {
    constructor() {
        this._excludeElementPattern = null;
        this.settings = Settings;
        this.cssParser = new CssParser;
        this.img = new Image
    }

    excludeElementByPattern(pattern) {
        this._excludeElementPattern = new RegExp(pattern)
        return this;
    }

    applyCss(element, css = {}, excludeProperties = [], onlyProperties = []) {
        Object.keys(css).forEach((property) => {
            if (onlyProperties.length > 0 && !onlyProperties.includes(property)) return;
            if (excludeProperties.includes(property)) return;
            element.style[property] = css[property];
        });
    }

    convert(element, parentElement) {
        if (this._excludeElementPattern) {
            if (this._excludeElementPattern.test(element.className) || this._excludeElementPattern.test(element.id)) {
                return null;
            }
        }
        let object = {
            width: '',
            rows: {},
        }

        if (element.nodeType !== Element.TEXT_NODE) {
            let childNodes = Array.from(element.childNodes);
            let isText = Array.from(childNodes).filter((child) => child.nodeType === Node.ELEMENT_NODE && ['DIV', 'SECTION', 'ARTICLE', 'MAIN', 'ASIDE', 'IMG'].includes(child.tagName)).length === 0;
            let rowIndex = 0;
            childNodes.forEach((childNode, i) => {
                if (!object.rows.hasOwnProperty(rowIndex)) {
                    object.rows[rowIndex] = {
                        children: [],
                        top: 0,
                        bottom: 0,
                    }
                }
                if (childNode.nodeType === Element.TEXT_NODE || isText) {
                    if (childNode.nodeType === Element.TEXT_NODE && childNode.textContent.trim().length === 0) {
                        return;
                    }

                    let lastIndex = object.rows[rowIndex].children.length - 1;
                    if (lastIndex < 0) {
                        let container = document.createElement('div');
                        this.applyCss(container, this.cssParser.parse(childNode.parentElement))
                        container.setAttribute('temp', "true")
                        container.appendChild(this.getCloneNode(childNode))
                        object.rows[rowIndex].children.push(container)
                    } else {
                        let lastChild = object.rows[rowIndex].children[lastIndex];
                        let currentChild = this.getCloneNode(childNode);
                        lastChild.appendChild(currentChild);
                        object.rows[rowIndex].children[lastIndex] = lastChild;
                    }
                    return;
                }

                if (childNode.nodeType === Element.ELEMENT_NODE) {
                    let childRect = childNode.getBoundingClientRect();

                    // check rowIndex by top and bottom offset
                    if (object.rows[rowIndex].top === 0) {
                        object.rows[rowIndex].top = childRect.top;
                    }

                    if (object.rows[rowIndex].bottom === 0) {
                        object.rows[rowIndex].bottom = childRect.bottom;
                    }

                    if (childRect.top >= object.rows[rowIndex].bottom) {
                        rowIndex++;
                        object.rows[rowIndex] = {
                            children: [],
                            top: childRect.top,
                            bottom: childRect.bottom,
                        }
                    }

                    if (object.rows[rowIndex].top > childRect.top) {
                        object.rows[rowIndex].top = childRect.top;
                    }

                    if (childRect.bottom > object.rows[rowIndex].bottom) {
                        object.rows[rowIndex].bottom = childRect.bottom;
                    }

                    let node = this.settings.supportedHTMLTags.includes(childNode.tagName.toLowerCase()) ?
                        this.getCloneNode(childNode) : this.convert(childNode, element)
                    if (!node) return;
                    object.rows[rowIndex].children.push(node)
                }
            })

        } else if (element.textContent.trim().length > 0) {
            object.rows[0].push(element.textContent);
        }

        let parentCSS = this.cssParser.parse(parentElement, false, ['display'])
        let css = this.cssParser.parse(element, false, ['display']);

        let table = this.createTable();
        table.setAttribute('align', parentCSS.tableAlign ?? 'left');
        table.setAttribute('bgcolor', css.backgroundColor ?? css.background);
        this.applyCss(table, css, ['width'])

        if (!parentElement) {
            table.style.width = '100%'
            table.style.height = element.style.height
            table.style.margin = '0';
            table.style.padding = '0';
        }

        Object.keys(object.rows).forEach((rowIndex) => {
            let tr = document.createElement('tr');
            object.rows[rowIndex].children.forEach((childNode, i) => {
                let td = document.createElement('td');
                td.setAttribute('align', css.tableAlign ?? 'left');
                if (parentElement) {
                    td.style.width = childNode.style.width ?? css.width;
                    if (childNode.tagName !== 'TABLE' && childNode.getBoundingClientRect) {
                        let width = childNode.getBoundingClientRect().width;
                        if (width > 0) {
                            td.style.width = width + 'px';
                        }
                    }
                }
                if (typeof childNode === 'string') {
                    td.innerHTML = childNode;
                } else {
                    if (childNode.getAttribute('temp')) {
                        td.style.display = 'inline-block';
                        table.style.width = childNode.style.width;
                        Array.from(childNode.childNodes).forEach((innerChild) => {
                            td.appendChild(innerChild)
                        })
                    } else {
                        td.appendChild(childNode)
                    }
                }
                tr.appendChild(td);
            })
            table.querySelector('tbody').appendChild(tr);
        })
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

    getCloneNode(element) {
        let cloneChild = element.cloneNode(false)
        if (element.nodeType === Node.ELEMENT_NODE) {
            let _css = this.cssParser.parse(element);
            Array.from(element.attributes).forEach((attribute) => {
                if (['href', 'path', 'src', 'title', 'alt'].includes(attribute.name)) {
                    return;
                }
                cloneChild.removeAttribute(attribute.name)
            })
            Object.keys(_css).forEach((prop) => {
                cloneChild.style[prop] = _css[prop];
            })
            cloneChild.style.height = element.style.height ?? 'auto'
            if (element.style.display?.includes('inline') || !_css.display?.includes('block')) {
                cloneChild.style.width = element.style.width ?? 'auto'
            } else {
                // exclude inline such as span, h1, h2, p
                let boundingRect = element.getBoundingClientRect();
                if (boundingRect.width > 0) {
                    cloneChild.style.width = boundingRect.width + 'px'
                }
            }


            cloneChild.style.display = 'inline-block'
        }

        let children = element.childNodes;
        // first apply css style to children
        Array.from(children).forEach((child) => {
            cloneChild.appendChild(this.getCloneNode(child))
        })
        return cloneChild;
    }
}
