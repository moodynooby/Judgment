const numPlayersInput = document.getElementById('numPlayers');
const startGameButton = document.getElementById('startGame');
const initialPage = document.getElementById('initialPage');
const gameArea = document.getElementById('gameArea');
const playerContainers = document.getElementById('playerContainers');
const playerTemplate = document.getElementById('playerTemplate');
const calculateButton = document.getElementById('calculateButton');
const unifiedScoreTable = document.getElementById('unifiedScoreTable');
const playerNamesHeader = document.getElementById('playerNamesHeader');
const endGameButton = document.getElementById('endGameButton');
const finalScoresDiv = document.getElementById('finalScores');
const playerSelectorModal = document.getElementById('playerSelectorModal');
const playerSelectorForm = document.getElementById('playerSelectorForm');
const confirmSelectionButton = document.getElementById('confirmSelection');
const roundNumberDisplay = document.getElementById('roundNumber');
const trumpCardImage = document.getElementById('trumpCardImage');

const trumpCards = [
    'icons8-spades-48.png',
    'icons8-diamonds-48.png',
    'icons8-clubs-48.png',
    'icons8-favorite-48.png', // This is typically 'hearts'
    'icons8-joker-48.png'
];
let currentTrumpCardIndex = 0;

let players = [];
let currentRound = 1;

startGameButton.addEventListener('click', () => {
    const numPlayers = parseInt(numPlayersInput.value);
    initializeGame(numPlayers);
});

calculateButton.addEventListener('click', () => {
    openPlayerSelectorModal();
});

confirmSelectionButton.addEventListener('click', () => {
    processRound();
});



function initializeGame(numPlayers) {
    initialPage.style.display = 'none';
    gameArea.style.display = 'block';

    players = [];
    currentRound = 1;
    currentTrumpCardIndex = 0;
    unifiedScoreTable.getElementsByTagName('tbody')[0].innerHTML = '';
    playerNamesHeader.innerHTML = '';
    roundNumberDisplay.innerText = `Round: ${currentRound}`;
    trumpCardImage.src = trumpCards[currentTrumpCardIndex];

    for (let i = 0; i < numPlayers; i++) {
        createPlayer(i);
    }

    updatePlayerNamesHeader();
}

function createPlayer(index) {
    const playerContainer = document.importNode(playerTemplate.content, true);
    playerContainers.appendChild(playerContainer);

    const playerNameInput = playerContainers.querySelectorAll('.playerName')[index];
    const addButton = playerContainers.querySelectorAll('.addButton')[index];
    const subtractButton = playerContainers.querySelectorAll('.subtractButton')[index];
    const handValueSpan = playerContainers.querySelectorAll('.handValue')[index];

    players.push({
        name: '',
        hand: 0,
        score: 0,
    });

    playerNameInput.addEventListener('input', () => {
        players[index].name = playerNameInput.value;
        updatePlayerNamesHeader();
    });

    addButton.addEventListener('click', () => {
        players[index].hand++;
        handValueSpan.innerText = players[index].hand;
    });

    subtractButton.addEventListener('click', () => {
        players[index].hand--;
        handValueSpan.innerText = players[index].hand;
    });
}

function updatePlayerNamesHeader() {
    const headerRow = document.querySelector('#unifiedScoreTable thead tr');
    // Remove all cells except the first 'Round' column
    while (headerRow.cells.length > 1) {
        headerRow.deleteCell(1);
    }
    // Add player name cells
    players.forEach((player) => {
        const playerNameCell = document.createElement('th');
        playerNameCell.innerText = player.name;
        headerRow.appendChild(playerNameCell);
    });
}

function openPlayerSelectorModal() {
    playerSelectorForm.innerHTML = '';

    players.forEach((player, index) => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'w3-padding-small';
        checkboxDiv.innerHTML = `
            <label class="w3-text-dark-grey">
                <input class="w3-check" type="checkbox" value="${index}" checked>
                ${player.name}
            </label>
        `;
        playerSelectorForm.appendChild(checkboxDiv);
    });

    playerSelectorModal.showModal();
}

function processRound() {
    const selectedPlayerIndices = Array.from(
        playerSelectorForm.querySelectorAll('input:checked')
    ).map((checkbox) => parseInt(checkbox.value));

    const tableBody = unifiedScoreTable.getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    const roundCell = newRow.insertCell();
    roundCell.innerText = currentRound;

    players.forEach((player, index) => {
        let roundScore = 0;

        if (selectedPlayerIndices.includes(index)) {
            roundScore = player.hand === 0 ? 10 : player.hand * 10;
            player.score += roundScore;
        }

        const scoreCell = newRow.insertCell();
        scoreCell.innerText = roundScore;
    });

    currentRound++;
    roundNumberDisplay.innerText = `Round: ${currentRound}`;
    currentTrumpCardIndex = (currentTrumpCardIndex + 1) % trumpCards.length;
    trumpCardImage.src = trumpCards[currentTrumpCardIndex];
    playerSelectorModal.close();
}

function displayFinalScores() {
    finalScoresDiv.innerHTML = '';
    finalScoresDiv.style.display = 'block';
    gameArea.style.display = 'none';

    

    const heading = document.createElement('h2');
    heading.textContent = 'Final Scores';
    finalScoresDiv.appendChild(heading);

    const scoreList = document.createElement('ul');
    players.forEach((player) => {
        const rank = players
            .map(p => p.score)
            .sort((a, b) => b - a)
            .indexOf(player.score) + 1;
        const listItem = document.createElement('li');
        // Sort players by score in descending order
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
        // Find player's index in sorted array to determine rank
        const playerRank = sortedPlayers.findIndex(p => p.name === player.name) + 1;
        listItem.textContent = `#${playerRank} ${player.name}: ${player.score}`;
        scoreList.appendChild(listItem);
    });

    finalScoresDiv.appendChild(scoreList);
}