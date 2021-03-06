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
}

for(let i = 0; i < regionsButtons.length; i++){
    regionsButtons[i].addEventListener('click', regionButtonHandler);
};

async function regionButtonHandler() {
    const regionName = this.textContent;
    title.textContent = regionName;
    displayElement(title);
    removeElement(countryInfo);

    //if data of clicked region has not fetched yet..
    if(isFetched[regionName] === false) {
        await fetchRegionInfo(regionName);
    }

    createCountriesSection(regionName);

} ;

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
}

function createCountriesSection (region) {
    listOfCountries.innerHTML = "";
    
    regions[region].forEach(country => {
        const button = document.createElement('button');
        button.textContent = country.name;
        listOfCountries.appendChild(button);
        button.addEventListener('click', countryButtonHandler.bind(country));
    });
}


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

    displayElement(countryInfo)
};


/*----------------------------
~~~~~~~Chart.js Section~~~~~~~ 
----------------------------*/



/*----------------------------
~~~~~~~Global Functions~~~~~~~ 
----------------------------*/
function removeElement(element) {
    element.classList.add('display-none')
}

function displayElement(element) {
    element.classList.remove('display-none');
}



