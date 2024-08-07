const m = {
  supportedCssProperties: [
    "backgroundColor",
    "background",
    // Shorthand for multiple background properties
    "backgroundImage",
    "backgroundPosition",
    "border(.)+",
    // Shorthand for border-width, border-style, and border-color
    "margin(.)+",
    // Shorthand for all margin directions
    "padding(.)+",
    "width",
    "height",
    "maxWidth",
    "maxHeight",
    "color",
    "fontSize",
    "font",
    "fontWeight",
    "textAlign",
    "textDecoration",
    "-webkitTextDecorationColor",
    // Prefix for text-decoration-color
    "textIndent",
    "textTransform",
    "letterSpacing",
    // 'display', // For 'block' or 'inline-block'
    "listStyleType",
    "listStylePosition"
  ],
  supportedHTMLTags: [
    "p",
    "span",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "br",
    "strong",
    "em",
    "blockquote",
    "ul",
    "li",
    "ol",
    "pre",
    "a",
    "image",
    "img",
    "svg",
    "table",
    "td",
    "tr",
    "tbody",
    "code"
  ]
};
function b(u, i) {
  let t = u.split(" ")[0];
  const n = parseFloat(t);
  if (isNaN(n))
    return !1;
  if (t.endsWith("px"))
    return n;
  if (t.endsWith("%"))
    return !1;
  if (t.endsWith("em") || t.endsWith("rem")) {
    const s = parseFloat(getComputedStyle(i).fontSize);
    return n * s;
  } else if (t.endsWith("vw")) {
    const s = window.innerWidth;
    return n / 100 * s;
  } else if (t.endsWith("vh")) {
    const s = window.innerHeight;
    return n / 100 * s;
  } else if (t.endsWith("vmin")) {
    const s = Math.min(window.innerWidth, window.innerHeight);
    return n / 100 * s;
  } else if (t.endsWith("vmax")) {
    const s = Math.max(window.innerWidth, window.innerHeight);
    return n / 100 * s;
  } else
    return n;
}
class w {
  constructor() {
    this.supportedCSSProperties = m.supportedCssProperties;
  }
  parse(i, o = !1) {
    if (!i) return {};
    let t = window.getComputedStyle(i), n = {};
    switch (n.tableAlign = "left", t.textAlign !== "start" && (n.tableAlign = t.textAlign), n.tableVAlign = "top", t.justifyContent) {
      case "start":
        n.tableVAlign = "top";
        break;
      case "center":
        n.tableVAlign = "center";
        break;
      case "end":
        n.tableVAlign = "bottom";
        break;
    }
    ["left", "center", "right"].includes(t.alignItems) && (n.tableAlign = t.alignItems);
    let s = t.margin.split(" ");
    s[0] && s[0] === "auto" && (n.tableAlign = "center"), s[1] && s[1] === "auto" && (n.tableVAlign = "center");
    let g = (e) => {
      for (const r of this.supportedCSSProperties)
        if (new RegExp(r + "$").test(e))
          return !0;
      return !1;
    }, a = i.parentElement;
    return Object.keys(t).forEach((e) => {
      if (g(e))
        try {
          if (e.startsWith("font")) {
            n[e] = t[e];
            return;
          }
          let r = b(t[e], a);
          if (r && a && o && ((e.includes("width") || e.includes("left") || e.includes("right")) && (r = r / a.getBoundingClientRect().width * 100 + "%"), (e.includes("height") || e.includes("top") || e.includes("bottom")) && (r = r / a.getBoundingClientRect().height * 100 + "%")), e === "display" && !t[e].includes("block"))
            return;
          typeof r == "number" && (r += "px", r === "0px" && (r = "auto")), n[e] = r || t[e];
        } catch {
          console.log(e, t[e]);
        }
    }), n;
  }
}
class p {
  constructor() {
    this._excludeElementPattern = null, this.settings = m, this.cssParser = new w(), this.img = new Image();
  }
  excludeElementByPattern(i) {
    return this._excludeElementPattern = new RegExp(i), this;
  }
  applyCss(i, o = {}, t = [], n = []) {
    Object.keys(o).forEach((s) => {
      n.length > 0 && !n.includes(s) || t.includes(s) || (i.style[s] = o[s]);
    });
  }
  convert(i, o) {
    if (this._excludeElementPattern && (this._excludeElementPattern.test(i.className) || this._excludeElementPattern.test(i.id)))
      return null;
    let t = {
      width: "",
      rows: {}
    }, n = this.cssParser.parse(i);
    if (i.nodeType !== Element.TEXT_NODE) {
      let g = Array.from(i.childNodes), a = Array.from(g).filter((r) => r.nodeType === Node.ELEMENT_NODE && ["DIV", "SECTION", "ARTICLE", "MAIN", "ASIDE", "IMG"].includes(r.tagName)).length === 0, e = 0;
      g.forEach((r, c) => {
        if (t.rows.hasOwnProperty(e) || (t.rows[e] = {
          children: [],
          top: 0,
          bottom: 0
        }), r.nodeType === Element.TEXT_NODE || a) {
          if (r.textContent.trim().length === 0)
            return;
          let l = t.rows[e].children.length - 1;
          if (l < 0)
            t.rows[e].children.push(this.getCloneNode(r));
          else {
            let d = document.createElement("div"), h = t.rows[e].children[l];
            h.nodeType === Element.TEXT_NODE ? d.innerHTML += h.textContent : d.innerHTML += h;
            let f = this.getCloneNode(r);
            f.nodeType === Element.TEXT_NODE ? d.innerHTML += f.textContent : d.appendChild(f), t.rows[e].children[l] = d.innerHTML;
          }
          return;
        }
        if (r.nodeType === Element.ELEMENT_NODE) {
          let l = r.getBoundingClientRect();
          t.rows[e].top === 0 && (t.rows[e].top = l.top), t.rows[e].bottom === 0 && (t.rows[e].bottom = l.bottom), l.top >= t.rows[e].bottom && (e++, t.rows[e] = {
            children: [],
            top: l.top,
            bottom: l.bottom
          }), t.rows[e].top > l.top && (t.rows[e].top = l.top), l.bottom > t.rows[e].bottom && (t.rows[e].bottom = l.bottom);
          let d = this.settings.supportedHTMLTags.includes(r.tagName.toLowerCase()) ? this.getCloneNode(r) : this.convert(r, i);
          if (!d) return;
          t.rows[e].children.push(d);
        }
      });
    } else i.textContent.trim().length > 0 && t.rows[0].push(i.textContent);
    let s = this.createTable();
    return s.setAttribute("align", n.tableAlign ?? "left"), s.setAttribute("valign", n.tableVAlign ?? "top"), this.applyCss(s, n, ["width"]), Object.keys(t.rows).forEach((g) => {
      let a = document.createElement("tr");
      t.rows[g].children.forEach((e, r) => {
        let c = document.createElement("td");
        c.setAttribute("align", n.tableAlign ?? "left"), c.setAttribute("valign", n.tableVAlign ?? "top"), o && (c.style.width = n.width, e.tagName !== "TABLE" && e.getBoundingClientRect && (c.style.width = e.getBoundingClientRect().width + "px")), typeof e == "string" ? c.innerHTML = e : c.appendChild(e), a.appendChild(c);
      }), s.querySelector("tbody").appendChild(a);
    }), s;
  }
  createTable() {
    let i = document.createElement("table");
    i.setAttribute("border", 0), i.setAttribute("cellpadding", 0), i.setAttribute("cellspacing", 0);
    let o = document.createElement("tbody");
    return i.appendChild(o), i;
  }
  convertSvgToImage(i) {
    if (!i instanceof SVGElement)
      return i;
    let o = document.createElement("img"), t = new Image();
    const n = document.createElement("canvas"), s = new XMLSerializer().serializeToString(i);
    return t.onload = function() {
      n.width = i.getBoundingClientRect().width, n.height = i.getBoundingClientRect().height, n.getContext("2d").drawImage(t, 0, 0), o.src = n.toDataURL("image/png");
    }, t.src = "data:image/svg+xml;base64," + btoa(s), o;
  }
  getCloneNode(i) {
    if (i instanceof SVGElement)
      return this.convertSvgToImage(i);
    let o = i.cloneNode(!1);
    if (i.nodeType === Node.ELEMENT_NODE) {
      let n = this.cssParser.parse(i);
      Array.from(i.attributes).forEach((s) => {
        ["href", "src"].includes(s.name) || o.removeAttribute(s.name);
      }), Object.keys(n).forEach((s) => {
        o.style[s] = n[s];
      });
    }
    let t = i.childNodes;
    return Array.from(t).forEach((n) => {
      o.appendChild(this.getCloneNode(n));
    }), o;
  }
}
export {
  p as default
};
