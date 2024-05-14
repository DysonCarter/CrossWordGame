// Get all cells
const cells = document.querySelectorAll('.cell');

var toggle = true;

cells.forEach(cell => {
    cell.setAttribute('tabindex', '0');

    // On Click for each cell
    cell.addEventListener('click', function() {
        // Get Consts
        const index = parseInt(this.getAttribute('data-index'));
        const rowStart = Math.floor((index) / 5) * 5;
        const rowEnd = rowStart + 4;

        // Handle toggling
        if(this.style.backgroundColor == 'yellow'){
            toggle = !toggle;
        }
        
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
        }
    });

    //For Pressing Keys
    cell.addEventListener("keydown", function(event){
        const key = event.key;
        if(key.length === 1)
            this.innerHTML = key.toUpperCase();
    })
});
