import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();
// Set Topic titles
document.querySelector('title').textContent = `Σ - ${window.location.href.toString().split('/').at(-1).charAt(0).toUpperCase() + window.location.href.toString().split('/').at(-1).slice(1)}`
document.querySelector('#topic').textContent = `${window.location.href.toString().split('/').at(-1).charAt(0).toUpperCase() + window.location.href.toString().split('/').at(-1).slice(1)}`

const searchSelector = document.querySelector('.search');

// Use connects to server, upon socket conection do the following
socket.on('connect', () => {
    // Amount of active users is received and page updated accordingly
    socket.on('newUser', (userAmount) => {
        document.querySelector("#users-online").textContent = `Chads Online: ${userAmount}`;
    });
    // Ask for the previous posts on the topic
    socket.emit('previousPosts', window.location.href.toString().split('/').at(-1))
    // Receive the previous posts of the topic
    socket.on('updatePosts', (postData) => {
        if (postData[1] === window.location.href.toString().split('/').at(-1)) {
            updatePosts(postData[0])
        }
    });
    // Receive the GIFs HTML from server
    socket.on('populateGifs', populateGifs);
});

// Sending a post to the server
function sendPost(e) {
    // Stop submit from refreshing the page
    e.preventDefault();
    // Make sure the input isn't blank
    if (e.target.posttext.value && e.target.posttext.value !== undefined) {
        // Creating the post object
        const postData = {
            postText: e.target.posttext.value,
            postUser: socket.id,
            postTopic: window.location.href.toString().split('/').at(-1),
            postImg: e.target.postplaceholder.src
        };

        // HTTP request options
        const options = {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                "Content-Type": "application/json"
            }
        };
        
        // Reset everything to blank
        document.querySelector('#post-form').reset();
        document.getElementById('postplaceholder').style.display = 'none';
        document.getElementById('postplaceholder').src = '//:0';

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
    document.querySelector('.view-comments').addEventListener('click', (e) => {
        const originPost = e.target.closest('.post');
        document.querySelector('.replies').style.display = 'flex';
        document.querySelector('.post-reply').style.display = 'flex';
        document.querySelector('.tweet').style.display = 'none';
        
        // Hide all the posts
        document.querySelectorAll('.post').forEach(post => post.style.display = 'none');
        
        // Show the target post
        originPost.style.display = "flex";
        originPost.style.borderBottom = 'none';
        originPost.querySelector('.details').style.display = 'flex';
        originPost.querySelector('.view-comments').style.display = 'none';
        originPost.querySelector('.comments-count').style.display = 'none';
    })

    // close replies button
    document.querySelector('.details').addEventListener('click', (e) => {
        const originPost = e.target.closest('.post');
        document.querySelector('.replies').style.display = 'none';
        document.querySelector('.post-reply').style.display = 'none';
        originPost.querySelector('.details').style.display = "none";
        document.querySelector('.tweet').style.display = 'flex'
        document.querySelectorAll('.post').forEach(post => {
            post.style.borderBottom = '1px solid var(--border-color)';
            post.style.display = 'flex';
        })
        originPost.querySelector('.view-comments').style.display = 'flex';
        originPost.querySelector('.comments-count').style.display = 'flex';
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