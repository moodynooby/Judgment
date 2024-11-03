// Get references to HTML elements that will be used in the game
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

// Initialize game variables
let players = []; // Array to store player objects
let currentRound = 1; // Variable to keep track of the current round

// Function to update the player names in the score table header
function updatePlayerNamesHeader() {
    playerNamesHeader.innerHTML = ''; // Clear previous names

    // Iterate through the players array and create a table header cell for each player's name
    players.forEach(player => {
        const playerNameCell = document.createElement('th');
        playerNameCell.innerText = player.name;
        playerNamesHeader.appendChild(playerNameCell);
    });
}

// Function to highlight the current round row in the score table
function highlightCurrentRoundRow() {
    const tableBody = unifiedScoreTable.getElementsByTagName('tbody')[0];
    const rows = tableBody.querySelectorAll('tr');

    // Remove highlighting from previous rows
    rows.forEach(row => row.classList.remove('is-selected'));

    // Highlight the current round row
    if (rows.length >= currentRound - 1) {
        rows[currentRound - 2].classList.add('is-selected');
    }
}

// Function to display the final scores at the end of the game
function displayFinalScores(scores) {
    finalScoresDiv.innerHTML = ''; // Clear previous content
    finalScoresDiv.style.display = 'block';

    // Create a heading for the final scores
    const heading = document.createElement('h2');
    heading.textContent = 'Final Scores';
    finalScoresDiv.appendChild(heading);

    // Create an unordered list to display the scores
    const scoreList = document.createElement('ul');

    // Iterate through the scores array and create a list item for each player's score
    scores.forEach(playerScore => {
        const listItem = document.createElement('li');
        listItem.textContent = `${playerScore.name}: ${playerScore.totalScore}`;
        scoreList.appendChild(listItem);
    });

    // Append the score list to the final scores div
    finalScoresDiv.appendChild(scoreList);
}

// Event listener for the "Start Game" button
startGameButton.addEventListener('click', () => {
    const numPlayers = parseInt(numPlayersInput.value); // Get the number of players from the input field

    // Hide the initial page and show the game area
    initialPage.style.display = 'none';
    gameArea.style.display = 'block';

    players = []; // Reset players array
    playerNamesHeader.innerHTML = ''; // Clear previous player names

    // Create player containers dynamically based on the number of players
    for (let i = 0; i < numPlayers; i++) {
        // Create a new player container using the player template
        const playerContainer = document.importNode(playerTemplate.content, true);
        playerContainers.appendChild(playerContainer);

        // Get references to elements within the player container
        const playerNameInput = playerContainers.querySelectorAll('.playerName')[i];
        const addButton = playerContainers.querySelectorAll('.addButton')[i];
        const subtractButton = playerContainers.querySelectorAll('.subtractButton')[i];
        const handValueSpan = playerContainers.querySelectorAll('.handValue')[i];

        // Initialize player object and add it to the players array
        players.push({
            name: playerNameInput.value,
            hand: 0,
            score: 0
        });

        // Event listener for player name input
        playerNameInput.addEventListener('input', () => {
            players[i].name = playerNameInput.value; // Update the player's name in the players array
            updatePlayerNamesHeader(); // Update the player names in the score table header
        });

        // Event listener for the "Add" button
        addButton.addEventListener('click', () => {
            players[i].hand++; // Increment the player's hand value
            handValueSpan.innerText = players[i].hand; // Update the hand value display
        });

        // Event listener for the "Subtract" button
        subtractButton.addEventListener('click', () => {
            players[i].hand--; // Decrement the player's hand value
            handValueSpan.innerText = players[i].hand; // Update the hand value display
        });
    }

    // Update the player names in the score table header
    updatePlayerNamesHeader();
});

// Event listener for the "Calculate" button (Next Round)
calculateButton.addEventListener('click', () => {
    // Open the player selector modal
    playerSelectorModal.classList.add('is-active');

    // Populate the modal with checkboxes for each player
    playerSelectorForm.innerHTML = ''; // Clear previous checkboxes

    // Iterate through the players array and create a checkbox for each player
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

// Event listener for the "Confirm Selection" button in the modal
confirmSelectionButton.addEventListener('click', () => {
    // Get the indices of the selected players from the checkboxes
    const selectedPlayerIndices = Array.from(playerSelectorForm.querySelectorAll('input:checked'))
        .map(checkbox => parseInt(checkbox.value));

    // Get the table body and create a new row for the round
    const tableBody = unifiedScoreTable.getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();

    // Add the round number to the first cell of the row
    const roundCell = newRow.insertCell();
    roundCell.innerText = currentRound;

    // Calculate and update scores for the round
    players.forEach((player, index) => {
        // Check if the player is selected
        if (selectedPlayerIndices.includes(index)) {
            // If the player's hand is 0, they get 10 points, otherwise they get their hand value * 10
            player.score += player.hand === 0 ? 10 : player.hand * 10;
        } else {
            player.score += 0; // Set score to 0 for unselected players
        }

        // Add the player's score to the row
        const scoreCell = newRow.insertCell();
        scoreCell.innerText = player.score;
    });

    currentRound++; // Increment the current round

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

// Event listener for the "End Game" button
endGameButton.addEventListener('click', () => {
    // Create an array of objects containing each player's name and total score
    const totalScores = players.map(player => {
        return {
            name: player.name,
            totalScore: player.score
        };
    });

    // Display the final scores
    displayFinalScores(totalScores);
});