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


function aiChatActions(output, urls, query) {
    chatSpace.classList.add('hasMessages');

    const userReqContainer = document.createElement('div');
    userReqContainer.className = 'userReqContainer';

    const reqTags = document.createElement('div');
    reqTags.className = 'reqTags';
    [query.categoryLabel, query.genre, query.mood].forEach(text => {
        const tag = document.createElement('span');
        tag.className = 'reqTag';
        tag.textContent = text;
        reqTags.append(tag);
    });
    userReqContainer.append(reqTags);

    if (query.additionalInfo) {
        const reqNote = document.createElement('p');
        reqNote.className = 'reqNote';
        reqNote.textContent = query.additionalInfo;
        userReqContainer.append(reqNote);
    }

    messagesArea.append(userReqContainer);


    const aiResponseContainer = document.createElement('div');
    aiResponseContainer.className = 'aiResponseContainer';

    messagesArea.append(aiResponseContainer);

    const aiResImageContainer = document.createElement('div');
    aiResImageContainer.className = 'aiResImageContainer';

    let image;

    urls.forEach(element => {
        image = document.createElement('img');
        image.src = element;
        aiResImageContainer.append(image);
    });

    aiResponseContainer.append(aiResImageContainer);

    let title = "";
    let description = "";

    for (let i = 0; i < output.recommendations.length; i++) {
        const aiTextContainer = document.createElement('div');
        aiTextContainer.className = 'aiTextContainer';

        const aiResTitleContainer = document.createElement('div');
        aiResTitleContainer.className = 'aiResTitleContainer';

        const aiResDesContainer = document.createElement('div');
        aiResDesContainer.className = 'aiResDesContainer';

        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'copyBtn';
        copyBtn.setAttribute('aria-label', 'Copy response');
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';

        title = output.recommendations[i].title;
        description = output.recommendations[i].description;

        aiTextContainer.append(aiResTitleContainer);

        let ttext = "";
        let titleCharacterCount = 0;

        const titleInterval = setInterval(() => {
            if (titleCharacterCount < title.length) {
                ttext += title[titleCharacterCount];
                aiResTitleContainer.textContent = ttext;
                titleCharacterCount++;
            }
            else {
                clearInterval(titleInterval);
            }
        }, 5000)

        let dtext = "";
        let descriptionCharacterCount = 0;

        aiTextContainer.append(aiResDesContainer);
        const descriptionInterval = setInterval(() => {
            if (descriptionCharacterCount < description.length) {
                dtext += description[descriptionCharacterCount];
                aiResDesContainer.textContent = dtext;
                descriptionCharacterCount++;
            }
            else {
                clearInterval(descriptionInterval);
            }
        }, 5000)

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(`${title}\n\n${description}`).then(() => {
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
                }, 1500);
            });
        });

        aiTextContainer.append(copyBtn);
        aiResponseContainer.append(aiTextContainer);
    }

    messagesArea.scrollTop = messagesArea.scrollHeight;
}

const form = document.getElementById("inputsForm");

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const category = document.getElementById("categoryDropdown").value;
    const categoryLabel = categoryDropdown.options[categoryDropdown.selectedIndex].text;
    const mood = document.getElementById("moodDropdown").value;
    const genre = document.getElementById("genreDropdown").value;
    const additionalInfo = document.getElementById("addInfo").value;
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
        const data = await response.json();
        const imageUrls = data.recommendations.map(recommendation => recommendation.imageUrl);
        aiChatActions(data, imageUrls, { categoryLabel, genre, mood, additionalInfo });
        document.getElementById("addInfo").value = "";
    } catch (error) {
        console.error("Failed to fetch recommendations:", error);
    }
});