import 'dotenv/config';

const FALLBACK_IMAGE = null;

function normalize(str) {
    return (str || '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '') 
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function bigrams(str) {
    const grams = [];
    for (let i = 0; i < str.length - 1; i++) {
        grams.push(str.substring(i, i + 2));
    }
    return grams;
}

function diceCoefficient(a, b) {
    const bigramsA = bigrams(a);
    const bigramsB = bigrams(b);
    if (bigramsA.length === 0 || bigramsB.length === 0) {
        return a === b ? 1 : 0;
    }
    const bag = new Map();
    bigramsB.forEach(g => bag.set(g, (bag.get(g) || 0) + 1));
    let matches = 0;
    bigramsA.forEach(g => {
        const count = bag.get(g);
        if (count > 0) {
            matches++;
            bag.set(g, count - 1);
        }
    });
    return (2 * matches) / (bigramsA.length + bigramsB.length);
}

function isReasonableMatch(query, candidates, threshold = 0.4) {
    const q = normalize(query);
    if (!q) return true;
    return candidates.filter(Boolean).some(candidate => {
        const c = normalize(candidate);
        if (!c) return false;
        if (c.includes(q) || q.includes(c)) return true;
        return diceCoefficient(q, c) >= threshold;
    });
}

async function fetchJson(url, options = {}) {
    let res = await fetch(url, options);
    if (res.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 500));
        res = await fetch(url, options);
    }
    if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
    }
    return res.json();
}


async function resolveMusicImage(recommendation) {
    const { title, creator } = recommendation;

    const search = async term => {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=5`;
        const data = await fetchJson(url);
        const results = data.results || [];
        return results.find(r => isReasonableMatch(title, [r.trackName]));
    };

    try {
        let match = creator ? await search(`${title} ${creator}`) : null;
        if (!match) match = await search(title);
        if (!match) {
            console.warn(`No validated music match for: ${title}`);
            return FALLBACK_IMAGE;
        }
        return match.artworkUrl100.replace('100x100bb', '600x600bb');
    } catch (err) {
        console.error("iTunes request errored:", title, err);
        return FALLBACK_IMAGE;
    }
}

async function resolveAnimeImage(recommendation) {
    const { title } = recommendation;
    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=5`;

    try {
        const data = await fetchJson(url);
        const results = data.data || [];
        const match = results.find(r => isReasonableMatch(title, [
            r.title,
            r.title_english,
            ...(Array.isArray(r.titles) ? r.titles.map(t => t.title) : [])
        ]));
        if (!match) {
            console.warn(`No validated anime match for: ${title}`);
            return FALLBACK_IMAGE;
        }
        return match.images.jpg.large_image_url;
    } catch (err) {
        console.error("Jikan request errored:", title, err);
        return FALLBACK_IMAGE;
    }
}

async function resolveMovieImage(recommendation) {
    const { title, year, type } = recommendation;
    const key = process.env.TMDKey;
    const isTv = (type || '').toLowerCase() === 'tv';
    const endpoint = isTv ? 'tv' : 'movie';

    const search = async withYear => {
        const yearParam = (withYear && year)
            ? (isTv ? `&first_air_date_year=${encodeURIComponent(year)}` : `&year=${encodeURIComponent(year)}`)
            : '';
        const url = `https://api.themoviedb.org/3/search/${endpoint}?query=${encodeURIComponent(title)}${yearParam}&api_key=${key}`;
        const data = await fetchJson(url);
        const results = data.results || [];
        return results.find(r =>
            r.poster_path &&
            isReasonableMatch(title, [r.title, r.name, r.original_title, r.original_name])
        );
    };

    try {
        let match = year ? await search(true) : null;
        if (!match) match = await search(false);
        if (!match) {
            console.warn(`No validated ${endpoint} match for: ${title}`);
            return FALLBACK_IMAGE;
        }
        return `https://image.tmdb.org/t/p/w780${match.poster_path}`;
    } catch (err) {
        console.error("TMDB request errored:", title, err);
        return FALLBACK_IMAGE;
    }
}

async function resolveAcadsImage(recommendation) {
    const { title } = recommendation;

    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(title)}&srlimit=3&format=json`;
        const searchData = await fetchJson(searchUrl);
        const candidates = (searchData.query && searchData.query.search) || [];

        if (candidates.length === 0) {
            console.warn(`No wiki page found for: ${title}`);
            return FALLBACK_IMAGE;
        }

        for (const candidate of candidates) {
            const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=thumbnail&pithumbsize=600&pageids=${candidate.pageid}&format=json`;
            const imgData = await fetchJson(imageUrl);
            const page = imgData.query && Object.values(imgData.query.pages)[0];
            if (page && page.thumbnail) {
                return page.thumbnail.source;
            }
        }

        console.warn(`No wiki thumbnail among top candidates for: ${title}`);
        return FALLBACK_IMAGE;
    } catch (err) {
        console.error("Wikipedia request errored:", title, err);
        return FALLBACK_IMAGE;
    }
}

async function resolveGameImage(recommendation) {
    const { title, year } = recommendation;
    const key = process.env.Rawg;

    const search = async withYear => {
        const datesParam = (withYear && year)
            ? `&dates=${encodeURIComponent(`${year}-01-01,${year}-12-31`)}`
            : '';
        const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(title)}${datesParam}&page_size=5&key=${key}`;
        const data = await fetchJson(url);
        const results = data.results || [];
        return results.find(r => isReasonableMatch(title, [r.name]));
    };

    try {
        let match = year ? await search(true) : null;
        if (!match) match = await search(false);
        if (!match) {
            console.warn(`No validated game match for: ${title}`);
            return FALLBACK_IMAGE;
        }
        return match.background_image;
    } catch (err) {
        console.error("RAWG request errored:", title, err);
        return FALLBACK_IMAGE;
    }
}

async function resolveLifestyleImage(recommendation) {
    const { title } = recommendation;
    const key = process.env.pexel;
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(title)}&per_page=1`;

    try {

        const data = await fetchJson(url, { headers: { Authorization: key } });
        const result = data.photos && data.photos[0];
        if (!result) {
            console.warn(`No lifestyle photo for: ${title}`);
            return FALLBACK_IMAGE;
        }
        return result.src.large2x;
    } catch (err) {
        console.error("Pexels request errored:", title, err);
        return FALLBACK_IMAGE;
    }
}

async function getMusicImageUrls(output) {
    return Promise.all(output.recommendations.map(resolveMusicImage));
}

async function getAnimeImageUrls(output) {
    return Promise.all(output.recommendations.map(resolveAnimeImage));
}

async function getMovieImageUrls(output) {
    return Promise.all(output.recommendations.map(resolveMovieImage));
}

async function getAcadsImageUrls(output) {
    return Promise.all(output.recommendations.map(resolveAcadsImage));
}

async function getGameImageUrls(output) {
    return Promise.all(output.recommendations.map(resolveGameImage));
}

async function getLifestyleImageUrls(output) {
    return Promise.all(output.recommendations.map(resolveLifestyleImage));
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