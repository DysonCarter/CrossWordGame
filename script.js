fillInBlack();

// Get all cells
const cells = document.querySelectorAll('.cell');

// true = horizontal, false = vertical
let toggle = true;

// Check the users answer
async function checkAnswers() {
    const response = await fetch('answer.txt');
    const fileAnswer = await response.text();
    let answers = '';
    cells.forEach(cell => {
        answers += cell.textContent;
    });
    console.log('Expected:', fileAnswer);
    console.log('Actual:', answers);

    if(fileAnswer === answers){
        handleWin();
    } else {
        handleLoss();
    }
}

async function fillInBlack(){
    const response = await fetch('answer.txt');
    const fileAnswer = await response.text();
    cells.forEach(cell => {
        const cellIndex = parseInt(cell.getAttribute('data-index'));
        if(fileAnswer[cellIndex] === '!'){
            cell.classList.toggle('filled');
            cell.innerHTML = '!';
        }
    });

    addEventListeners();
}

function handleWin(){

}

function handleLoss(){

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

function addEventListeners() {
    cells.forEach((cell, index) => {
        if (!cell.classList.contains('filled')) {
            cell.setAttribute('tabindex', '0');

            // On Click for each cell
            cell.addEventListener('click', function () {
                if (this.style.backgroundColor === 'yellow') {
                    toggle = !toggle;
                }
                updateColors(index);
            });

            // For Pressing Keys
            cell.addEventListener("keydown", function (event) {
                const key = event.key;

                if (key === " ") {
                    if (this.style.backgroundColor === 'yellow') {
                        toggle = !toggle;
                    }
                    updateColors(index);
                } else if (key.length === 1) {
                    this.innerHTML = key.toUpperCase();

                    updateColors(getNextIndex(index));
                    moveToNextCell(index);
                } else if (key === "Backspace") {
                    this.innerHTML = '';

                    updateColors(getPreviousIndex(index));
                    moveToPreviousCell(index);
                }
            });
        }
    })
}
