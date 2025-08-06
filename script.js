const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '!@#$%^&*()_+~`{}|:"?><,.?"";';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// ste strength circle color to grey

//set passwordLength
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0,9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97,123));
}

function getrateUpperCase() {
  return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol() {
  const randNum = getRndInteger(0, symbol.length);
  return symbol.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=0){
    setIndicator("#0f0");
  }else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >=6
  ){
    setIndicator("#ff0");
  }else {
    setIndicator("#f00");
  }
}

async function copyContent (){
    try{
        //print karta hai
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }),2000;
}

//shuffle karne ke liye function

function shufflePassword(array){
    //fisher yates method
    for(let i = array.length-1; i>0 ; i--){
        const j= Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str ="";
    array.forEach((el) => (str += el));
    return str;

}

// checkbox wala tick kar na hai 

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

//slider ko move karne pe uska value change ho rha hai 
inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
        copyContent();
}) 


generateBtn.addEventListener('click', () =>{
    //none of the checkbox are selected
    if(checkCount == 0) 
        return;

    if(passwordLength <checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // find new password

    console.log("starting the journey");
    // password empty old
    password = "";

    //let's put the stuff mentioned by checkbox

    // if(uppercaseCheck.checked){
    //     password += generateupperCase();
    // }
    
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funArr = [];

    if(uppercaseCheck.checked)
        funArr.push(getrateUpperCase);

    if(uppercaseCheck.checked)
        funArr.push(generateLowerCase);

    if(uppercaseCheck.checked)
        funArr.push(generateRandomNumber);

    if(uppercaseCheck.checked)
        funArr.push(generateSymbol);

    //compulsory addition
    for(let i=0 ; i<funArr.length; i++){
        password += funArr[i]();
    }

    console.log("compulsory addition is done");

    //remaining addition
    for(let i=0; i<passwordLength.length;i++){
        let randIndex = getRndInteger(0 , funArr.length);
        password += funArr[randIndex]();
    }

    console.log("reaming addition is done");
    //shuffle the password
    password = shufflePassword(Array.from(password));

    console.log("shuffling is done");
    
    // show in UI
    passwordDisplay.value = password;

    console.log("ui addition is done");
    //calculate strength
    calcStrength();
 
})
