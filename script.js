let vocabulary = [];
let currentCard = 0;
let showingFront = true;

// List of Markdown files
let dayFiles = ["Day127.md", "Day128.md", "Day129.md","Day130","Day131","Day132","Day133","Day134","Day135"]; 

// Function to load all vocabulary files
async function loadAllVocabulary() {
    vocabulary = []; // Reset the vocabulary list

    for (let file of dayFiles) {
        await loadVocabularyFile(`vocab/${file}`);
    }

    if (vocabulary.length > 0) {
        showCard();
    } else {
        document.getElementById("flashcard").innerText = "No words found!";
    }
}

// Load a single Markdown file
async function loadVocabularyFile(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            console.warn(`File not found: ${path}`);
            return;
        }

        const text = await response.text();
        parseMarkdown(text);
    } catch (error) {
        console.error(`Error loading file ${path}:`, error);
    }
}

// Parse Markdown content into vocabulary array
function parseMarkdown(text) {
    const lines = text.split("\n");

    lines.forEach(line => {
        const match = line.match(/^\* (.+?) - (.+)$/); // Match "* DutchWord - EnglishTranslation"
        if (match) {
            vocabulary.push({
                dutch: match[1].trim(),
                english: match[2].trim()
            });
        }
    });
}

// Display the current card
function showCard() {
    const card = document.getElementById("flashcard");
    card.classList.remove("flipped");
    showingFront = true;

    if (vocabulary.length > 0) {
        card.innerText = vocabulary[currentCard].dutch;
    } else {
        card.innerText = "No words available!";
    }
}

// Flip the card to show translation
function flipCard() {
    const card = document.getElementById("flashcard");

    if (showingFront) {
        card.innerText = vocabulary[currentCard].english;
        showingFront = false;
    } else {
        card.innerText = vocabulary[currentCard].dutch;
        showingFront = true;
    }

    card.classList.toggle("flipped");
}

// Move to the next card
function nextCard() {
    if (vocabulary.length === 0) return;

    currentCard = (currentCard + 1) % vocabulary.length;
    showCard();
}

// Add event listeners
document.getElementById("flashcard").addEventListener("click", flipCard);
document.getElementById("next-button").addEventListener("click", nextCard);

// Start loading files
loadAllVocabulary();
