function aiChatActions(output, urls) {
    const userReqContainer = document.createElement('div');
    userReqContainer.id = 'userReqContainer';
    chatPage.append(userReqContainer);


    const aiResponseContainer = document.createElement('div');
    aiResponseContainer.id = 'aiResponseContainer';

    chatPage.append(aiResponseContainer);

    const aiResImageContainer = document.createElement('div');
    aiResImageContainer.className = 'aiResImageContainer';

    chatPage.append(aiResImageContainer);
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
        aiTextContainer.classList = 'aiTextContainer';

        const aiResDesContainer = document.createElement('div');
        aiResDesContainer.id = 'aiResDesContainer';

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
                aiResDesContainer.textContent = dtext;
                descriptionCharacterCount++;
            }
            else {
                clearInterval(descriptionInterval);
            }
        }, 500)
    }
}

const form = document.getElementById("inputsForm");

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const category = document.getElementById("categoryDropdown").value;
    const mood = document.getElementById("moodDropdown").value;
    const genre = document.getElementById("genreDropdown").value;
    const additionalInfo = document.getElementById("addInfo").value;

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

    const data = await response.json();
    aiChatActions(data);
});