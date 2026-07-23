const catGenreMood = {
    "music": {
        "genre": ["Pop", "Rock", "Hip-Hop", "R&B", "Jazz", "Classical", "EDM", "Country", "Indie", "Lo-fi"],
        "mood": ["Happy", "Sad", "Relaxed", "Energetic", "Romantic", "Focus", "Nostalgic", "Motivational", "Chill", "Angry"]
    },
    "movie-series": {
        "genre": ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"],
        "mood": ["Feel-Good", "Dark", "Suspenseful", "Emotional", "Inspirational", "Funny", "Mind-Bending", "Romantic", "Epic", "Relaxing"]
    },
    "anime": {
        "genre": ["Shonen", "Shojo", "Seinen", "Isekai", "Fantasy", "Slice of Life", "Romance", "Comedy", "Psychological", "Mecha"],
        "mood": ["Wholesome", "Emotional", "Intense", "Funny", "Dark", "Exciting", "Relaxing", "Heartwarming", "Epic", "Mysterious"]
    },
    "acads": {
        "genre": ["Mathematics", "Science", "Programming", "History", "Literature", "Business", "Psychology", "Economics", "Engineering", "Languages"],
        "mood": ["Focused", "Curious", "Motivated", "Stressed", "Relaxed", "Exam Prep", "Creative", "Productive", "Confused", "Inspired"]
    },
    "gaming": {
        "genre": ["Action", "RPG", "FPS", "MOBA", "Strategy", "Simulation", "Puzzle", "Sports", "Horror", "Sandbox"],
        "mood": ["Competitive", "Casual", "Relaxing", "Adventurous", "Intense", "Strategic", "Cozy", "Explorative", "Thrilling", "Creative"]
    },
    "lifestyle": {
        "genre": ["Health", "Fitness", "Travel", "Food", "Fashion", "Productivity", "Self-Care", "Finance", "Home", "Relationships"],
        "mood": ["Healthy", "Motivated", "Relaxed", "Adventurous", "Mindful", "Minimalist", "Luxury", "Cozy", "Productive", "Inspired"]
    }
};
const categoryDropdown = document.getElementById("categoryDropdown");
const genreCon = document.getElementById("genreCon");
const moodCon = document.getElementById("moodCon");

const genreDropdown = document.createElement('select');
genreDropdown.id = 'genreDropdown';


const moodDropdown = document.createElement('select');
moodDropdown.id = 'moodDropdown'

genreCon.append(genreDropdown);
moodCon.append(moodDropdown);

function updateGenreMood() {
    const category = categoryDropdown.value;

    genreDropdown.innerHTML = "";
    moodDropdown.innerHTML = "";

    catGenreMood[category].genre.forEach(element => {
        genreDropdown.add(new Option(element, element));
    });

    catGenreMood[category].mood.forEach(element => {
        moodDropdown.add(new Option(element, element));
    });
}

updateGenreMood();

categoryDropdown.addEventListener('change', updateGenreMood);

const landingPage = document.getElementById("landingPage");
const chatPage = document.getElementById("chatPage");
const chatEntryBttn = document.getElementById("chatEntryBttn");
const chatSpace = document.getElementById("chatSpace");
const messagesArea = document.getElementById("messagesArea");

chatEntryBttn.addEventListener('click', (e) => {
    landingPage.style.display = 'none';
    chatPage.style.display = 'block';
    document.body.classList.add('chatPageActive');
})

const toggleHistoryBtn = document.getElementById('toggleHistory');
const closeHistoryBtn = document.getElementById('closeHistory');

toggleHistoryBtn.addEventListener('click', () => {
    chatPage.classList.toggle('historyOpen');
    toggleHistoryBtn.style.display = 'none';
});

closeHistoryBtn.addEventListener('click', () => {
    chatPage.classList.remove('historyOpen');
    toggleHistoryBtn.style.display = "block";
});

function typeText(element, text, speed) {
    return new Promise(resolve => {
        let index = 0;

        const interval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text[index++];
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    })
}

function renderUserRequest(query) {
    const userReqContainer = document.createElement('div');
    userReqContainer.className = 'userReqContainer';
    messagesArea.appendChild(userReqContainer);

    const reqTags = document.createElement('div');
    reqTags.className = 'reqTags';

    [query.categoryLabel, query.genre, query.mood].forEach(value => {
        if (!value) return;
        const tag = document.createElement('span');
        tag.className = 'reqTag';
        tag.textContent = value;
        reqTags.appendChild(tag);
    });

    userReqContainer.appendChild(reqTags);

    if (query.additionalInfo && query.additionalInfo.trim()) {
        const reqNote = document.createElement('p');
        reqNote.className = 'reqNote';
        reqNote.textContent = query.additionalInfo;
        userReqContainer.appendChild(reqNote);
    }
}

function createSkeletonLoader() {
    const skeleton = document.createElement('div');
    skeleton.className = 'recSkeleton';

    for (let i = 0; i < 3; i++) {
        const skelCard = document.createElement('div');
        skelCard.className = 'skelCard';

        const skelImg = document.createElement('div');
        skelImg.className = 'skelImg';

        const skelBody = document.createElement('div');
        skelBody.className = 'skelBody';

        const skelTitle = document.createElement('div');
        skelTitle.className = 'skelLine skelLine-title';

        const skelLine1 = document.createElement('div');
        skelLine1.className = 'skelLine';

        const skelLine2 = document.createElement('div');
        skelLine2.className = 'skelLine skelLine-short';

        skelBody.append(skelTitle, skelLine1, skelLine2);
        skelCard.append(skelImg, skelBody);
        skeleton.appendChild(skelCard);
    }
    return skeleton;
}

function ensureLightbox() {
    let lightbox = document.getElementById('imgLightbox');
    if (lightbox) return lightbox;

    lightbox = document.createElement('div');
    lightbox.id = 'imgLightbox';
    lightbox.className = 'imgLightbox';
    lightbox.setAttribute('aria-hidden', 'true');

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'lightboxClose';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    const lightboxImg = document.createElement('img');
    lightboxImg.className = 'lightboxImg';
    lightboxImg.alt = '';

    lightbox.append(closeBtn, lightboxImg);
    document.body.appendChild(lightbox);

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('isOpen')) closeLightbox();
    });

    return lightbox;
}

function openLightbox(src, alt) {
    if (!src) return;
    const lightbox = ensureLightbox();
    const img = lightbox.querySelector('.lightboxImg');
    img.src = src;
    img.alt = alt || '';
    lightbox.classList.add('isOpen');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('imgLightbox');
    if (!lightbox) return;
    lightbox.classList.remove('isOpen');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

async function displayRecommendations(aiResponseContainer, output) {
    let index = 0;
    for (const recommendation of output.recommendations) {
        index++;

        const recCard = document.createElement("div");
        recCard.className = "recCard";

        const recIndex = document.createElement("span");
        recIndex.className = "recIndex";
        recIndex.textContent = String(index).padStart(2, "0");

        const recBody = document.createElement("div");
        recBody.className = "recBody";

        const recTitle = document.createElement("h4");
        recTitle.className = "recTitle";

        const recDesc = document.createElement("p");
        recDesc.className = "recDesc";

        recBody.append(recTitle, recDesc);

        if (recommendation.imageUrl) {
            const recImgWrap = document.createElement("div");
            recImgWrap.className = "recImgWrap";

            const recImg = document.createElement("img");
            recImg.className = "recImg";
            recImg.src = recommendation.imageUrl;
            recImg.alt = recommendation.title;
            recImg.loading = "lazy";
            recImg.addEventListener('click', () => openLightbox(recommendation.imageUrl, recommendation.title));
            recImgWrap.appendChild(recImg);

            recCard.append(recIndex, recImgWrap, recBody);
        } else {
            recCard.classList.add("recCard-noImg");
            recCard.append(recIndex, recBody);
        }

        aiResponseContainer.appendChild(recCard);

        await typeText(recTitle, recommendation.title, 80);
        await typeText(recDesc, recommendation.description, 80);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
}

const form = document.getElementById("inputsForm");

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const category = document.getElementById("categoryDropdown").value;
    const categoryLabel = categoryDropdown.options[categoryDropdown.selectedIndex].text;
    const mood = document.getElementById("moodDropdown").value;
    const genre = document.getElementById("genreDropdown").value;
    const additionalInfo = document.getElementById("addInfo").value;

    chatSpace.classList.add("hasMessages");

    renderUserRequest({ categoryLabel, genre, mood, additionalInfo });
    document.getElementById("addInfo").value = "";

    const aiResponseContainer = document.createElement('div');
    aiResponseContainer.className = 'aiResponseContainer';
    messagesArea.appendChild(aiResponseContainer);

    const statusNote = document.createElement('p');
    statusNote.className = 'reqNote statusNote';
    statusNote.style.display = 'none';
    aiResponseContainer.appendChild(statusNote);

    const skeletonLoader = createSkeletonLoader();
    aiResponseContainer.appendChild(skeletonLoader);
    messagesArea.scrollTop = messagesArea.scrollHeight;

    try {
        const response = await fetch("http://localhost:3000/api/recommendations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category,
                genre,
                mood,
                additionalInfo
            })
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        async function handleEvent(part) {
            if (!part || !part.trim()) return;

            const lines = part.split("\n").map(l => l.trim()).filter(Boolean);
            const eventLine = lines.find(l => l.startsWith("event:"));
            const dataLine = lines.find(l => l.startsWith("data:"));
            if (!eventLine || !dataLine) return;

            const eventType = eventLine.replace("event:", "").trim();
            let data;
            try {
                data = JSON.parse(dataLine.replace("data:", "").trim());
            } catch (parseErr) {
                console.error("Failed to parse SSE data:", dataLine, parseErr);
                return;
            }

            if (eventType === "chunk") {
                return;
            } else if (eventType === "retry") {
                statusNote.textContent = "The model is busy — retrying...";
                statusNote.style.display = 'block';
            } else if (eventType === "done") {
                statusNote.remove();
                skeletonLoader.remove();
                await displayRecommendations(aiResponseContainer, data);
            } else if (eventType === "error") {
                statusNote.remove();
                skeletonLoader.remove();
                const errorNote = document.createElement('p');
                errorNote.className = 'reqNote';
                errorNote.textContent = "Something went wrong: " + data.details;
                aiResponseContainer.appendChild(errorNote);
            }
        }

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                buffer += decoder.decode();
                if (buffer.trim()) {
                    const leftoverParts = buffer.split("\n\n");
                    for (const part of leftoverParts) {
                        await handleEvent(part);
                    }
                }
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split("\n\n");
            buffer = parts.pop();

            for (const part of parts) {
                await handleEvent(part);
            }
        }
    } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        statusNote.remove();
        skeletonLoader.remove();
        const errorNote = document.createElement('p');
        errorNote.className = 'reqNote';
        errorNote.textContent = "Something went wrong: " + error.message;
        aiResponseContainer.appendChild(errorNote);
    }
});



// auths 

const signUpForm = document.getElementById('signupForm');
const logInForm = document.getElementById('loginForm');

signUpForm.addEventListener('submit', function (){


})



logInForm.addEventListener('submit', function (){


    
})