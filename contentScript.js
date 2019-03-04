let baseLevelModifier = 1,
    monsterLevel;
/*
drops = {
    name
    dropRate
    price
    element
}
*/
let drops = [];
let perMobAverage = 0;

function main() {
    // listen for changes to base level
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) { 
            // validate that base level is reasonable
            if (isNaN(request.baseLevel) || request.baseLevel < 1) {
                window.localStorage.removeItem('baseLevel');
                baseLevelModifier = 1;
            } else { // if not remove it and set modifier to 1
                window.localStorage.setItem('baseLevel', request.baseLevel);
                baseLevelModifier = getBaseLevelModifiers(window.localStorage.getItem('baseLevel'), monsterLevel);
            }
            calculateAveragesAndPublish();
        });
    scrapeAndInject()
    caculatePricesAsync().then(function () {
        calculateAveragesAndPublish();
    })
}
function scrapeAndInject() {
    //get drops
    document.querySelectorAll('h2').forEach(function (e) {
        if (e.outerText === "Drops") {
            e = e.nextElementSibling;
            while (true) {
                dropRate = (e.innerText.match(/[0-9]+\.[0-9]+/) !== null) ? e.innerText.match(/[0-9]+\.[0-9]+/)[0] : 0;
                name = e.innerText.replace(/\([0-9]+\.[0-9]+\%\)/, "").trim()
                e.innerHTML = e.innerHTML + "<span id='" + name + "'></span>"
                element = document.getElementById(name);
                drops.push({
                    name: name,
                    dropRate: dropRate,
                    element: element
                })
                if (e.nextElementSibling === null) break;
                e = e.nextElementSibling;
            }
        }
        //get monster level
        if (e.outerText === "Common") {
            monsterLevel = e.nextElementSibling.innerText.split('\n')[1].split('Level')[1].trim();
        }
    })
    document.querySelectorAll('h1')[0].innerHTML = document.querySelectorAll('h1')[0].innerHTML + "<span id='perMobAverage'></span>"
}
function rejectExchangeRequest() {
    console.log("rejected")
}
function getExchangePrice(drop) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://www.romexchange.com/api?item=" + drop.name + "&exact=true&slim=true");
        xhr.onload = () => resolve({
            response: xhr.responseText,
            drop: drop
        });
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });
}
function caculatePricesAsync() {
    return new Promise((resolve, reject) => {
        exchangePromises = []
        for (i = 0; i < drops.length; i++) {
            if (drops[i].name.includes("Zeny")) {
                drops[i].price = drops[i].name.match(/^[0-9]+/)[0];
            }
            exchangePromises.push(getExchangePrice(drops[i]))
        }
        Promise.all(exchangePromises).then(function (values) {
            values.forEach(function (e) {
                // empty response means lookup failed
                if (JSON.parse(e.response).length === 0) return;
                e.drop.price = JSON.parse(e.response)[0].global.latest
            });
            resolve();
        });
    });
}
function calculateAveragesAndPublish() {
    perMobAverage = 0;
    baseLevel = window.localStorage.getItem('baseLevel');
    drops.forEach(function (drop) {
        if (!drop.hasOwnProperty('price')) return;
        if (!drop.hasOwnProperty('dropRate')) return;
        drop.perKill = Math.round((drop.dropRate * drop.price * baseLevelModifier / 100));
        drop.element.innerText = drop.perKill + "z / kill"
        perMobAverage = Math.round(perMobAverage + drop.perKill);
    })
    if (typeof baseLevel !== undefined && baseLevel !== null) {
        document.getElementById('perMobAverage').innerText = " (" + perMobAverage + "z / kill @ lvl " + baseLevel + ")";
    } else {
        document.getElementById('perMobAverage').innerText = " (" + perMobAverage + "z / kill)";
    }
}

main();
