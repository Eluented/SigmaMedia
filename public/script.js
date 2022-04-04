import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();

socket.on('connect', () => {
    socket.on('newUser', (userAmount) => {
        document.querySelector("#users-online").textContent = `Chads Online: ${userAmount}`;
    })
});

function sendPost(e) {
    e.preventDefault();
    
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

document.querySelector('#post-form').addEventListener('submit', sendPost);