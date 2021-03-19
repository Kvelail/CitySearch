const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search');
const searchSuggestions = document.querySelector('.search-suggestions');
const searchInfo = document.querySelector('.search-info');
const searchMap = document.querySelector('#search-map');

const cities = [];

window.addEventListener('DOMContentLoaded', async () => {

    const response = await fetch(endpoint);
    const data = await response.json();
    cities.push(...data);

});

/* Search Form */

const findMatches = (wordToMatch, cities) => {

    return cities.filter(place => {

        const regex = new RegExp(wordToMatch, 'gi');
        return place.city.match(regex) || place.state.match(regex);

    });

};

function displayMatches() {
    const matchArray = findMatches(this.value, cities);

    const html = matchArray.map(place => {
        const regex = new RegExp(this.value, 'gi');
        const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
        const cityState = place.state.replace(regex, `<span class="hl">${this.value}</span>`);

        return `
            <li onClick="updateCity(${place.rank})">
                <span class="result-city">${cityName}</span>
                <span class="result-state">${cityState}</span>
            </li>
        `;
    });

    searchSuggestions.innerHTML = html;
    searchSuggestions.style.opacity = 1;
    
}

const removeSuggestions = () => {
    if(searchInput.value === '') {
        searchSuggestions.innerHTML = '';
        searchSuggestions.style.opacity = 0;
    }
};

searchForm.addEventListener('submit', e => e.preventDefault());
searchInput.addEventListener('keyup', displayMatches);
searchInput.addEventListener('keyup', removeSuggestions);

/* End of Search Form */

/* Update UI */

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const updateCity = id => {
    const place = cities.find(item => item.rank == id);

    const html = `
            <div class="search-info-top">
                <h2 class="search-info-city">${place.city}</h2>
                <h2 class="search-info-state">${place.state}</h2>
            </div>
            <ul class="search-info-list">
                <li>
                    <span>population: </span>
                    <span class="search-info-population">${numberWithCommas(place.population)}</span>
                </li>
                <li>
                    <span>growth from 2000 to 2013: </span>
                    <span class="search-info-growth">${place.growth_from_2000_to_2013}</span>
                </li>
                <li>
                    <span>latitude:</span>
                    <span class="search-info-latitude">${place.latitude}</span>
                </li>
                <li>
                    <span>longitude:</span>
                    <span class="search-info-longitude">${place.longitude}</span>
                </li>
            </ul>
    `;

    marker.setLatLng([place.latitude, place.longitude]);
    mymap.setView([place.latitude, place.longitude], 4);
    searchMap.style.opacity = 1;
   
    searchInfo.innerHTML = html;
    searchInfo.style.opacity = 1;
    searchSuggestions.innerHTML = '';
    searchSuggestions.style.opacity = 0;
    searchInput.value = '';
};

/* End of Update UI */

/* Search Map */

const mymap = L.map('search-map').setView([0, 0], 1);
const marker = L.marker([37.0902, 95.7129]).addTo(mymap);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });

tiles.addTo(mymap);

/* End of Search Map */

