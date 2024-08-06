import HTML2Table from "./src/HTML2Table.js";

let w = new HTML2Table().convert(document.querySelector('main'));
document.querySelector('#test').appendChild(w);
