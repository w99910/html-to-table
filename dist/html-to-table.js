const h = {
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
function b(u, n) {
  let t = u.split(" ")[0];
  const e = parseFloat(t);
  if (isNaN(e))
    return !1;
  if (t.endsWith("px"))
    return e;
  if (t.endsWith("%"))
    return !1;
  if (t.endsWith("em") || t.endsWith("rem")) {
    const l = parseFloat(getComputedStyle(n).fontSize);
    return e * l;
  } else if (t.endsWith("vw")) {
    const l = window.innerWidth;
    return e / 100 * l;
  } else if (t.endsWith("vh")) {
    const l = window.innerHeight;
    return e / 100 * l;
  } else if (t.endsWith("vmin")) {
    const l = Math.min(window.innerWidth, window.innerHeight);
    return e / 100 * l;
  } else if (t.endsWith("vmax")) {
    const l = Math.max(window.innerWidth, window.innerHeight);
    return e / 100 * l;
  } else
    return e;
}
class m {
  constructor() {
    this.supportedCSSProperties = h.supportedCssProperties;
  }
  parse(n, s = !1) {
    if (!n) return {};
    let t = window.getComputedStyle(n), e = {};
    switch (e.tableAlign = "left", t.textAlign !== "start" && (e.tableAlign = t.textAlign), e.tableVAlign = "top", t.justifyContent) {
      case "start":
        t.flexDirection === "column" ? e.tableVAlign = "top" : e.tableAlign = "left";
        break;
      case "center":
        t.flexDirection === "column" ? e.tableVAlign = "center" : e.tableAlign = "center";
        break;
      case "end":
        t.flexDirection === "column" ? e.tableVAlign = "bottom" : e.tableAlign = "right";
        break;
    }
    switch (t.alignItems) {
      case "start":
        t.flexDirection === "column" ? e.tableAlign = "top" : e.tableVAlign = "left";
        break;
      case "center":
        t.flexDirection === "column" ? e.tableAlign = "center" : e.tableVAlign = "center";
        break;
      case "end":
        t.flexDirection === "column" ? e.tableAlign = "bottom" : e.tableVAlign = "right";
        break;
    }
    ["left", "center", "right"].includes(t.alignSelf) && (e.margin = "auto auto");
    let l = t.margin.split(" ");
    l[0] && l[0] === "auto" && (e.tableAlign = "center"), l[1] && l[1] === "auto" && (e.tableVAlign = "center");
    let g = (i) => {
      for (const r of this.supportedCSSProperties)
        if (new RegExp(r + "$").test(i))
          return !0;
      return !1;
    }, c = n.parentElement;
    return Object.keys(t).forEach((i) => {
      if (g(i))
        try {
          if (i.startsWith("font")) {
            e[i] = t[i];
            return;
          }
          let r = b(t[i], c);
          if (r && c && s && ((i.includes("width") || i.includes("left") || i.includes("right")) && (r = r / c.getBoundingClientRect().width * 100 + "%"), (i.includes("height") || i.includes("top") || i.includes("bottom")) && (r = r / c.getBoundingClientRect().height * 100 + "%")), i.includes("width"), i === "display" && !t[i].includes("block"))
            return;
          typeof r == "number" && (r += "px", r === "0px" && (r = "auto")), e[i] = r || t[i];
        } catch {
          console.log(i, t[i]);
        }
    }), e;
  }
}
class w {
  constructor() {
    this._excludeElementPattern = null, this.settings = h, this.cssParser = new m(), this.img = new Image();
  }
  excludeElementByPattern(n) {
    return this._excludeElementPattern = new RegExp(n), this;
  }
  applyCss(n, s = {}, t = [], e = []) {
    Object.keys(s).forEach((l) => {
      e.length > 0 && !e.includes(l) || t.includes(l) || (n.style[l] = s[l]);
    });
  }
  convert(n, s) {
    if (this._excludeElementPattern && (this._excludeElementPattern.test(n.className) || this._excludeElementPattern.test(n.id)))
      return null;
    let t = {
      width: "",
      rows: {}
    }, e = this.cssParser.parse(n);
    if (n.nodeType !== Element.TEXT_NODE) {
      let g = Array.from(n.childNodes), c = Array.from(g).filter((r) => r.nodeType === Node.ELEMENT_NODE && ["DIV", "SECTION", "ARTICLE", "MAIN", "ASIDE", "IMG"].includes(r.tagName)).length === 0, i = 0;
      g.forEach((r, a) => {
        if (t.rows.hasOwnProperty(i) || (t.rows[i] = {
          children: [],
          top: 0,
          bottom: 0
        }), r.nodeType === Element.TEXT_NODE || c) {
          if (r.nodeType === Element.TEXT_NODE && r.textContent.trim().length === 0)
            return;
          let o = t.rows[i].children.length - 1;
          if (o < 0) {
            let d = document.createElement("div");
            d.setAttribute("temp", "true"), d.appendChild(this.getCloneNode(r)), t.rows[i].children.push(d);
          } else {
            let d = t.rows[i].children[o], f = this.getCloneNode(r);
            d.appendChild(f), t.rows[i].children[o] = d;
          }
          return;
        }
        if (r.nodeType === Element.ELEMENT_NODE) {
          let o = r.getBoundingClientRect();
          t.rows[i].top === 0 && (t.rows[i].top = o.top), t.rows[i].bottom === 0 && (t.rows[i].bottom = o.bottom), o.top >= t.rows[i].bottom && (i++, t.rows[i] = {
            children: [],
            top: o.top,
            bottom: o.bottom
          }), t.rows[i].top > o.top && (t.rows[i].top = o.top), o.bottom > t.rows[i].bottom && (t.rows[i].bottom = o.bottom);
          let d = this.settings.supportedHTMLTags.includes(r.tagName.toLowerCase()) ? this.getCloneNode(r) : this.convert(r, n);
          if (!d) return;
          t.rows[i].children.push(d);
        }
      });
    } else n.textContent.trim().length > 0 && t.rows[0].push(n.textContent);
    let l = this.createTable();
    return l.setAttribute("align", e.tableAlign ?? "left"), l.setAttribute("valign", e.tableVAlign ?? "top"), this.applyCss(l, e, ["width"]), s || (l.style.width = "100%", l.style.height = "100%", l.style.margin = "0", l.style.padding = "0"), Object.keys(t.rows).forEach((g) => {
      let c = document.createElement("tr");
      t.rows[g].children.forEach((i, r) => {
        let a = document.createElement("td");
        if (a.setAttribute("align", e.tableAlign ?? "left"), a.setAttribute("valign", e.tableVAlign ?? "top"), s && (a.style.width = e.width, i.tagName !== "TABLE" && i.getBoundingClientRect)) {
          let o = i.getBoundingClientRect().width;
          o > 0 && (a.style.width = o + "px");
        }
        typeof i == "string" ? a.innerHTML = i : i.getAttribute("temp") ? (a.style.display = "inline-block", Array.from(i.childNodes).forEach((o) => {
          a.appendChild(o);
        })) : a.appendChild(i), c.appendChild(a);
      }), l.querySelector("tbody").appendChild(c);
    }), l;
  }
  createTable() {
    let n = document.createElement("table");
    n.setAttribute("border", 0), n.setAttribute("cellpadding", 0), n.setAttribute("cellspacing", 0);
    let s = document.createElement("tbody");
    return n.appendChild(s), n;
  }
  convertSvgToImage(n) {
    if (!n instanceof SVGElement)
      return n;
    let s = document.createElement("img");
    s.style.verticalAlign = "middle", n.setAttribute("stroke", window.getComputedStyle(n).color);
    let t = new Image();
    const e = document.createElement("canvas"), l = new XMLSerializer().serializeToString(n);
    return t.onload = function() {
      e.width = n.getBoundingClientRect().width > 0 ? n.getBoundingClientRect().width : n.getAttribute("width"), e.height = n.getBoundingClientRect().height ? n.getBoundingClientRect().height : n.getAttribute("height"), e.getContext("2d").drawImage(t, 0, 0), s.src = e.toDataURL("image/png");
    }, t.src = "data:image/svg+xml;base64," + btoa(l), s;
  }
  getCloneNode(n) {
    if (n instanceof SVGElement)
      return this.convertSvgToImage(n);
    let s = n.cloneNode(!1);
    if (n.nodeType === Node.ELEMENT_NODE) {
      let e = this.cssParser.parse(n);
      Array.from(n.attributes).forEach((l) => {
        ["href", "src", "title", "alt"].includes(l.name) || s.removeAttribute(l.name);
      }), Object.keys(e).forEach((l) => {
        s.style[l] = e[l];
      }), s.style.display = "inline-block";
    }
    let t = n.childNodes;
    return Array.from(t).forEach((e) => {
      s.appendChild(this.getCloneNode(e));
    }), s;
  }
}
export {
  w as default
};
