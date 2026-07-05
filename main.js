

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

const moodDropdown = document.createElement('select');

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

function gotoChat(){
    landingPage.style.display = 'none';
    chatPage.style.display = 'block';
}

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