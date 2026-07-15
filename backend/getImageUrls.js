import 'dotenv/config';

const category = document.getElementById("categoryDropdown").value;

async function getMusicImageUrls(output) {
    const imageSearchTexts = output.recommendations.map(recommendation => recommendation.imageSearchText);
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(element => {
        let url = `https://itunes.apple.com/search?term=${element}`;
        urls.push(url);
    });


    for (const url of urls){
        const res = await fetch(url);
        const data = await res.json();
        let imageUrl = data.results[0].artworkUrl100;
        imageUrls.push(imageUrl);
    };

    return imageUrls;
}

async function getAnimeImageUrls(output) {
    const imageSearchTexts = output.recommendations.map(recommendation => recommendation.imageSearchText);
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(searchText => {
        let url = `https://api.jikan.moe/v4/anime?q=${searchText}`;
        urls.push(url);
    });


    for (const url of urls){
        const res = await fetch(url);
        const data = await res.json();
        let imageUrl = data.data[0].images.jpg.large_image_url;
        imageUrls.push(imageUrl);
    };

    return imageUrls;
}

async function getMovieImageUrls(output) {
    const imageSearchTexts = output.recommendations.map(recommendation => recommendation.imageSearchText);
    const urls = [];
    const imageUrls = [];
    const key = process.env.TMDKey;

    imageSearchTexts.forEach(element => {
        let url = `https://api.themoviedb.org/3/search/movie?query=${element}&api_key=${key}`;
        urls.push(url);
    });

    for (const url of urls) {
        const res = await fetch(url);
        const data = await res.json();
        let imageUrl = `https://image.tmdb.org/t/p/original${data.results[0].poster_path}`;
        imageUrls.push(imageUrl);
    };

    return imageUrls;
}

async function getAcadsImageUrls(output) {
    const imageSearchTexts = output.recommendations.map(recommendation => recommendation.imageSearchText);
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(element => {
        let url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=original&titles=${element}&format=json`;
        urls.push(url);
    });

    for (const url of urls) {
        const res = await fetch(url);
        const data = await res.json();
        const page = Object.values(data.query.pages)[0];
        let imageUrl = page.original.source;
        imageUrls.push(imageUrl);
    };
    return imageUrls;
}

async function getGameImageUrls(output) {
    const imageSearchTexts = output.recommendations.map(recommendation => recommendation.imageSearchText);
    const key = process.env.Rawg;
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(element => {
        let url = `https://api.rawg.io/api/games?search=${element}&key=${key}`
        urls.push(url);
    });

    for (const url of urls) {
        const res = await fetch(url);
        const data = await res.json();
        let imageUrl = data.results[0].background_image;
        imageUrls.push(imageUrl);
    };
    return imageUrls;

}

async function getLifestyleImageUrls(output) {
    const imageSearchTexts = output.recommendations.map(recommendation => recommendation.imageSearchText);
    const key = process.env.pexel;
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(element => {
        let url = `https://api.pexels.com/v1/search?query=${element}= Authorization:${key}`;
        urls.push(url);
    });

    for (const url of urls) {
        const res = await fetch(url);
        const data = await res.json();
        let imageUrl = data.photos[0].src.original
        imageUrls.push(imageUrl);
    };
    return imageUrls;
}


export function getUrls(category, output) {
    switch (category) {
        case 'music':
            return getMusicImageUrls(output);
        case 'movie-series':
            return getMovieImageUrls(output);
        case 'anime':
            return getAnimeImageUrls(output);
        case 'acads':
            return getAcadsImageUrls(output);
        case 'gaming':
            return getGameImageUrls(output);
        case 'lifestyle':
            return getLifestyleImageUrls(output);
        default:
            return [];
    }
}




// will return image urls
// 

