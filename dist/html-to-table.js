const f = {
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
function m(g, l) {
  let t = g.split(" ")[0];
  const i = parseFloat(t);
  if (isNaN(i))
    return !1;
  if (t.endsWith("px"))
    return i;
  if (t.endsWith("%"))
    return !1;
  if (t.endsWith("em") || t.endsWith("rem")) {
    const n = parseFloat(getComputedStyle(l).fontSize);
    return i * n;
  } else if (t.endsWith("vw")) {
    const n = window.innerWidth;
    return i / 100 * n;
  } else if (t.endsWith("vh")) {
    const n = window.innerHeight;
    return i / 100 * n;
  } else if (t.endsWith("vmin")) {
    const n = Math.min(window.innerWidth, window.innerHeight);
    return i / 100 * n;
  } else if (t.endsWith("vmax")) {
    const n = Math.max(window.innerWidth, window.innerHeight);
    return i / 100 * n;
  } else
    return i;
}
class p {
  constructor() {
    this.supportedCSSProperties = f.supportedCssProperties;
  }
  parse(l, o = !1) {
    if (!l) return {};
    let t = window.getComputedStyle(l), i = {};
    switch (i.tableAlign = "left", t.textAlign !== "start" && (i.tableAlign = t.textAlign), i.tableVAlign = "top", t.justifyContent) {
      case "start":
        t.flexDirection === "column" ? i.tableVAlign = "top" : i.tableAlign = "left";
        break;
      case "center":
        t.flexDirection === "column" ? i.tableVAlign = "center" : i.tableAlign = "center";
        break;
      case "end":
        t.flexDirection === "column" ? i.tableVAlign = "bottom" : i.tableAlign = "right";
        break;
    }
    switch (t.alignItems) {
      case "start":
        t.flexDirection === "column" ? i.tableAlign = "top" : i.tableVAlign = "left";
        break;
      case "center":
        t.flexDirection === "column" ? i.tableAlign = "center" : i.tableVAlign = "center";
        break;
      case "end":
        t.flexDirection === "column" ? i.tableAlign = "bottom" : i.tableVAlign = "right";
        break;
    }
    ["left", "center", "right"].includes(t.alignSelf) && (i.margin = "auto auto");
    let n = t.margin.split(" ");
    n[0] && n[0] === "auto" && (i.tableAlign = "center"), n[1] && n[1] === "auto" && (i.tableVAlign = "center");
    let c = (r) => {
      for (const e of this.supportedCSSProperties)
        if (new RegExp(e + "$").test(r))
          return !0;
      return !1;
    }, u = l.parentElement;
    return Object.keys(t).forEach((r) => {
      if (c(r))
        try {
          if (r.startsWith("font")) {
            i[r] = t[r];
            return;
          }
          let e = m(t[r], u);
          if (e && u && o && ((r.includes("width") || r.includes("left") || r.includes("right")) && (e = e / u.getBoundingClientRect().width * 100 + "%"), (r.includes("height") || r.includes("top") || r.includes("bottom")) && (e = e / u.getBoundingClientRect().height * 100 + "%")), r.includes("width"), r === "display" && !t[r].includes("block"))
            return;
          typeof e == "number" && (e += "px", e === "0px" && (e = "auto")), i[r] = e || t[r];
        } catch {
          console.log(r, t[r]);
        }
    }), i;
  }
}
class w {
  constructor() {
    this._excludeElementPattern = null, this.settings = f, this.cssParser = new p(), this.img = new Image();
  }
  excludeElementByPattern(l) {
    return this._excludeElementPattern = new RegExp(l), this;
  }
  applyCss(l, o = {}, t = [], i = []) {
    Object.keys(o).forEach((n) => {
      i.length > 0 && !i.includes(n) || t.includes(n) || (l.style[n] = o[n]);
    });
  }
  convert(l, o) {
    if (this._excludeElementPattern && (this._excludeElementPattern.test(l.className) || this._excludeElementPattern.test(l.id)))
      return null;
    let t = {
      width: "",
      rows: {}
    };
    if (l.nodeType !== Element.TEXT_NODE) {
      let u = Array.from(l.childNodes), r = Array.from(u).filter((a) => a.nodeType === Node.ELEMENT_NODE && ["DIV", "SECTION", "ARTICLE", "MAIN", "ASIDE", "IMG"].includes(a.tagName)).length === 0, e = 0;
      u.forEach((a, d) => {
        if (t.rows.hasOwnProperty(e) || (t.rows[e] = {
          children: [],
          top: 0,
          bottom: 0
        }), a.nodeType === Element.TEXT_NODE || r) {
          if (a.nodeType === Element.TEXT_NODE && a.textContent.trim().length === 0)
            return;
          let s = t.rows[e].children.length - 1;
          if (s < 0) {
            let h = document.createElement("div");
            h.setAttribute("temp", "true"), h.appendChild(this.getCloneNode(a)), t.rows[e].children.push(h);
          } else {
            let h = t.rows[e].children[s], b = this.getCloneNode(a);
            h.appendChild(b), t.rows[e].children[s] = h;
          }
          return;
        }
        if (a.nodeType === Element.ELEMENT_NODE) {
          let s = a.getBoundingClientRect();
          t.rows[e].top === 0 && (t.rows[e].top = s.top), t.rows[e].bottom === 0 && (t.rows[e].bottom = s.bottom), s.top >= t.rows[e].bottom && (e++, t.rows[e] = {
            children: [],
            top: s.top,
            bottom: s.bottom
          }), t.rows[e].top > s.top && (t.rows[e].top = s.top), s.bottom > t.rows[e].bottom && (t.rows[e].bottom = s.bottom);
          let h = this.settings.supportedHTMLTags.includes(a.tagName.toLowerCase()) ? this.getCloneNode(a) : this.convert(a, l);
          if (!h) return;
          t.rows[e].children.push(h);
        }
      });
    } else l.textContent.trim().length > 0 && t.rows[0].push(l.textContent);
    let i = this.cssParser.parse(o), n = this.cssParser.parse(l), c = this.createTable();
    return c.setAttribute("align", i.tableAlign ?? "left"), c.setAttribute("valign", i.tableVAlign ?? "top"), c.setAttribute("bgcolor", n.backgroundColor ?? n.background), this.applyCss(c, n, ["width"]), o || (c.style.width = "100%", c.style.height = "100%", c.style.margin = "0", c.style.padding = "0"), Object.keys(t.rows).forEach((u) => {
      let r = document.createElement("tr");
      t.rows[u].children.forEach((e, a) => {
        let d = document.createElement("td");
        if (d.setAttribute("align", n.tableAlign ?? "left"), d.setAttribute("valign", n.tableVAlign ?? "top"), o && (d.style.width = n.width, e.tagName !== "TABLE" && e.getBoundingClientRect)) {
          let s = e.getBoundingClientRect().width;
          s > 0 && (d.style.width = s + "px");
        }
        typeof e == "string" ? d.innerHTML = e : e.getAttribute("temp") ? (d.style.display = "inline-block", Array.from(e.childNodes).forEach((s) => {
          d.appendChild(s);
        })) : d.appendChild(e), r.appendChild(d);
      }), c.querySelector("tbody").appendChild(r);
    }), c;
  }
  createTable() {
    let l = document.createElement("table");
    l.setAttribute("border", 0), l.setAttribute("cellpadding", 0), l.setAttribute("cellspacing", 0);
    let o = document.createElement("tbody");
    return l.appendChild(o), l;
  }
  getCloneNode(l) {
    let o = l.cloneNode(!1);
    if (l.nodeType === Node.ELEMENT_NODE) {
      let i = this.cssParser.parse(l);
      Array.from(l.attributes).forEach((n) => {
        ["href", "src", "title", "alt"].includes(n.name) || o.removeAttribute(n.name);
      }), Object.keys(i).forEach((n) => {
        o.style[n] = i[n];
      }), o.style.display = "inline-block";
    }
    let t = l.childNodes;
    return Array.from(t).forEach((i) => {
      o.appendChild(this.getCloneNode(i));
    }), o;
  }
}
export {
  w as default
};
