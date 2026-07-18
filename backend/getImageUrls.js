import 'dotenv/config';

const FALLBACK_IMAGE = null; 

async function getMusicImageUrls(output) {
    const imageSearchTexts = output.recommendations.map(recommendation => recommendation.imageSearchText);
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(element => {
        let url = `https://itunes.apple.com/search?term=${encodeURIComponent(element)}&limit=1`;
        urls.push(url);
    });


    for (const url of urls){
        const res = await fetch(url);
        const data = await res.json();
        const result = data.results && data.results[0];
        if (!result) {
            console.warn(`No music result for query: ${url}`);
            imageUrls.push(FALLBACK_IMAGE);
            continue;
        }
        let imageUrl = result.artworkUrl100.replace('100x100bb', '600x600bb');
        imageUrls.push(imageUrl);
    };

    return imageUrls;
}

async function getAnimeImageUrls(output) {
    const imageSearchTexts = output.recommendations.map(recommendation => recommendation.imageSearchText);
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(searchText => {
        let url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchText)}&limit=1`;
        urls.push(url);
    });


    for (const url of urls){
        const res = await fetch(url);
        const data = await res.json();
        const result = data.data && data.data[0];
        if (!result) {
            console.warn(`No anime result for query: ${url}`);
            imageUrls.push(FALLBACK_IMAGE);
            continue;
        }
        let imageUrl = result.images.jpg.large_image_url;
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
        let url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(element)}&api_key=${key}`;
        urls.push(url);
    });

    for (const url of urls) {
        const res = await fetch(url);
        const data = await res.json();
        const result = data.results && data.results[0];
        if (!result || !result.poster_path) {
            console.warn(`No movie result/poster for query: ${url}`);
            imageUrls.push(FALLBACK_IMAGE);
            continue;
        }
        let imageUrl = `https://image.tmdb.org/t/p/w780${result.poster_path}`;
        imageUrls.push(imageUrl);
    };

    return imageUrls;
}

async function getAcadsImageUrls(output) {
    const imageSearchTexts = output.recommendations.map(recommendation => recommendation.imageSearchText);
    const urls = [];
    const imageUrls = [];

    imageSearchTexts.forEach(element => {
        let url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=thumbnail&pithumbsize=600&titles=${encodeURIComponent(element)}&format=json`;
        urls.push(url);
    });

    for (const url of urls) {
        const res = await fetch(url);
        const data = await res.json();
        const page = data.query && Object.values(data.query.pages)[0];
        if (!page || !page.thumbnail) {
            console.warn(`No wiki thumbnail for query: ${url}`);
            imageUrls.push(FALLBACK_IMAGE);
            continue;
        }
        let imageUrl = page.thumbnail.source;
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
        let url = `https://api.rawg.io/api/games?search=${encodeURIComponent(element)}&key=${key}`
        urls.push(url);
    });

    for (const url of urls) {
        const res = await fetch(url);
        const data = await res.json();
        const result = data.results && data.results[0];
        if (!result) {
            console.warn(`No game result for query: ${url}`);
            imageUrls.push(FALLBACK_IMAGE);
            continue;
        }
        let imageUrl = result.background_image;
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
        let url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(element)}&per_page=1`;
        urls.push(url);
    });

    for (const url of urls) {
        const res = await fetch(url, { headers: {Authorization: key }
        });
        const data = await res.json();
        const result = data.photos && data.photos[0];
        if (!result) {
            console.warn(`No lifestyle photo for query: ${url}`);
            imageUrls.push(FALLBACK_IMAGE);
            continue;
        }
        let imageUrl = result.src.large2x;
        imageUrls.push(imageUrl);
    };
    return imageUrls;
}


export function getUrls(category, output) {
    switch (category.toLowerCase()) {
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
