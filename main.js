import HTML2Table from "./src/HTML2Table.js";

let w = new HTML2Table();

let textArea = document.querySelector('textarea')

let output = document.getElementById('output');
let outputContainer = document.getElementById('output-container');

let previewBtn = document.querySelector('#preview');
let codeBtn = document.querySelector('#code');

textArea.value = `<div style="background: #131217; display: flex; justify-content:center; font-size: 16px; font-family: 'Source Sans Pro',Helvetica,sans-serif; align-items:center; padding: 20px; color:white;">
  <div style=" width: 400px; display: flex; padding: 10px; flex-direction: column; background: linear-gradient(to bottom, transparent 0%, rgba(217, 217, 217, 0.03) 36%, rgba(115, 115, 115, 0.13) 100%); border:1px solid #323232; border-radius: 10px;">
   <div style="display:flex; align-items:center;">
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity">
     <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>
     </svg>
     <h1 style="font-size: 18px; padding: 0px 12px;">Hello World Co.,LTD</h1>
    </div>
    <div style="border-top: 1px solid #6c757d; padding-top: 14px;">
      <h2>Welcome onboard!</h2>
      <p>Hi Thomas,</p>
      <p style="color:#ced4da;">
        Thank you for choosing us. We can't wait to see how you'll use product to achieve your goals.
      </p>
      <p style="color:#ced4da;">
        Before we get started, please confirm your email address by clicking it.
      </p>
      <div style="padding-top: 12px; padding-bottom: 20px; display: flex; align-items:center; justify-content: center; width: 100%;">
        <a href="" style="padding: 12px 16px; outline: none; text-decoration: none; background: #ffa62b; border-radius: 4px; color: #0a0908;">Confirm Now👋</a>
      </div>
    </div>
  </div>
</div>`
let outputValue = null;
document.querySelector('#action').addEventListener('click',function(e){
    if(textArea.style.display === 'none'){
        textArea.style.display = null;
        outputContainer.style.display = 'none';
        output.innerHTML = '';
        e.target.innerText = 'Convert';
        return;
    }
    let placeholder = document.createElement('div');
    placeholder.style.width = '60vw'
    placeholder.style.background = '#333333';
    placeholder.style.color = '#f2f2f2'
    placeholder.innerHTML = textArea.value;
    outputContainer.style.display = null;
    document.body.appendChild(placeholder);
    outputValue = w.convert(placeholder);
    output.appendChild(outputValue);
    textArea.style.display = 'none';
    e.target.innerText = 'Reset';

    placeholder.remove();
});

previewBtn.addEventListener('click',function(e){
    output.appendChild(outputValue)
})

codeBtn.addEventListener('click',function(e){
    output.innerText = outputValue
})

// document.querySelector('#action').click();

// console.log(w.cssParser.parse(document.querySelector('#sample > div'), false))
