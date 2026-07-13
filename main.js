
import { output } from './server/gemini.js'
import { urls } from './server/generateImage.js'

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


function aiChatActions() {
    const userReqContainer = document.createElement('div');
    userReqCon.id = 'userReqCon';

    const aiResponseContainer = document.createElement('div');
    aiResponseCon.id = 'aiResponseCon';

    const aiResImageContainer = document.createElement('div');
    aiResImageCon.id = 'aiResImageCon';


    let image;

    urls.forEach(element => {
        image = document.createElement('img');
        image.src = element;
    });

    aiResImageCon.append(image);
    aiResponseCon.append(aiResImageCon);

    let title = "";
    let description = "";

    for (let i = 0; i < output.recommendations.length; i++) {
        const aiTextContainer = document.createElement('div');
        aiTextContainer.classList = 'aiTextContainer';

        const aiResDesContainer = document.createElement('div');
        aiResDesCon.id = 'aiResDesCon';

        title = output.recommendations[i].title;
        description = output.recommendations[i].description;

        let ttext = "";
        let titleCharacterCount = 0;

        const titleInterval = setInterval(() => {
            if (titleCharacterCount < title.length) {
                ttext += title[titleCharacterCount];
                aiTextContainer.textContent = ttext;
                titleCharacterCount++;
            }
            else {
                clearInterval(titleInterval);
            }
        }, 500)

        let dtext = "";
        let descriptionCharacterCount = 0;

        aiTextContainer.append(aiResDesCon);
        const descriptionInterval = setInterval(() => {
            if (descriptionCharacterCount < description.length) {
                dtext += description[descriptionCharacterCount];
                document.getElementById("aiResDesCon").textContent = dtext;
                descriptionCharacterCount++;
            }
            else {
                clearInterval(descriptionInterval);
            }
        }, 500)
    }
}

const form = document.getElementById("inputsForm");

form.addEventListener('submit', function (e) {
    const category = document.getElementById("categoryDropdown").value;
    const mood = document.getElementById("moodDropdown").value;
    const genre = document.getElementById("genreDropdown").value;
    const additionalInfo = document.getElementById("addInfo").value;

});