import 'dotenv/config';
import { output } from './gemini.js';

const imageSearchTexts = output.recommendations.map(recommendation => recommendation.imageSearchText);
const category = document.getElementById("categoryDropdown").value;


switch (category) {
    case 'music':
        getMusicImageUrls();
    case 'movie-series':
        getMovieImageUrls();
    case 'anime':
        getAnimeImageUrls();
    case 'acads':
        getAcadsImageUrls();
    case 'gaming':
        getGameImageUrls();
    case 'lifestyle':
        getLifestyleImageUrls();
}

async function getMusicImageUrls() {
    const url = `https://itunes.apple.com/search?term=${}`;
    await fetch(url, {
        method: GET,

    })
}

function getAnimeImagesUrls() {
    const url = `https://api.jikan.moe/v4/anime?q=narut`;
    fetch(url, {
        method: GET,
    })
}

function getMovieImagesUrls() {
    const url = '';
    fetch(url, {
        method: GET,
    })

}


function getAcadsImageUrls() {
    const url = `https://commons.wikimedia.org/w/api.php? action = query & generator=search gsrsearch=${}& prop=imageinfo & iiprop=url& format=json`;
    fetch(url, {
        method: GET,

    })
}



function getGameImageUrls() {
    const key = process.env.Rawg;
    const url = `https://api.rawg.io/api/games?search=${}&key=${key}`;
    fetch(url, {
        method: GET,

    })
}


function getLifestyleImageUrls() {
    const url = `https://api.pexels.com/v1/search?query= = Authorization:${}`;
    fetch(url, {
        method: GET,

    })

}


// will return image urls