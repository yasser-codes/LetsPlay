// Select all required elements
const selectBox = document.querySelector(".select-box"),
    selectBtnX = selectBox.querySelector(".options .playerX"),
    selectBtnO = selectBox.querySelector(".options .playerO"),
    playBoard = document.querySelector(".play-board"),
    players = document.querySelector(".players"),
    allBox = document.querySelectorAll("section span"),
    resultBox = document.querySelector(".result-box"),
    wonText = resultBox.querySelector(".won-text"),
    replayBtn = resultBox.querySelector("button");

// Variables for game state
let playerXIcon = "fas fa-times"; // FontAwesome icon class for 'X'
let playerOIcon = "far fa-circle"; // FontAwesome icon class for 'O'
let playerSign = "X";
let runBot = true;

// Initialize the game
window.onload = () => {
    // Add click event to all boxes
    allBox.forEach(box => {
        box.addEventListener("click", () => clickedBox(box));
    });
};

// Player X selection
selectBtnX.onclick = () => {
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
};

// Player O selection
selectBtnO.onclick = () => {
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    players.classList.add("active", "player");
};

// Handle user click
function clickedBox(element) {
    if (players.classList.contains("player")) {
        playerSign = "O"; // Set sign to 'O' if player selected 'O'
        element.innerHTML = `<i class="${playerOIcon}"></i>`; // Add 'O' icon
        players.classList.remove("active"); // Switch active player
    } else {
        element.innerHTML = `<i class="${playerXIcon}"></i>`; // Add 'X' icon
        players.classList.add("active");
    }
    element.setAttribute("id", playerSign); // Set ID to player sign
    element.style.pointerEvents = "none"; 
    playBoard.style.pointerEvents = "none";
    selectWinner(); // Check for a winner

    // Random delay for bot's move
    const randomTimeDelay = Math.floor(Math.random() * 1000) + 200;
    setTimeout(() => {
        bot();
    }, randomTimeDelay);
}

// Bot's move
function bot() {
    if (runBot) {
        const availableBoxes = [...allBox].filter(box => !box.childElementCount); // Get available boxes
        const randomBox = availableBoxes[Math.floor(Math.random() * availableBoxes.length)]; // Pick a random box

        if (randomBox) {
            if (players.classList.contains("player")) {
                playerSign = "X"; // Bot plays 'X' if player chose 'O'
                randomBox.innerHTML = `<i class="${playerXIcon}"></i>`;
                players.classList.add("active");
            } else {
                playerSign = "O"; // Bot plays 'O' if player chose 'X'
                randomBox.innerHTML = `<i class="${playerOIcon}"></i>`;
                players.classList.remove("active");
            }
            randomBox.setAttribute("id", playerSign);
            randomBox.style.pointerEvents = "none";
            selectWinner(); // Check for a winner
            playBoard.style.pointerEvents = "auto";
            playerSign = "X"; // Reset to player's sign
        }
    }
}

// Get the ID of a box
function getIdVal(classname) {
    return document.querySelector(".box" + classname).id;
}

// Check if a winning combination is met
function checkIdSign(val1, val2, val3, sign) {
    return getIdVal(val1) === sign && getIdVal(val2) === sign && getIdVal(val3) === sign;
}

// Determine the winner
function selectWinner() {
    const winningCombinations = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ];

    const isWinner = winningCombinations.some(combination => checkIdSign(...combination, playerSign));

    if (isWinner) {
        runBot = false; // Stop the bot
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
            wonText.innerHTML = `Player <p>${playerSign}</p> won the game!`;
        }, 700);
    } else if ([...allBox].every(box => box.id)) { // Check for a draw
        runBot = false;
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
            wonText.textContent = "Match has been drawn!";
        }, 700);
    }
}

// Replay button click event
replayBtn.onclick = () => {
    window.location.reload(); // Reload the page
};
