let currentNumber = 0;
let missedQueue = [];
let servedCount = 0;
let delayedMissedQueue = [];
let actionHistory = [];

document.getElementById("nowServing").parentElement.addEventListener("click", serveNext);

function serveNext() {
    servedCount++;
    actionHistory.push({ type: "serve", value: document.getElementById("nowServing").innerText });

    if (delayedMissedQueue.length > 0 && servedCount >= 2) {
        document.getElementById("nowServing").innerText = delayedMissedQueue.shift();
        servedCount = 0;
    } else {
        currentNumber = (currentNumber + 1) % 61;
        if (currentNumber === 0) currentNumber = 1;
        document.getElementById("nowServing").innerText = currentNumber;
    }

    updateHeading();
}
// Attach click event to the entire "Missed Queue" box
document.querySelector(".missed-queue").addEventListener("click", markAsMissed);

function markAsMissed(event) {
    // Prevent the action when clicking on a missed number
    if (event.target.tagName === "LI") {
        return;
    }

    currentNumber = (currentNumber + 1) % 61;
    if (currentNumber === 0) currentNumber = 1;
    missedQueue.push(currentNumber);
    actionHistory.push({ type: "missed", value: currentNumber });
    updateMissedQueue();
}

function updateMissedQueue() {
    let missedList = document.getElementById("missedQueue");
    let deleteSelection = document.getElementById("deleteMissedSelection");

    missedList.innerHTML = "";
    deleteSelection.innerHTML = "";

    missedQueue.forEach(num => {
        let li = document.createElement("li");
        li.innerText = num;
        li.onclick = function () { selectMissedNumber(num); };
        missedList.appendChild(li);

        let option = document.createElement("option");
        option.value = num;
        option.text = num;
        deleteSelection.appendChild(option);
    });
}

// **New Function: Delete the selected missed queue number**
function deleteSelectedMissedNumber() {
    let select = document.getElementById("deleteMissedSelection");
    let selectedNumber = parseInt(select.value);

    if (!selectedNumber) {
        alert("Please select a missed queue number to delete.");
        return;
    }

    actionHistory.push({ type: "removeMissed", value: selectedNumber });
    missedQueue = missedQueue.filter(n => n !== selectedNumber); // Remove only the selected number
    updateMissedQueue();
}

function selectMissedNumber(num) {
    delayedMissedQueue.push(num);
    servedCount = 0;
    actionHistory.push({ type: "return", value: num });
    missedQueue = missedQueue.filter(n => n !== num); // Remove only once
    updateMissedQueue();
}

function deleteMissedNumber() {
    if (missedQueue.length === 0) {
        alert("No missed numbers to delete.");
        return;
    }
    let numToDelete = missedQueue.pop();
    actionHistory.push({ type: "removeMissed", value: numToDelete });
    updateMissedQueue();
}

function resetNowServing() {
    actionHistory.push({ type: "reset", value: document.getElementById("nowServing").innerText });
    currentNumber = 0;
    document.getElementById("nowServing").innerText = "0";
    updateHeading();
}

// **Fixed Undo Functionality**
function undoAction() {
    let lastAction = actionHistory.pop();
    if (!lastAction) return;

    if (lastAction.type === "serve" || lastAction.type === "reset") {
        document.getElementById("nowServing").innerText = lastAction.value;
        currentNumber = parseInt(lastAction.value);
        updateHeading();
    } else if (lastAction.type === "missed") {
        missedQueue = missedQueue.filter(n => n !== lastAction.value);
        currentNumber = lastAction.value - 1; // Ensure the next serveNext() serves the undone number
        updateMissedQueue();
    } else if (lastAction.type === "return") {
        delayedMissedQueue = delayedMissedQueue.filter(n => n !== lastAction.value);
        missedQueue.push(lastAction.value);
        updateMissedQueue();
    } else if (lastAction.type === "removeMissed") {
        missedQueue.push(lastAction.value);
        updateMissedQueue();
    }
}

// Function to update the heading with the next 3 numbers
function updateHeading() {
    let next1 = (currentNumber + 1) > 60 ? 1 : (currentNumber + 1);
    let next2 = (currentNumber + 2) > 60 ? (currentNumber + 2 - 60) : (currentNumber + 2);
    let next3 = (currentNumber + 3) > 60 ? (currentNumber + 3 - 60) : (currentNumber + 3);

    // Updated 'Please Prepare XFZ' to '下一位请准备'
    document.getElementById("prepareXFZ").innerText = `下一位请准备: ${next1}, ${next2}, ${next3}`;
}

// Initial heading update
updateHeading();

// Select the sound file
const serveSound = document.getElementById("serveSound");

// Play sound when Now Serving is clicked
document.getElementById("nowServing").parentElement.addEventListener("click", serveNext);

function serveNext() {
    //playSound(); // Play sound only once per click
    servedCount++;
    
    actionHistory.push({ type: "serve", value: document.getElementById("nowServing").innerText });

    if (delayedMissedQueue.length > 0 && servedCount >= 2) {
        document.getElementById("nowServing").innerText = delayedMissedQueue.shift();
        servedCount = 0;
    } else {
        currentNumber = (currentNumber + 1) % 61; // Ensures it resets to 1 after 60
        if (currentNumber === 0) currentNumber = 1;
        document.getElementById("nowServing").innerText = currentNumber;
    }

    updateHeading();
}

// Function to manually play the sound via the sound icon
function playSound() {
    serveSound.currentTime = 0; // Reset the sound to start
    serveSound.play();
}



