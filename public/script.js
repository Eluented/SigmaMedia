import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();

socket.on('connect', () => {
    socket.on('newUser', (userAmount) => {
        document.querySelector("#users-online").textContent = `Chads Online: ${userAmount}`;
    });
    socket.emit('previousPosts', window.location.href.toString().split('/').at(-1))
    socket.on('updatePosts', updatePosts);
});

function sendPost(e) {
    e.preventDefault();
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

function updatePosts(postHTML) {
    document.querySelector('#postfeed').insertAdjacentHTML("afterbegin", postHTML);
}

document.querySelector('#post-form').addEventListener('submit', sendPost);