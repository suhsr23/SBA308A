// Constants
const API_KEY = 'live_bbAVlQpMo06H3Jr16wNiy96LZDOps0Fdka4hYV33ahYnoD57xqZPStvRy8qbPJrH';
const API_URL = 'https://api.thedogapi.com/v1';

// Global variables
let favorites = [];

// Fetch functions
async function fetchBreeds() {
    try {
        const response = await fetch(`${API_URL}/breeds`, {
            headers: {
                'x-api-key': API_KEY,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function fetchBreedDetails(breedId) {
    try {
        const response = await fetch(`${API_URL}/images/search?breed_id=${breedId}&limit=1`, {
            headers: {
                'x-api-key': API_KEY,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// UI functions
function displayBreeds(query) {
    searchBreeds(query)
        .then(breeds => {
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '';

            breeds.forEach(async breed => {
                const breedDetails = await fetchBreedDetails(breed.id);
                const breedCard = createBreedCard(breed, breedDetails[0].url);
                gallery.appendChild(breedCard);
            });
        })
        .catch(error => console.error('Search error:', error));
}

function addToFavorites(breed) {
    if (!favorites.includes(breed.name)) {
        favorites.push(breed.name);
        updateFavoritesList();
    }
}

function updateFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';

    favorites.forEach(breed => {
        const listItem = document.createElement('li');
        listItem.textContent = breed;
        favoritesList.appendChild(listItem);
    });
}

// Helper function to create breed card
function createBreedCard(breed, imageUrl) {
    const breedCard = document.createElement('div');
    breedCard.className = 'breed-card';
    breedCard.innerHTML = `
        <h3>${breed.name}</h3>
        <img src="${imageUrl}" alt="${breed.name}" width="100">
        <button data-breed="${breed.name}">Add to Favorites</button>
    `;
    breedCard.querySelector('button').addEventListener('click', () => addToFavorites(breed));
    return breedCard;
}

// Search function
async function searchBreeds(query) {
    const breeds = await fetchBreeds();
    if (!breeds) return [];
    return breeds.filter(breed => breed.name.toLowerCase().includes(query.toLowerCase()));
}

// Event listeners
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    displayBreeds(query);
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize any setup here if needed
});
