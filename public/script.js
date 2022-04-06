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
    socket.on('populateGifs', populateGifs);
});

function sendPost(e) {
    e.preventDefault();
    console.log(e.target.posttext.value)
    if (e.target.posttext.value && e.target.posttext.value !== undefined) {
        document.getElementById('postplaceholder').style.display = 'none';
        console.log(e.target.postplaceholder.src);
        const postData = {
            postText: e.target.posttext.value,
            postUser: socket.id,
            postTopic: window.location.href.toString().split('/').at(-1),
            postImg: e.target.postplaceholder.src
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


// Emit a socket call for GIF data
function searchGifs(e) {
    e.preventDefault();
    socket.emit('getGifs', e.target.giftext.value);
}

// Add Gifs from socket return
function populateGifs(gifHTML) {
    document.querySelector('#gif-container').innerHTML = "";
    document.querySelector('#gif-container').insertAdjacentHTML("afterbegin", gifHTML);
    document.querySelectorAll('.gifselection').forEach(gifSelect => gifSelect.addEventListener('click', addGifPost));
}

function addGifPost(e) {
    console.log(e.target.src)
    document.getElementById('postplaceholder').src = e.target.src;
    document.getElementById('postplaceholder').style.display = 'block';
}

document.querySelector('#post-form').addEventListener('submit', sendPost);
searchSelector.addEventListener("mouseover", changeSearchBackgroundColour);
searchSelector.addEventListener("mouseout", changeSearchBackgroundColourNormal);

document.querySelector('.gif-forum').addEventListener('submit', searchGifs);

// opening gif container
document.getElementById('gif-icon').addEventListener('click', () => {
    document.querySelector('.bg-modal').style.display = 'flex';
})

// closing gif button
document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('#gif-container').innerHTML = "";
    document.querySelector('.bg-modal').style.display = 'none';
    document.querySelector('.gif-forum').reset();
})

// pressing comments svg - opens an option to comment and an option to see replies - and also shows close svg
document.querySelector('.view-comments').addEventListener('click', () => {
    document.querySelector('.replies').style.display = 'flex';
    document.querySelector('.post-reply').style.display = 'flex';
    document.querySelector('.details').style.display = 'flex';
    document.querySelector('.tweet').style.display = 'none';
    document.querySelector('.post').style.borderBottom = 'none';
    document.querySelector('.view-comments').style.display = 'none';
    document.querySelector('.comments-count').style.display = 'none';
})

// close replies button
document.querySelector('.details').addEventListener('click', () => {
    document.querySelector('.replies').style.display = 'none';
    document.querySelector('.post-reply').style.display = 'none';
    document.querySelector('.details').style.display = 'none';
    document.querySelector('.tweet').style.display = 'flex'
    document.querySelector('.post').style.borderBottom = '1px solid var(--border-color)';
    document.querySelector('.view-comments').style.display = 'flex';
    document.querySelector('.comments-count').style.display = 'flex';
})