import HTML2Table from "./src/HTML2Table.js";

let w = new HTML2Table().convert(document.querySelector('#pico > div'));
console.log(w.querySelector('img'))
document.body.prepend(w);
