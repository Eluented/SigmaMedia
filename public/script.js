import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();
const searchSelector = document.querySelector('.search');

socket.on('connect', () => {
    socket.on('newUser', (userAmount) => {
        document.querySelector("#users-online").textContent = `Chads Online: ${userAmount}`;
    });
    socket.emit('previousPosts', window.location.href.toString().split('/').at(-1))
    socket.on('updatePosts', (postData) => {
        if (postData[1] === window.location.href.toString().split('/').at(-1)) {
            updatePosts(postData[0])
        }
    });
});

function sendPost(e) {
    e.preventDefault();
    console.log(e.target.posttext.value)
    if (e.target.posttext.value && e.target.posttext.value !== undefined) {
        const postData = {
            postText: e.target.posttext.value,
            postUser: socket.id,
            postTopic: window.location.href.toString().split('/').at(-1)
        };

        const options = {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                "Content-Type": "application/json"
            }
        };

        document.querySelector('#post-form').reset();

        fetch(`${window.location.origin}/sendPost`, options)
    }
}

// changing colour of input top right
function changeSearchBackgroundColour() {
    searchSelector.style.background = "white";
}
// changing colour of input top right
function changeSearchBackgroundColourNormal() {
    searchSelector.style.background = "rgb(118, 118, 118)";
}

function updatePosts(postHTML) {
    document.querySelector('#postfeed').insertAdjacentHTML("afterbegin", postHTML);

    // pressing comments svg - opens an option to comment and an option to see replies - and also shows close svg
    document.querySelector('.view-comments').addEventListener('click', () => {
        document.querySelector('.replies').style.display = 'flex';
        document.querySelector('.post-reply').style.display = 'flex';
        document.querySelector('.details').style.display = 'flex';
    })
}

document.querySelector('#post-form').addEventListener('submit', sendPost);
searchSelector.addEventListener("mouseover", changeSearchBackgroundColour);
searchSelector.addEventListener("mouseout", changeSearchBackgroundColourNormal);

// opening gif container
document.getElementById('gif-icon').addEventListener('click', () => {
    document.querySelector('.bg-modal').style.display = 'flex';
})

// closing gif button
document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.bg-modal').style.display = 'none';
})

// close replies button
document.querySelector('.details').addEventListener('click', () => {
    document.querySelector('.replies').style.display = 'none';
    document.querySelector('.post-reply').style.display = 'none';
    document.querySelector('.details').style.display = 'none';
})

/*
// giphy api
(function () {
    return fetch()
})
const GIPHY_API = `https://api.giphy.com/v1/gifs/search?q=${keyword}api_key=F5lIfSy0whiLXlpUdCs3OMVFe8Saf1sC&limit=20`;
*/