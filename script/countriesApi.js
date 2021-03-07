const baseEndpoint = 'https://restcountries.herokuapp.com/api/v1';
const proxy = 'https://api.codetabs.com/v1/proxy/?quest';

const regions = {};


async function getAllCountries() {
    const response = await fetch(`${proxy}=${baseEndpoint}`);

    const data = await response.json();

    const countries = [];

    //Mapping the entire countries 
    for(let i = 0; i < data.length; i++){
        if(!['Kosovo'].includes(data[i].name.common))
            countries.push({name: data[i].name.common, region: data[i].region,  code: data[i].cca2 })
    }

    //Sortting the countries by region name
    countries.forEach(country => {
        if(regions[country.region])
            regions[country.region].push(country);
        else 
            regions[country.region] = [country];
    }); 

    loadingDone();
}


getAllCountries();