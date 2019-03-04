let changeColor = document.getElementById('changeColor');
var bkg = chrome.extension.getBackgroundPage();


chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function (element) {
    var els = document.querySelectorAll('h2');
    console.log(els)
    els.forEach(function (e) {
        if (e.outerText === "Drops") {
            bkg.console.log("hssey");

            console.log(e)
        }
    })
    let color = element.target.value;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { file: 'contentScript.js' });
    });
};