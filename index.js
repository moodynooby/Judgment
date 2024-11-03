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

endGameButton.addEventListener('click', () => {
    displayFinalScores();
});

function initializeGame(numPlayers) {
    initialPage.style.display = 'none';
    gameArea.style.display = 'block';

    players = [];
    currentRound = 1;
    unifiedScoreTable.getElementsByTagName('tbody')[0].innerHTML = '';
    playerNamesHeader.innerHTML = '';

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
    playerNamesHeader.innerHTML = '';
    players.forEach((player) => {
        const playerNameCell = document.createElement('th');
        playerNameCell.innerText = player.name;
        playerNamesHeader.appendChild(playerNameCell);
    });
}

function openPlayerSelectorModal() {
    playerSelectorModal.classList.add('is-active');
    playerSelectorForm.innerHTML = '';

    players.forEach((player, index) => {
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'checkbox';
        checkboxLabel.innerHTML = `
      <input type="checkbox" value="${index}" checked>
      ${player.name}
    `;
        playerSelectorForm.appendChild(checkboxLabel);
    });
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
    playerSelectorModal.classList.remove('is-active');
}

function displayFinalScores() {
    finalScoresDiv.innerHTML = '';
    finalScoresDiv.style.display = 'block';

    const heading = document.createElement('h2');
    heading.textContent = 'Final Scores';
    finalScoresDiv.appendChild(heading);

    const scoreList = document.createElement('ul');
    players.forEach((player) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${player.name}: ${player.score}`;
        scoreList.appendChild(listItem);
    });

    finalScoresDiv.appendChild(scoreList);
}