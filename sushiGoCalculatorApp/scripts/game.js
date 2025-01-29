// Load players from localStorage
let players = [];
let selectedPlayerIndex = null;

window.addEventListener("DOMContentLoaded", () => {
    const storedPlayers = JSON.parse(localStorage.getItem("playersStorage")) || [];
    players = storedPlayers.map(playerData => Player.fromJSON(playerData));
    renderPlayers();
});

// Render players on the game page
function renderPlayers() {
    const playersContainer = document.querySelector(".players-container");
    playersContainer.innerHTML = players
        .map((player, index) => `
            <div 
                class="player ${index === selectedPlayerIndex ? 'selected' : ''}" 
                data-id="${index}" 
                onclick="selectPlayer(${index})">
                    <p class="name">${player.name}</p>
                    <p>Points: ${player.points}</p>
                    <p>Puddings: ${player.numOfPuddings}</p>
                    <p class="maki-roll-points">Maki rolls: ${player.numOfMakiRolls}</p>
            </div>
        `)
        .join("");
}

function selectPlayer(index){
    renderErrorMessage("", 0);
    selectedPlayerIndex = index === selectedPlayerIndex ? null : index; // Deselect if clicked again
    renderPlayers();
}

function updateLocalStorage() {
    localStorage.setItem("playersStorage", JSON.stringify(players));
}

function savePoints(){
    renderErrorMessage("", 0);
    if(selectedPlayerIndex != null){
        player = players[selectedPlayerIndex];

        try {
            const eggNigiri = document.getElementById('tojas_nigiri').value;
            player.points += Number(eggNigiri);
    
            const salmonNigiri = document.getElementById('lazac_nigiri').value;
            player.points += Number(salmonNigiri)*2;
    
            const squidNigiri = document.getElementById('polip_nigiri').value;
            player.points += Number(squidNigiri)*3;
    
            const tempura = document.getElementById('tempura').value;
            player.points += Math.floor(Number(tempura)/2)*5;
    
            const maki1 = document.getElementById('maki_1').value;
            player.numOfMakiRolls += Number(maki1);
    
            const maki2 = document.getElementById('maki_2').value;
            player.numOfMakiRolls += Number(maki2)*2;
    
            const maki3 = document.getElementById('maki_3').value;
            player.numOfMakiRolls += Number(maki3)*3;
    
            const sashimi = document.getElementById('sashimi').value;
            player.points += Math.floor(Number(sashimi)/3)*10;
    
            const dumpling = Number(document.getElementById('gozgomboc').value);
            if(dumpling === 1){
                player.points += 1;
            }else if(dumpling === 2){
                player.points += 3
            }else if(dumpling === 3){
                player.points += 6
            }else if(dumpling === 4){
                player.points += 10
            }else if(dumpling >= 5){
                player.points += 15
            }
    
            const pudding = document.getElementById('puding').value;
            player.numOfPuddings += Number(pudding);
    
            const eggNigiriWithWasabi = document.getElementById('wasabi-tojas-nigiri').value;
            player.points += Number(eggNigiriWithWasabi)*3;
    
            const salmonNigiriWithWasabi = document.getElementById('wasabi-lazac-nigiri').value;
            player.points += Number(salmonNigiriWithWasabi)*6;
    
            const squidNigiriWithWasabi = document.getElementById('wasabi-polip-nigiri').value;
            player.points += Number(squidNigiriWithWasabi)*9;
            
            let pointInputs = document.querySelectorAll('.point-input');
            pointInputs.forEach(inputElement => {
                inputElement.value = 0;
            });
            
            renderPlayers(); 
            updateLocalStorage();
        } catch (error) {
            renderErrorMessage("Pontszám nem lehet negatív!", 1);
        }
    }else{
        renderErrorMessage("Válassz egy játékost!", 1);
    }
}

function resetPoints(){
    renderErrorMessage("");
    if(selectedPlayerIndex != null){
        player = players[selectedPlayerIndex];
        const response = confirm(`Are you sure you want to reset ${player.name}'s points?`);
        if(response){
            player.points = 0;
            renderPlayers();
            updateLocalStorage();
        }
    }else{
        renderErrorMessage("Válassz egy játékost!", 1);
    }
}

function resetMakiRolls(){
    renderErrorMessage("");
    if(selectedPlayerIndex != null){
        player = players[selectedPlayerIndex];
        const response = confirm(`Are you sure you want to reset ${player.name}'s maki rolls?`);
        if(response){
            player.numOfMakiRolls = 0;
            renderPlayers();
            updateLocalStorage();
        }
    }else{
        renderErrorMessage("Válassz egy játékost!", 1);
    }
}

function resetPuddings(){
    renderErrorMessage("");
    if(selectedPlayerIndex != null){
        player = players[selectedPlayerIndex];
        const response = confirm(`Are you sure you want to reset ${player.name}'s puddings?`);
        if(response){
            player.numOfPuddings = 0;
            renderPlayers();
            updateLocalStorage();
        }
    }else{
        renderErrorMessage("Válassz egy játékost!", 1);
    }
}

function finishRound(){
    /***************** Calculate and divide points of maki rolls. ***********************/

    // Játékosok maki tekercseinek száma szerint csökkenő sorrend
    const sortedPlayers = [...players].sort((a, b) => b.numOfMakiRolls - a.numOfMakiRolls);

    // Az első helyezettek kiválasztása
    const maxRolls = sortedPlayers[0].numOfMakiRolls;
    const firstPlacePlayers = sortedPlayers.filter(player => player.numOfMakiRolls === maxRolls);
    const firstPlacePoints = Math.floor(6 / firstPlacePlayers.length);
    firstPlacePlayers.forEach(player => {
        if(player.numOfMakiRolls > 0){
            player.points += firstPlacePoints;
        }
    });

    // Az második helyezettek kiválasztása
    if(firstPlacePlayers.length === 1){         //Ha többen is ugyanannyival bizonyulnak elsőnek, akkor nincs második helyezett.
        const secondPlacePlayers = sortedPlayers.filter(player =>
            player.numOfMakiRolls < maxRolls && player.numOfMakiRolls === sortedPlayers[firstPlacePlayers.length]?.numOfMakiRolls
        );
        const secondPlacePoints = Math.floor(3 / secondPlacePlayers.length);
        secondPlacePlayers.forEach(player => {
            if(player.numOfMakiRolls > 0){
                player.points += secondPlacePoints;
            }
        });
    }

    players.forEach(player => {
        player.numOfMakiRolls = 0;
    });
    renderPlayers();
    updateLocalStorage();
}

function finishGame(){
    /***************** Calculate, divide and deduct points of puddings. ***********************/
    let equalPuddings = 0;
    for (let index = 1; index < players.length; index++) {
        if(players[0].numOfPuddings === players[index].numOfPuddings){
            equalPuddings++;
        }        
    }
    if (equalPuddings === players.length-1) {
        return;
    }
    // Játékosok pudingjaiak száma szerint csökkenő sorrend
    const sortedPlayers = [...players].sort((a, b) => b.numOfPuddings - a.numOfPuddings);

    //A legtöbb pudingot összegyűjtők kiválasztása
    const maxPuddings = sortedPlayers[0].numOfPuddings;
    const firstPlacePlayers = sortedPlayers.filter(player => player.numOfPuddings === maxPuddings);
    const firstPlacePoints = Math.floor(6 / firstPlacePlayers.length);
    firstPlacePlayers.forEach(player => player.points += firstPlacePoints);

    //A legkevesebb pudingot összegyűjtők kiválasztása
    if(players.length > 2){         //2 fős játékban a pudingért nem lehet pontot veszíteni.
        const minPuddings = sortedPlayers[sortedPlayers.length-1].numOfPuddings;
        const lastPlacePlayers = sortedPlayers.filter(player => player.numOfPuddings === minPuddings);
        const lastPlacePointDeduction = Math.floor(6/lastPlacePlayers.length);
        lastPlacePlayers.forEach(player => player.points -= lastPlacePointDeduction);
    }
    renderPlayers();
    updateLocalStorage();
}

function renderErrorMessage(message, opacity){
    const errorElement = document.querySelector('.error-msg');
    errorElement.textContent = message;
    document.querySelector('.err-msg-container').style.opacity = opacity;
}
