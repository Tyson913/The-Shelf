import 'dotenv/config';
import { output } from './gemini.js';

const imageSearchTexts = output.recommendations.map(recommendation => recommendation.imageSearchText);
const category = document.getElementById("categoryDropdown").value;

async function getMusicImageUrls() {
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(element => {
        let url = `https://itunes.apple.com/search?term=${element}`;
        urls.push(url);
    });


    urls.forEach(url => {
        let res = await fetch(url);
        let data = await res.json();
        let imageUrl = data.results[0].artworkUrl100;
        imageUrls.push(imageUrl);
    });

    return imageUrls;
}

async function getAnimeImagesUrls() {
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(searchText => {
        let url = `https://api.jikan.moe/v4/anime?q=${searchText}`;
        urls.push(url);
    });


    urls.forEach(url => {
        let res = await fetch(url);
        let data = await res.json();
        let imageUrl = data.data[0].images.jpg.large_image_url;
        imageUrls.push(imageUrl);
    });

    return imageUrls;
}

async function getMovieImagesUrls() {
    const urls = [];
    const imageUrls = []
    const key = process.env.TMDKey;

    imageSearchTexts.forEach(element => {
        let url = `https://api.themoviedb.org/3/search/movie?query=${element}&api_key=${key}`;
        urls.push(url);
    });

    urls.forEach(url => {
        let res = await fetch(url);
        let data = await res.json();
        let imageUrl = `https://image.tmdb.org/t/p/original${data.poster_path}`;
    });

    return imageUrls;
}


async function getAcadsImageUrls() {
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(element => {
        let url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=original&titles=${element}&format=json`;
        urls.push(url);
    });

    urls.forEach(url => {
        let res = await fetch(url);
        let data = await res.json();
        let page = Object.values(data.query.pages)[0];
        let imageUrl = page.original.source;
        imageUrls.push(imageUrl);
    });
    return imageUrls;
}

async function getGameImageUrls() {
    const key = process.env.Rawg;
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(element => {
        let url = `https://api.rawg.io/api/games?search=${element}&key=${key}`
        urls.push(url);
    });

    urls.forEach(url => {
        let res = await fetch(url);
        let data = await res.json();
        let imageUrl = data.results[0].background_image;
        imageUrls.push(imageUrl);
    });
    return imageUrls;

}


async function getLifestyleImageUrls() {
    const key = process.env.pexel;
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(element => {
        let url = `https://api.pexels.com/v1/search?query=${element}= Authorization:${key}`;
        urls.push(url);
    });

    urls.forEach(url => {
        let res = await fetch(url);
        let data = await res.json();
        let imageUrl = data.photos[0].src.original
        imageUrls.push(imageUrl);
    });

    return imageUrls;
}


function getUrls() {
    let urls = [];
    switch (category) {
        case 'music':
            urls = getMusicImageUrls();
        case 'movie-series':
            urls = getMovieImageUrls();
        case 'anime':
            urls = getAnimeImageUrls();
        case 'acads':
            urls = getAcadsImageUrls();
        case 'gaming':
            urls = getGameImageUrls();
        case 'lifestyle':
            urls = getLifestyleImageUrls();
    }
    return urls;
}

export const urls = getUrls();


// will return image urls
// 

