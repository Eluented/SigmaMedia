const searchSelector = document.querySelector('.search') 

function changeSearchBackgroundColour() {
    searchSelector.style.background = "white";
}

function changeSearchBackgroundColourNormal() {
    searchSelector.style.background = "rgb(118, 118, 118)";
}

searchSelector.addEventListener("mouseover", changeSearchBackgroundColour)
searchSelector.addEventListener("mouseout", changeSearchBackgroundColourNormal)