const baseEndpoint = 'https://restcountries.herokuapp.com/api/v1';
const proxy = 'https://api.allorigins.win/raw?url';


async function getAllTheCountries() {
    const response = await fetch(`${proxy}=${baseEndpoint}`);

    const data = await response.json();

    const countryToRegion = {};

    for(let i = 0; i < data.length; i++)
        countryToRegion[data[i].name.common] = data[i].region;

    return countryToRegion;
}

getAllTheCountries();