const axios = require('axios');
const jsonfile = require('jsonfile');
const express = require('express');
const cors = require('cors');

// Initialise Server and Sockets
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: { origin: "*" }
});

let usersOnline = 0;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

io.on('connection', (socket) => {
    usersOnline++;
    socket.emit('newUser', usersOnline);
    socket.on('previousPosts', (topic) => previousPosts(topic, socket));
    socket.on('getGifs', (gifSearch) => sendGIFHTML(gifSearch, socket));
    socket.broadcast.emit('newUser', usersOnline);
    socket.on('disconnect', () => {
        usersOnline--;
        socket.broadcast.emit('newUser', usersOnline);
    });
})

function formatPostHTML(postObj) {
    const date = new Date(postObj.postDateTime);
    let postHTML;
    if (postObj.postImg === "http://:0/") {
        postHTML = `<div class="post">
    <div class="left-column">
        <img class="profile-image" src="images/anonymousChad.jpg">
    </div>
    <div class="right-column">
        <article class="top-row">
            <header class="post-header">
                <div>
                    <strong>
                        <span>${postObj.postUser}</span>
                    </strong>
                    <span class="dot">.</span>
                    <span class="time">${date.toString().split(' ').slice(0, -4).join(' ')}</span>
                </div>
                <div class="details">
					<img src="images/closereplies.svg" alt="close button" class="close-svg">
				</div>
            </header>
            <p> ${postObj.postText}
            </p>
        </article>
        <div class="bottom-row">
            <!-- Comment Button -->
            <div>
                <div>
                    <svg class="view-comments" flexDirection viewBox="0 0 24 24" aria-hidden="true">
                        <g>
                            <path
                                d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z">
                            </path>
                        </g>
                    </svg>
                </div>
                <span class="comments-count">165</span>
            </div>
            <!-- Retweet Button -->
            <div>
                <div>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <g>
                            <path
                                d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z">
                            </path>
                        </g>
                    </svg>
                </div>
                <span>32</span>
            </div>
            <!-- Like Button -->
            <div>
                <div>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <g>
                            <path
                                d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z">
                            </path>
                        </g>
                    </svg>
                </div>
                <span>382</span>
            </div>
            <!-- Share Button -->
            <div>
                <div>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <g>
                            <path
                                d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z">
                            </path>
                            <path
                                d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z">
                            </path>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</div>`
    } else {
        postHTML = `<div class="post">
    <div class="left-column">
        <img class="profile-image" src="images/anonymousChad.jpg">
    </div>
    <div class="right-column">
        <article class="top-row">
            <header class="post-header">
                <div>
                    <strong>
                        <span>${postObj.postUser}</span>
                    </strong>
                    <span class="dot">.</span>
                    <span class="time">${date.toString().split(' ').slice(0, -4).join(' ')}</span>
                </div>
                <div class="details">
					<img src="images/closereplies.svg" alt="close button" class="close-svg">
				</div>
            </header>
            <p> ${postObj.postText}
            </p>
            <img style="width: 300px; height: auto;" src="${postObj.postImg}"/>
        </article>
        <div class="bottom-row">
            <!-- Comment Button -->
            <div>
                <div>
                    <svg class="view-comments" flexDirection viewBox="0 0 24 24" aria-hidden="true">
                        <g>
                            <path
                                d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z">
                            </path>
                        </g>
                    </svg>
                </div>
                <span class="comments-count">165</span>
            </div>
            <!-- Retweet Button -->
            <div>
                <div>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <g>
                            <path
                                d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z">
                            </path>
                        </g>
                    </svg>
                </div>
                <span>32</span>
            </div>
            <!-- Like Button -->
            <div>
                <div>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <g>
                            <path
                                d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z">
                            </path>
                        </g>
                    </svg>
                </div>
                <span>382</span>
            </div>
            <!-- Share Button -->
            <div>
                <div>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <g>
                            <path
                                d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z">
                            </path>
                            <path
                                d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z">
                            </path>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</div>`
    }


    return postHTML
}

function sendGIFHTML(gifSearch, socket) {
    axios.get(`https://api.giphy.com/v1/gifs/search?q=${gifSearch}&api_key=tZMcvMlYc0vxGmwjGy2areC9M53ShOK3&limit=12`)
        .then(r => {
            let count = 1;
            let gifHTML = `<div class="container-fluid">`;
            r.data['data'].forEach((gif) => {
                if (count === 1) {
                    gifHTML += `<div class="row">
                    <div class="col-md-4"><img class="gifselection img-fluid" src="${gif['images']['original']['url']}"/></div>`
                    count += 1
                } else if (count === 3) {
                    gifHTML += `<div class="col-md-4"><img class="gifselection img-fluid" src="${gif['images']['original']['url']}"/></div>
                    </div>`
                    count = 1;
                } else {
                    gifHTML += `<div class="col-md-4"><img class="gifselection img-fluid" src="${gif['images']['original']['url']}"/></div>`
                    count += 1
                }
            })
            gifHTML += `</div>`
            socket.emit('populateGifs', gifHTML);
        })
        .catch(err => console.log(err));
}

function previousPosts(topic, socket) {
    jsonfile.readFile('./data/posts.json', (err, allPosts) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        } else {
            try {
                switch (topic) {
                    case "general":
                        allPosts['AllPosts'][0]['generalPosts'].forEach(post => {
                            if (post.postNum !== 0) {
                                const postHTML = formatPostHTML(post);
                                socket.emit('updatePosts', [postHTML, 'general']);
                            }
                        })
                        break
                    case "anime":
                        allPosts['AllPosts'][1]['animePosts'].forEach(post => {
                            if (post.postNum !== 0) {
                                const postHTML = formatPostHTML(post);
                                socket.emit('updatePosts', [postHTML, 'anime']);
                            }
                        })
                        break
                    case "confessions":
                        allPosts['AllPosts'][2]['confessionPosts'].forEach(post => {
                            if (post.postNum !== 0) {
                                const postHTML = formatPostHTML(post);
                                socket.emit('updatePosts', [postHTML, 'confessions']);
                            }
                        })
                        break
                    case "fitness":
                        allPosts['AllPosts'][3]['fitnessPosts'].forEach(post => {
                            if (post.postNum !== 0) {
                                const postHTML = formatPostHTML(post);
                                socket.emit('updatePosts', [postHTML, 'fitness']);
                            }
                        })
                        break
                    case "grindset":
                        allPosts['AllPosts'][4]['grindsetPosts'].forEach(post => {
                            if (post.postNum !== 0) {
                                const postHTML = formatPostHTML(post);
                                socket.emit('updatePosts', [postHTML, 'grindset']);
                            }
                        })
                        break
                    case "meditation":
                        allPosts['AllPosts'][5]['meditationPosts'].forEach(post => {
                            if (post.postNum !== 0) {
                                const postHTML = formatPostHTML(post);
                                socket.emit('updatePosts', [postHTML, 'meditation']);
                            }
                        })
                        break
                    case "journaling":
                        allPosts['AllPosts'][6]['journalingPosts'].forEach(post => {
                            if (post.postNum !== 0) {
                                const postHTML = formatPostHTML(post);
                                socket.emit('updatePosts', [postHTML, 'journaling']);
                            }
                        })
                        break
                    case "wellbeing":
                        allPosts['AllPosts'][7]['wellbeingPosts'].forEach(post => {
                            if (post.postNum !== 0) {
                                const postHTML = formatPostHTML(post);
                                socket.emit('updatePosts', [postHTML, 'wellbeing']);
                            }
                        })
                        break
                }
            } catch (error) {
                console.log(error);
            }
        }
    })
}

function updatePostHTML(postObj, topic) {
    const postHTML = formatPostHTML(postObj);

    io.emit('updatePosts', [postHTML, topic]);
}

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/:topic', (req, res) => {
    const valid_topics = ['general', 'anime', 'confessions', 'fitness', 'grindset', 'meditation', 'journaling', 'wellbeing']
    if (valid_topics.includes(req.params.topic)) {
        res.render('topicPage');
    } else {
        res.status(404).send('Error page not found');
    }
})

app.post('/sendPost', (req, res) => {
    const data = req.body
    jsonfile.readFile('./data/posts.json', (err, allPosts) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        } else {
            try {
                const postObj = {
                    postUser: data.postUser,
                    postDateTime: Date.now(),
                    postText: data.postText,
                    postImg: data.postImg
                }
                switch (data['postTopic']) {
                    case 'general':
                        postObj['postNum'] = allPosts['AllPosts'][0]['generalPosts'].at(-1).postNum + 1;
                        allPosts['AllPosts'][0]['generalPosts'].push(postObj);
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        updatePostHTML(postObj, 'general');
                        res.status(201).send();
                        break
                    case 'anime':
                        postObj['postNum'] = allPosts['AllPosts'][1]['animePosts'].at(-1).postNum + 1;
                        allPosts['AllPosts'][1]['animePosts'].push(postObj);
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        updatePostHTML(postObj, 'anime');
                        res.status(201).send();
                        break
                    case 'confessions':
                        postObj['postNum'] = allPosts['AllPosts'][2]['confessionPosts'].at(-1).postNum + 1;
                        allPosts['AllPosts'][2]['confessionPosts'].push(postObj);
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        updatePostHTML(postObj, 'confessions');
                        res.status(201).send();
                        break
                    case 'fitness':
                        postObj['postNum'] = allPosts['AllPosts'][3]['fitnessPosts'].at(-1).postNum + 1;
                        allPosts['AllPosts'][3]['fitnessPosts'].push(postObj);
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        updatePostHTML(postObj, 'fitness');
                        res.status(201).send();
                        break
                    case 'grindset':
                        postObj['postNum'] = allPosts['AllPosts'][4]['grindsetPosts'].at(-1).postNum + 1;
                        allPosts['AllPosts'][4]['grindsetPosts'].push(postObj);
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        updatePostHTML(postObj, 'grindset');
                        res.status(201).send();
                        break
                    case 'meditation':
                        postObj['postNum'] = allPosts['AllPosts'][5]['meditationPosts'].at(-1).postNum + 1;
                        allPosts['AllPosts'][5]['meditationPosts'].push(postObj);
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        updatePostHTML(postObj, 'meditation');
                        res.status(201).send();
                        break
                    case 'journaling':
                        postObj['postNum'] = allPosts['AllPosts'][6]['journalingPosts'].at(-1).postNum + 1;
                        allPosts['AllPosts'][6]['journalingPosts'].push(postObj);
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        updatePostHTML(postObj, 'journaling');
                        res.status(201).send();
                        break
                    case 'wellbeing':
                        postObj['postNum'] = allPosts['AllPosts'][7]['wellbeingPosts'].at(-1).postNum + 1;
                        allPosts['AllPosts'][7]['wellbeingPosts'].push(postObj);
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        updatePostHTML(postObj, 'wellbeing');
                        res.status(201).send();
                        break
                    default:
                        res.status(400).send()
                        break
                }
            } catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        }
    })
})

module.exports = server