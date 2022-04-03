const searchSelector = document.querySelector('.search') 

function changeSearchBackgroundColour() {
    searchSelector.style.background = "white";
}

searchSelector.addEventListener("mouseover", changeSearchBackgroundColour)