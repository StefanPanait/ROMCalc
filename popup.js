function sendBaseLevel(baseLevel) {
    window.localStorage.setItem('baseLevel', baseLevel);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { baseLevel: baseLevel });
    });
}
document.getElementById('baseLevel').onchange = function () {
    sendBaseLevel(this.value);
}
// base level already set
if (typeof window.localStorage.getItem('baseLevel') !== undefined) {
    baseLevel = window.localStorage.getItem('baseLevel');
    document.getElementById('baseLevel').value = baseLevel
    sendBaseLevel(baseLevel);
}