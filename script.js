// Get all cells
const cells = document.querySelectorAll('.cell');

// On Click for each cell
cells.forEach(cell => {
    var toggle = true;
  cell.addEventListener('click', function() {
    // Get the index of the clicked cell
    const index = parseInt(this.getAttribute('data-index'));
    const rowStart = Math.floor((index - 1) / 5) * 5 + 1;
    const rowEnd = rowStart + 4;

    // Handle color change
    if (toggle == true) {
      cells.forEach(c => {
        const cIndex = parseInt(c.getAttribute('data-index'));
        if (cIndex >= rowStart && cIndex <= rowEnd) {
          c.style.backgroundColor = 'grey';
        } else {
          c.style.backgroundColor = 'white';
        }
      });
      this.style.backgroundColor = 'yellow';
      toggle = false;
    } else {
      cells.forEach(c => {
        const cIndex = parseInt(c.getAttribute('data-index'));
        if (cIndex % 5 === index % 5) {
          c.style.backgroundColor = 'grey';
        } else {
          c.style.backgroundColor = 'white';
        }
      });
      this.style.backgroundColor = 'yellow';
      toggle = true;
    }
  });
});
