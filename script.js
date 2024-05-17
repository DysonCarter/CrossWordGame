fillInBlack();
makeClues();

// Get all cells
const cells = document.querySelectorAll('.cell');
var clues;

// true = horizontal, false = vertical
let toggle = true;
let clueCount = 0;
let round = 0;

// Check the users answer
async function checkAnswers() {
    const response = await fetch('answer.txt');
    const fileAnswer = await response.text();
    let answers = '';
    cells.forEach(cell => {
        cell.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                answers += child.textContent.trim();
            }
        });
    });
    console.log('Expected:', fileAnswer);
    console.log('Actual:', answers);

    if (fileAnswer === answers) {
        handleWin();
    } else {
        handleLoss();
    }
}

// Gets the clues and puts them on the html
async function makeClues() {
    try {
        const response = await fetch('clues.txt');
        const clues = await response.text();

        const clueContainer = document.querySelector(".clues");
        if (!clueContainer) {
            console.error("Clue container not found!");
            return;
        }

        const lines = clues.split('\n');
        let across = true;

        clueContainer.innerHTML += "<h2>Across:</h2>";

        lines.forEach(line => {
            if (line.trim() === '' && across) {
                clueContainer.innerHTML += "<h2>Down:</h2>";
                across = false;
            } else if (line.trim() !== '') {
                clueContainer.innerHTML += `<div class='clue' data-index="${clueCount}">${line}</div>`;
                clueCount += 1;
            }
        });
    } catch (error) {
        console.error('Error fetching or processing clues:', error);
    }
    clues = document.querySelectorAll('.clue');
    clues.forEach(clue => {
        const clueIndex = parseInt(clue.getAttribute('data-index'));
        if((clueIndex % 5) === round){
            clue.style.transition = "opacity 0.5s ease-in";
            clue.style.opacity = 1; 
        }
    })
    if(round < 5)
        round++;
}

// '!' indicates a filled in space
async function fillInBlack(){
    let wordcount = 1;
    const response = await fetch('answer.txt');
    const fileAnswer = await response.text();

    cells.forEach(cell => {
        const cellIndex = parseInt(cell.getAttribute('data-index'));
        const cellNumberDiv = cell.querySelector('.cellNumber');

        //fill in
        if(fileAnswer[cellIndex] === '!'){
            cell.classList.toggle('filled');
            cell.innerHTML = '!';
        } else {
            //Put Square Numbers
            if(cellIndex <= 4 || (cellIndex % 5) === 0 || fileAnswer[cellIndex-1] === '!'|| fileAnswer[cellIndex-5] === '!'){
                if (cellNumberDiv) {
                    cellNumberDiv.innerHTML = wordcount;
                }
                wordcount += 1;
            }
        }
    });

    addEventListeners();
}

function handleWin(){
    if(round === 1)
        alert(`Congrats you got it in ${round} try!`);
    else
        alert(`Congrats you got it in ${round} tries!`);

    clues.forEach(clue => {
        clue.style.transition = "opacity 0.5s ease-in";
        clue.style.opacity = 1; 
    })
    document.body.style.backgroundColor = "rgb(25,175,70)";
    setTimeout(() => {
        document.body.style.backgroundColor = "rgb(73, 95, 101)";
    }, 750);
}

function handleLoss(){
    document.body.style.backgroundColor = "rgb(180,25,25)";
    setTimeout(() => {
        document.body.style.backgroundColor = "rgb(73, 95, 101)";
    }, 750);
    clues.forEach(clue => {
        const clueIndex = parseInt(clue.getAttribute('data-index'));
        if((clueIndex % 5) === round){
            clue.style.transition = "opacity 0.5s ease-in";
            clue.style.opacity = 1; 
        }
    })
    round++;
}

// Function to update colors based on toggle state
function updateColors(index) {
    const rowStart = Math.floor(index / 5) * 5;
    const rowEnd = rowStart + 4;

    cells.forEach(cell => {
        if(!cell.classList.contains('filled')){
            const cellIndex = parseInt(cell.getAttribute('data-index'));
            if (toggle) {
                // Row highlighting
                if (cellIndex >= rowStart && cellIndex <= rowEnd) {
                    cell.style.backgroundColor = 'rgb(187, 220, 202)';
                } else {
                    cell.style.backgroundColor = 'white';
                }
            } else {
                // Column highlighting
                if (cellIndex % 5 === index % 5) {
                    cell.style.backgroundColor = 'rgb(187, 220, 202)';
                } else {
                    cell.style.backgroundColor = 'white';
                }
            }
        }
    });

    cells[index].style.backgroundColor = 'yellow';
}

// Function to get the next cell index
function getNextIndex(index) {
    let nextIndex = 0;
    if (toggle) {
        // Move horizontally
        if(index === 24)
            nextIndex = 0;
        else
            nextIndex = index + 1;
        while(cells[nextIndex].classList.contains('filled')){
            nextIndex = (nextIndex + 1) % 25;
        }
    } else {
        // Move vertically
        if(index === 24)
            nextIndex = 0;
        else if(index <= 19)
            nextIndex = index + 5;
        else
            nextIndex = index-19;
        while(cells[nextIndex].classList.contains('filled')){
            if (nextIndex <= 19) {
                nextIndex = (nextIndex + 5) % 25;
            } else if (nextIndex == 24) {
                nextIndex = 0;
            } else {
                nextIndex = nextIndex - 19;
            }
        }
    }
    return nextIndex;
}

// Function to get the previous cell index
function getPreviousIndex(index) {
    let previousIndex = 0;
    if (toggle) {
        // Move horizontally
        if(index === 0)
            previousIndex = 24;
        else
            previousIndex = index - 1;
        while(cells[previousIndex].classList.contains('filled')){
            previousIndex = (previousIndex - 1 + 25) % 25;
        }
    } else {
        // Move vertically
        if(index === 0)
            previousIndex = 24;
        else if(index >= 5)
            previousIndex = index - 5;
        else
            previousIndex = index + 19;
        while(cells[previousIndex].classList.contains('filled')){
            if (previousIndex >= 5) {
                previousIndex = (previousIndex - 5 + 25) % 25;
            } else {
                previousIndex = previousIndex + 19;
            }
        }
    }
    return previousIndex;
}

// Function to move focus to the next cell
function moveToNextCell(currentIndex) {
    const nextIndex = getNextIndex(currentIndex);

    // Check if the next cell is within bounds
    if (nextIndex < cells.length) {
        cells[nextIndex].focus();
    }
}

// Function to move focus to the previous cell
function moveToPreviousCell(currentIndex) {
    const prevIndex = getPreviousIndex(currentIndex);

    // Check if the next cell is within bounds
    if (prevIndex < cells.length) {
        cells[prevIndex].focus();
    }
}

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function addEventListeners() {
    cells.forEach((cell, index) => {
        if (!cell.classList.contains('filled')) {
            cell.setAttribute('tabindex', '0');
            
            // Set contenteditable for mobile devices
            if (isMobileDevice()) {
                cell.setAttribute('contenteditable', 'true');
            }

            // On Click for each cell
            cell.addEventListener('click', function () {
                if (this.style.backgroundColor === 'yellow') {
                    toggle = !toggle;
                }
                updateColors(index);
                this.focus(); // Focus the cell itself for both desktop and mobile
                if (isMobileDevice()) {
                    this.setAttribute('contenteditable', 'true'); // Ensure contenteditable is true on click for mobile
                }
            });

            // For Pressing Keys
            cell.addEventListener("keydown", function (event) {
                const key = event.key;
                const cellNumberDiv = this.querySelector('.cellNumber');

                if (key === " ") {
                    event.preventDefault(); // Prevent adding a space
                    if (this.style.backgroundColor === 'yellow') {
                        toggle = !toggle;
                    }
                    updateColors(index);
                } else if (key.length === 1) {
                    event.preventDefault(); // Prevent adding the key to the cell
                    // Create a text node for the character input
                    const textNode = document.createTextNode(key.toUpperCase());

                    // Clear existing text nodes (not cell number)
                    this.childNodes.forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE) {
                            this.removeChild(child);
                        }
                    });

                    // Append the new text node
                    this.appendChild(textNode);

                    // Ensure the cell number div stays at the top
                    if (cellNumberDiv) {
                        this.appendChild(cellNumberDiv);
                    }

                    updateColors(getNextIndex(index));
                    moveToNextCell(index);
                } else if (key === "Backspace") {
                    event.preventDefault(); // Prevent default backspace behavior
                    // Clear existing text nodes (not cell number)
                    this.childNodes.forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE) {
                            this.removeChild(child);
                        }
                    });

                    updateColors(getPreviousIndex(index));
                    moveToPreviousCell(index);
                } else if (key === "ArrowLeft") {
                    toggle = true;
                    updateColors(getPreviousIndex(index));
                    moveToPreviousCell(index);
                } else if (key === "ArrowRight") {
                    toggle = true;
                    updateColors(getNextIndex(index));
                    moveToNextCell(index);
                } else if (key === "ArrowUp") {
                    toggle = false;
                    updateColors(getPreviousIndex(index));
                    moveToPreviousCell(index);
                } else if (key === "ArrowDown") {
                    toggle = false;
                    updateColors(getNextIndex(index));
                    moveToNextCell(index);
                }
                
                // Remove contenteditable to hide the caret
                this.setAttribute('contenteditable', 'false');
            });

            // Remove blinking caret on focus
            cell.addEventListener('focus', function () {
                // Temporarily set contenteditable to false to remove caret
                this.setAttribute('contenteditable', 'false');
                // Restore contenteditable after a slight delay to avoid caret blinking
                setTimeout(() => {
                    if (isMobileDevice()) {
                        this.setAttribute('contenteditable', 'true');
                    }
                }, 0);
            });
        }
    });
}
