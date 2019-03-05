
let dataFixer_;
const currencyDom = document.getElementById('currency');
const amountDom = document.getElementById('amount');
const amountInput = document.getElementById('amount-input');
const amountOutput = document.getElementById('amount-output');
const currencyInput = document.getElementById('currency-input');
const currencyOutput = document.getElementById('currency-output');

function dataFixer() {
    const url = 'http://data.fixer.io/api/latest?access_key=7e8cc33de57686338386718cb87adc00&format=1';
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.status)
                }
            }
        }
        xhr.ontimeout = function () {
            reject('timeout')
        }
        xhr.open('get', url, true)
        xhr.send()
    })
}

dataFixer().then((data) => {
    dataFixer_ = JSON.parse(data);
    let dataRates = dataFixer_.rates;

    // List donw all of currency
    let curreny = Object.keys(dataRates);
    for (let cur in curreny) {
        if (curreny.hasOwnProperty(cur)) {
            const optionCurrency = '<option value="' + curreny[cur] + '">' + curreny[cur] + '</option>'
            currencyDom.children[0].insertAdjacentHTML('beforeend', optionCurrency);
            currencyDom.children[1].insertAdjacentHTML('beforeend', optionCurrency);
        }
    }

});

function calculator(isSwap = false) {
    dataRates = dataFixer_.rates;
    let amountDom_in = amountDom.children[0].value;
    let amountDom_out = amountDom.children[1].value;
    let currencyDom_in = currencyDom.children[0].value;
    let currencyDom_out = currencyDom.children[1].value;

    let Rate_curIn = dataRates[currencyDom_in];
    let Rate_curOut = dataRates[currencyDom_out];

    if (isSwap) {
        amountDom_in = amountDom_out * Rate_curIn / Rate_curOut;
    } else {
        amountDom_out = amountDom_in * Rate_curOut / Rate_curIn;
    }

    amountDom.children[0].value = parseFloat(amountDom_in).toFixed(2);
    amountDom.children[1].value = parseFloat(amountDom_out).toFixed(2);
}

currencyDom.addEventListener('change', () => calculator());

amountDom.children[0].addEventListener('change', () => calculator());
amountDom.children[1].addEventListener('change', () => calculator(true));

