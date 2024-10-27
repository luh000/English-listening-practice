let texts = [
    {
        title: "OpenAI's Whisper",
        content: `Software engineers, developers, and academic researchers have serious concerns about transcriptions from OpenAI's Whisper, according to a report in the Associated Press.

While there's been no shortage of discussion around generative AI's tendency to hallucinate — basically, to make stuff up — it's a bit surprising that this is an issue in transcription, where you'd expect the transcript closely follow the audio being transcribed.

Instead researchers told the AP that Whisper has introduced everything from racial commentary to imagined medical treatments into transcripts. And that could be particularly disastrous as Whisper is adopted in hospitals and other medical contexts.

A University of Michigan researcher studying public meetings found hallucinations in eight out of every 10 audio transcriptions. A machine learning engineer studied more than 100 hours of Whisper transcriptions and found hallucinations in more than half of them. And a developer reported finding hallucinations in nearly all the 26,000 transcriptions he created with Whisper.

An OpenAI spokesperson said the company is “continually working to improve the accuracy of our models, including reducing hallucinations” and noted that its usage policies prohibit using Whisper “in certain high-stakes decision-making contexts.”

“We thank researchers for sharing their findings,” they said.`
    },
    {
        title: "Week in Review",
        content: `This week, we' re looking at OpenAI's reported plans for its next AI model; a buzzy new messaging app that's a hit with Gen Z; and Tim Cook discovering that you can name a group chat in iMessage. Let's get into it.

The Verge noted this week that OpenAI is reportedly planning to release its next frontier AI model, code-named Orion, by December. An OpenAI spokesperson denied the claim to TechCrunch, saying, “We don't have plans to release a model code-named Orion this year.” But what that means is anybody's guess and leaves OpenAI substantial wiggle room.

Character.AI is being targeted in a lawsuit after the suicide of a 14-year-old boy whose mother says he became obsessed with a chatbot on the platform. The company said it is rolling out new safety features, including “improved detection, response, and intervention” related to chats that violate its terms of service and a notification when a user has spent an hour in a chat.

More than 100 million individuals had their private health information stolen during the February ransomware attack on Change Healthcare. It's the first time that UnitedHealth Group, the health insurance provider that owns the company, has put a number on the amount of individuals affected by the data breach; previously the company said it anticipated the breach included data on a “substantial proportion of people in America.”`
    },
    {
        title: "Masimo smartwatches",
        content: `Bloomberg Law reports that the company was only seeking the statutory minimum of $250, and that's all it was awarded. Apple's attorney John Desmarais reportedly told jurors, “We're not here for the money.” Instead, he said the company hoped to force Masimo to “stop copying our design.”

The company may have been disappointed on that front. The jury did find that the original design for Masimo's W1 Freedom and health module, as well as its original charger, infringed on Apple design patents, and that the infringement was willful.

However, in a statement, Masimo noted that the findings only applied to “a discontinued module and charger,” not its current products.

“Apple primarily sought an injunction against Masimo's current products, and the jury's verdict is a victory for Masimo on that issue,” the medical device company said.

The trial resulted from Apple's countersuit in its ongoing legal battle with Masimo, which started with the Masimo's claim that its patents had been infringed by the Apple Watch's pulse-oximetry feature, which allows Watch owners to measure their blood oxygen levels. Apple disabled the feature in the Apple Watch Series 9 and Ultra 2, and it's also missing from the new Series 10. These limitations only apply in the United States, with Apple is appealing an import ban on models with the contested feature.

Desmerais reportedly told the jury that the pulse-oximetry feature “has nothing to do with this case.”`
    }
];

let currentTextIndex = -1;
let currentSentenceIndex = 0;
let sentences = [];

document.getElementById('addTextButton').addEventListener('click', function() {
    const title = prompt("Enter the title of the text:");
    const content = prompt("Enter the text content:");
    if (title && content) {
        texts.push({ title, content });
        updateTextList();
    }
});

function updateTextList() {
    const textList = document.getElementById('textList');
    textList.innerHTML = '';
    texts.forEach((text, index) => {
        const li = document.createElement('li');
        li.textContent = text.title;
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click event from selecting the text
            deleteText(index);
        });

        li.addEventListener('click', () => selectText(index));
        li.appendChild(deleteButton);
        textList.appendChild(li);
    });
}

function deleteText(index) {
    texts.splice(index, 1);
    updateTextList();
    if (currentTextIndex === index) {
        document.getElementById('textTitle').textContent = 'Select a text';
        document.getElementById('sentenceCount').textContent = '';
        sentences = [];
        currentSentenceIndex = 0;
        clearUserInputAndResult();
    }
}

function selectText(index) {
    currentTextIndex = index;
    const text = texts[index];
    document.getElementById('textTitle').textContent = text.title;
    sentences = text.content.match(/[^\.!\?]+[\.!\?]+/g) || [];
    document.getElementById('sentenceCount').textContent = `This text has ${sentences.length} sentences. Currently playing sentence ${currentSentenceIndex + 1}.`;
    currentSentenceIndex = 0;
    clearUserInputAndResult();
}

document.getElementById('playButton').addEventListener('click', function() {
    playSentence();
    clearUserInputAndResult();
});

document.getElementById('prevButton').addEventListener('click', function() {
    if (currentSentenceIndex > 0) {
        currentSentenceIndex--;
        playSentence();
        clearUserInputAndResult();
    }
});

document.getElementById('nextButton').addEventListener('click', function() {
    if (currentSentenceIndex < sentences.length - 1) {
        currentSentenceIndex++;
        playSentence();
        clearUserInputAndResult();
    }
});

function playSentence() {
    if (currentSentenceIndex < sentences.length) {
        const utterance = new SpeechSynthesisUtterance(sentences[currentSentenceIndex]);
        speechSynthesis.speak(utterance);
    }
}

document.getElementById('checkButton').addEventListener('click', function() {
    const userText = document.getElementById('userInput').value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const originalSentence = sentences[currentSentenceIndex].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"") || '';
    const originalWords = originalSentence.split(/\s+/);
    const userWords = userText.split(/\s+/);
    let correctCount = 0;
    let resultHTML = '';

    originalWords.forEach((word) => {
        if (userWords.includes(word)) {
            correctCount++;
            resultHTML += `<span class="correct">${word}</span> `;
        } else {
            resultHTML += `<span class="incorrect">${word}</span> `;
        }
    });

    const accuracy = (correctCount / originalWords.length) * 100;
    document.getElementById('result').innerHTML = `Accuracy: ${accuracy.toFixed(2)}%<br>Original: ${resultHTML}`;
});

function clearUserInputAndResult() {
    document.getElementById('userInput').value = '';
    document.getElementById('result').innerHTML = '';
}

// Initialize the text list with default texts
updateTextList();
