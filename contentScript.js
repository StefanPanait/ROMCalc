var drops = []
var perMobAverage = 0;
/*
{
    name
    dropRate
    price
    element
}
*/

function scrapePage() {
    document.querySelectorAll('h2').forEach(function (e) {
        if (e.outerText === "Drops") {
            element = e.nextElementSibling;
            while (true) {
                dropRate = (element.innerText.match(/[0-9]+\.[0-9]+/) !== null) ? element.innerText.match(/[0-9]+\.[0-9]+/)[0] : 0;
                name = element.innerText.replace(/\([0-9]+\.[0-9]+\%\)/, "").trim()
                drops.push({
                    name: name,
                    dropRate: dropRate,
                    element: element
                })
                if (element.nextElementSibling === null) break;
                element = element.nextElementSibling;
            }
        }
    })
}

function calculateAverages() {
    drops.forEach(function (drop) {
        if (!drop.hasOwnProperty('price')) return;
        if (!drop.hasOwnProperty('dropRate')) return;
        drop.perKill = Math.round(drop.dropRate * drop.price / 100);
        drop.element.innerHTML = drop.element.innerHTML + " " + drop["perKill"] + " Z / EA"
        perMobAverage = perMobAverage + drop.perKill;
    })
    document.querySelectorAll('h1')[0].innerHTML = document.querySelectorAll('h1')[0].innerHTML + " ("+perMobAverage+")";
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

function populatePrices() {
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
        calculateAverages();
    });
}

scrapePage()
populatePrices()
