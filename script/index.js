/*-------------------------
~~~~~~~HTML Elements~~~~~~~ 
-------------------------*/
// Region Section
const regionsButtons = document.querySelector('.regions').children;
const listOfCountries = document.querySelector('.listOfCountries');
const title = document.querySelector('.title');
// Countries Section
const countryInfo = document.querySelector('.country-info');
const totalCases = document.querySelector('.country-info__total-cases').lastElementChild;
const newCases = document.querySelector('.country-info__new-cases').lastElementChild;
const totalDeaths = document.querySelector('.country-info__total-deaths').lastElementChild;
const newDeaths = document.querySelector('.country-info__new-deaths').lastElementChild;
const totalRecovered = document.querySelector('.country-info__total-recovered').lastElementChild;
const criticalCondition = document.querySelector('.country-info__in-critical-condition').lastElementChild;
// chart.js
const graph = document.querySelector('.graph');
const ctx = document.getElementById('myChart').getContext('2d');


/*---------------------------
~~~~~~~Regions Section~~~~~~~ 
---------------------------*/
const covidBaseEndpoint = 'https://corona-api.com/countries';
const isFetched = {
    Europe: false,
    Africa: false,
    Americas: false,
    Asia: false,
    Oceania: false
};

for(let i = 0; i < regionsButtons.length - 1; i++){
    regionsButtons[i].addEventListener('click', regionButtonHandler);
};
regionsButtons[regionsButtons.length - 1].addEventListener('click', allCountriesHandler);

async function regionButtonHandler() {
    const regionName = this.textContent;
    title.textContent = regionName;
    displayElement(title);
    removeElement(countryInfo);

    //if data of clicked region has not fetched yet..
    if(isFetched[regionName] === false) {
        await fetchRegionInfo(regionName);
    }

    fillGraph(regionName);

    drawGraph();

    createCountriesSection(regionName);
};

async function fetchRegionInfo(region) {
    isFetched[region] = true;

    const newRegion = [];
    for(let i = 0; i < regions[region].length; i++){
        const url = `${covidBaseEndpoint}/${regions[region][i].code}`;

        const response = await fetch(url);
        const json = await response.json();
        const data = json.data;


        newRegion.push({
            ...regions[region][i],
            totalCases: data.latest_data.confirmed,
            newCases: data.today.confirmed,
            totalDeaths: data.latest_data.deaths,
            newDeaths: data.today.deaths,
            totalRecovered: data.latest_data.recovered,
            criticalCondition: data.latest_data.critical
        });
    };

    regions[region] = newRegion;
};

function createCountriesSection (region) {
    listOfCountries.innerHTML = "";
    
    regions[region].forEach(country => {
        const button = document.createElement('button');
        button.textContent = country.name;
        listOfCountries.appendChild(button);
        button.addEventListener('click', countryButtonHandler.bind(country));
    });
};


/*-----------------------------
~~~~~~~Countries Section~~~~~~~ 
-----------------------------*/
function countryButtonHandler() {
    title.textContent = this.name;
    totalCases.textContent = this.totalCases;
    newCases.textContent = this.newCases;
    totalDeaths.textContent = this.deaths;
    newDeaths.textContent = this.newDeaths;
    totalRecovered.textContent = this.totalRecovered;
    criticalCondition.textContent = this.criticalCondition;

    removeElement(graph);
    displayElement(countryInfo);
};

async function allCountriesHandler() {
    const regionsNames = ['Europe', 'Africa', 'Americas', 'Asia', 'Oceania'];
    for (let i = 0; i < regionsNames.length; i++){
        if(!isFetched[regionsNames[i]])
            await fetchRegionInfo(regionsNames[i]);
        regions.all = regions.all.concat(regions[regionsNames[i]]);
    };
    
    title.textContent = 'All Countries';

    displayElement(title);
    removeElement(countryInfo);

    fillGraph('all');

    drawGraph();


    createCountriesSection('all');
};


/*----------------------------
~~~~~~~Chart.js Section~~~~~~~ 
----------------------------*/
let labels = [];
let datasets = [];
function drawGraph(){
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            responsive: true,
            title: {
                display: true,
            },
        }
    });
    displayElement(graph);
};

function fillGraph(region) {
    labels = [];
    datasets = [];
    datasets = [
        newDataset('Confirmed Cases', 'rgba(255, 0, 0, 0.5)'),
        newDataset('Number Of Deaths', 'rgba(0, 0, 0, 0.5)'),
        newDataset('Number Of Recovered', 'rgba(0, 255, 0, 0.5)'),
        newDataset('Number Of Critical Condition', 'rgba(0, 0, 255, 0.5)'),
    ];

    const countries = regions[region];

    countries.forEach(country => {
        labels.push(country.name);
        datasets[0].data.push(country.totalCases);
        datasets[1].data.push(country.totalDeaths);
        datasets[2].data.push(country.totalRecovered);
        datasets[3].data.push(country.criticalCondition);
    });
};
function newDataset(label, color){
    return {
        label: label,
        data:[],
        backgroundColor: color,
        borderColor: color,
        pointRadius: 4,
        pointHoverRadius: 15,
        type: 'line',
        hidden: true,
        fill: false,
    }
}


/*----------------------------
~~~~~~~Global Functions~~~~~~~ 
----------------------------*/
function removeElement(element) {
    element.classList.add('display-none')
};

function displayElement(element) {
    element.classList.remove('display-none');
};