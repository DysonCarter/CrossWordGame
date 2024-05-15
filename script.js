// Get all cells
const cells = document.querySelectorAll('.cell');

let toggle = true;

// Function to update colors based on toggle state
function updateColors(index) {
    const rowStart = Math.floor(index / 5) * 5;
    const rowEnd = rowStart + 4;

    cells.forEach(cell => {
        const cellIndex = parseInt(cell.getAttribute('data-index'));
        if (toggle) {
            // Row highlighting
            if (cellIndex >= rowStart && cellIndex <= rowEnd) {
                cell.style.backgroundColor = 'grey';
            } else {
                cell.style.backgroundColor = 'white';
            }
        } else {
            // Column highlighting
            if (cellIndex % 5 === index % 5) {
                cell.style.backgroundColor = 'grey';
            } else {
                cell.style.backgroundColor = 'white';
            }
        }
    });

    cells[index].style.backgroundColor = 'yellow';
}

// Function to get the next cell index
function getNextIndex(index) {
    if (toggle) {
        // Move horizontally
        return index + 1;
    } else {
        // Move vertically
        return index + 5;
    }
}

// Function to move focus to the next cell
function moveToNextCell(currentIndex) {
    const nextIndex = getNextIndex(currentIndex);

    // Check if the next cell is within bounds
    if (nextIndex < cells.length) {
        cells[nextIndex].focus();
    }
}

cells.forEach((cell, index) => {
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

        if (key.length === 1) {
            this.innerHTML = key.toUpperCase();

            updateColors(index);
            moveToNextCell(index);
        }
    });
});