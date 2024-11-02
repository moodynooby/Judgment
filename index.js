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
let round = 1;

startGameButton.addEventListener('click', () => {
    const numPlayers = parseInt(numPlayersInput.value);
    initialPage.style.display = 'none';
    gameArea.style.display = 'block';

    players = []; // Reset players array
    playerNamesHeader.innerHTML = ''; // Clear previous player names

    for (let i = 0; i < numPlayers; i++) {
        const playerContainer = document.importNode(playerTemplate.content, true);
        playerContainers.appendChild(playerContainer);

        const playerNameInput = playerContainers.querySelectorAll('.playerName')[i];
        const addButton = playerContainers.querySelectorAll('.addButton')[i];
        const subtractButton = playerContainers.querySelectorAll('.subtractButton')[i];
        const handValueSpan = playerContainers.querySelectorAll('.handValue')[i];

        players.push({
            name: playerNameInput.value,
            hand: 0,
            score: 0
        });

        playerNameInput.addEventListener('input', () => {
            players[i].name = playerNameInput.value;
            updatePlayerNamesHeader();
        });

        addButton.addEventListener('click', () => {
            players[i].hand++;
            handValueSpan.innerText = players[i].hand;
        });

        subtractButton.addEventListener('click', () => {
            players[i].hand--;
            handValueSpan.innerText = players[i].hand;
        });
    }

    updatePlayerNamesHeader();
});

calculateButton.addEventListener('click', () => {
    // Open the modal
    playerSelectorModal.classList.add('is-active');

    // Populate the modal with checkboxes for each player
    playerSelectorForm.innerHTML = ''; // Clear previous checkboxes
    players.forEach((player, index) => {
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'checkbox';
        checkboxLabel.innerHTML = `
        <input type="checkbox" value="${index}" checked>
        ${player.name}
      `;
        playerSelectorForm.appendChild(checkboxLabel);
    });
});

confirmSelectionButton.addEventListener('click', () => {
    const selectedPlayerIndices = Array.from(playerSelectorForm.querySelectorAll('input:checked'))
        .map(checkbox => parseInt(checkbox.value));

    const tableBody = unifiedScoreTable.getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    const roundCell = newRow.insertCell();
    roundCell.innerText = round;

    players.forEach((player, index) => {
        if (selectedPlayerIndices.includes(index)) {
            player.score = player.hand === 0 ? 10 : player.hand * 10;
        } else {
            player.score = 0; // Set score to 0 for unselected players
        }

        const scoreCell = newRow.insertCell();
        scoreCell.innerText = player.score;
    });

    round++;

    // Update round numbers in the first cell of each row
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
        const firstCell = row.querySelector('td:first-child');
        firstCell.innerText = rowIndex + 1;
    });

    // Close the modal
    playerSelectorModal.classList.remove('is-active');

    // Highlight the current round row
    highlightCurrentRoundRow();
});

function updatePlayerNamesHeader() {
    playerNamesHeader.innerHTML = ''; // Clear previous names
    players.forEach(player => {
        const playerNameCell = document.createElement('th');
        playerNameCell.innerText = player.name;
        playerNamesHeader.appendChild(playerNameCell);
    });
}

endGameButton.addEventListener('click', () => {
    const totalScores = players.map(player => {
        return {
            name: player.name,
            totalScore: player.score
        };
    });

    // Display the total scores
    displayFinalScores(totalScores);
});

function displayFinalScores(scores) {
    finalScoresDiv.innerHTML = ''; // Clear previous content
    finalScoresDiv.style.display = 'block';

    const heading = document.createElement('h2');
    heading.textContent = 'Final Scores';
    finalScoresDiv.appendChild(heading);

    const scoreList = document.createElement('ul');
    scores.forEach(playerScore => {
        const listItem = document.createElement('li');
        listItem.textContent = `${playerScore.name}: ${playerScore.totalScore}`;
        scoreList.appendChild(listItem);
    });

    finalScoresDiv.appendChild(scoreList);
}

function highlightCurrentRoundRow() {
    const tableBody = unifiedScoreTable.getElementsByTagName('tbody')[0];
    const rows = tableBody.querySelectorAll('tr');

    // Remove highlighting from previous rows
    rows.forEach(row => row.classList.remove('is-selected'));

    // Highlight the current round row
    if (rows.length >= round - 1) {
        rows[round - 2].classList.add('is-selected');
    }
}