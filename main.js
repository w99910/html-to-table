import HTML2Table from "./src/HTML2Table.js";

let w = new HTML2Table();

let textArea = document.querySelector('textarea')

let output = document.getElementById('output');
let outputContainer = document.getElementById('output-container');

let previewBtn = document.querySelector('#preview');
let codeBtn = document.querySelector('#code');

textArea.value = `<div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
        Hello world
        <div style="border: 1px solid #ccc; padding: 15px; margin: 10px; width: 280px; text-align: center;">
            <img src="https://via.placeholder.com/250" alt="Product 1" style="max-width: 100%; height: auto;">
            <h3 style="margin-top: 10px;">Product 1</h3>
            <p style="color: #666;">This is a description of Product 1.</p>
            <p style="font-weight: bold;">$19.99</p>
            <button style="background-color: #4CAF50; color: white; padding: 10px 15px; border: none; cursor: pointer;">Add to Cart</button>
        </div>

        <div style="border: 1px solid #ccc; padding: 15px; margin: 10px; width: 280px; text-align: center;">
            <img src="https://via.placeholder.com/250" alt="Product 2" style="max-width: 100%; height: auto;">
            <h3 style="margin-top: 10px;">Product 2</h3>
            <p style="color: #666;">This is a description of Product 2.</p>
            <p style="font-weight: bold;">$24.99</p>
            <button style="background-color: #4CAF50; color: white; padding: 10px 15px; border: none; cursor: pointer;">Add to Cart</button>
        </div>`
let outputValue = null;
document.querySelector('#action').addEventListener('click',function(e){
    if(textArea.style.display === 'none'){
        textArea.style.display = null;
        outputContainer.style.display = 'none';
        e.target.innerText = 'Convert';
        return;
    }
    let placeholder = document.createElement('div');
    placeholder.style.width = '60vw'
    placeholder.style.background = '#333333';
    placeholder.style.color = '#f2f2f2'
    placeholder.innerHTML = document.querySelector('textarea').value;
    outputContainer.style.display = null;
    document.body.appendChild(placeholder);
    outputValue = w.convert(placeholder, {
        initialWidth: '100%'
    }).outerHTML;
    output.innerHTML = outputValue;
    textArea.style.display = 'none';
    e.target.innerText = 'Reset';
    placeholder.remove();
});

previewBtn.addEventListener('click',function(e){
    output.innerHTML = outputValue
})

codeBtn.addEventListener('click',function(e){
    output.innerText = outputValue
})

// document.getElementById('output').appendChild(w.convert(document.querySelector('#sample'), {
//     initialWidth: '100%'
// }))

// console.log(w.cssParser.parse(document.querySelector('#sample > div'), false))
