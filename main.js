import HTML2Table from "./src/HTML2Table.js";

let w = new HTML2Table();

document.querySelector('button').addEventListener('click',function(){
    let placeholder = document.createElement('div');
    placeholder.style.width = '60vw'
    placeholder.style.background = '#333333';
    placeholder.style.color = '#f2f2f2'
    placeholder.innerHTML = document.querySelector('textarea').value;
    document.body.appendChild(placeholder);
    document.getElementById('output').innerText = w.convert(placeholder, {
        initialWidth: '100%'
    }).outerHTML
    placeholder.remove();
});

// document.getElementById('output').appendChild(w.convert(document.querySelector('#sample'), {
//     initialWidth: '100%'
// }))

// console.log(w.cssParser.parse(document.querySelector('#sample > div'), false))
