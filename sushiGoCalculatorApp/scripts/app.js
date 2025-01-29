let players = [];
let selectedPlayerIndex = null;

const nameInputElement = document.querySelector(".name-input");
const nameContainerElement = document.querySelector(".name-container");

// Load players from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
    const storedPlayers = JSON.parse(localStorage.getItem("playersStorage")) || [];
    players = storedPlayers.map(playerData => Player.fromJSON(playerData));
    renderPlayers();
});

function addPlayer() {
    const name = nameInputElement.value.trim();
    if (name) {
        let playersWithTheSameName = players.filter(player => player.name === name);
        if(playersWithTheSameName.length === 0){
            const player = new Player(name, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            players.push(player);
            updateLocalStorage();
            renderPlayers();
            nameInputElement.value = '';
            renderErrorMessage('', 0);
        } else{
            nameInputElement.value = '';
            renderErrorMessage("Nem szerepelhet két játékos ugyanazzal a névvel.", 1);
        }
    } else{
        renderErrorMessage('Type a name into the input box!', 1);
    }
}

function renderPlayers() {
    nameContainerElement.innerHTML = players
        .map((player, index) => `
            <div 
                class="name-of-player ${index === selectedPlayerIndex ? 'selected' : ''}" 
                data-id="${index}" 
                onclick="selectPlayer(${index})"
            >
                ${player.name}
            </div>
        `)
        .join('');
}

function selectPlayer(index) {
    selectedPlayerIndex = index === selectedPlayerIndex ? null : index; // Deselect if clicked again
    renderPlayers();
}

function deleteSelected() {
    if (selectedPlayerIndex !== null) {
        players.splice(selectedPlayerIndex, 1);
        selectedPlayerIndex = null;
        updateLocalStorage();
        renderPlayers();
        renderErrorMessage('', 0);
    }else{
        const errorMessage = 'Select a name to delete it!';
        renderErrorMessage(errorMessage, 1);
    }
}

function updateLocalStorage() {
    localStorage.setItem("playersStorage", JSON.stringify(players));
}

if(nameInputElement !== null){
    nameInputElement.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addPlayer();
        }
    });
}

function redirectToGamePage(){
    if(players.length > 1){
        window.location.href = "game.html";
    }else{
        renderErrorMessage('Legalább két játékos szükséges a kezdéshez!', 1);
    }
}

function renderErrorMessage(message, opacity){
    const errorElement = document.querySelector('.error-msg');
    errorElement.textContent = message;
    document.querySelector('.error-msg-container').style.opacity = opacity;
}
