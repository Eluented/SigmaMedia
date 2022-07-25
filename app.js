const axios = require('axios');
const jsonfile = require('jsonfile');
const express = require('express');
const cors = require('cors');
const { json } = require('express');

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
    socket.data.alreadyReacted = [];
    socket.emit('newUser', usersOnline);
    socket.on('previousPosts', (topic) => previousPosts(topic, socket));
    socket.on('previousComments', (commentData) => previousComments(commentData, socket));
    socket.on('getGifs', (gifSearch) => sendGIFHTML(gifSearch, socket));
    socket.on('sendReaction', (reactionData) => storeReactions(reactionData, socket));
    socket.broadcast.emit('newUser', usersOnline);
    socket.on('disconnect', () => {
        usersOnline--;
        socket.broadcast.emit('newUser', usersOnline);
    });
})

function formatPostHTML(postObj) {
    const date = new Date(postObj.postDateTime);
    let postHTML;
    if (postObj.postImg === "http://:0/" || postObj.postImg === "https://:0/") {
        postHTML = `<div class="post">
    <div class="left-column">
        <img class="profile-image" src="images/anonymousChad.jpg">
    </div>
    <div class="right-column">
        <article class="top-row">
            <header class="post-header">
                <div class="BRUH">
                    <strong>
                        <span>${postObj.postUser}</span>
                    </strong>
                    <span class="dot">.</span>
                    <span class="time">${date.toString().split(' ').slice(0, -4).join(' ')}</span>
                </div>
                <div class="post-number">
								<strong>Post No.</strong>
								<span id="postnum">${postObj.postNum}</span>
							</div>
                <div class="details">
					<img src="images/closereplies.svg" alt="close button" class="close-svg">
				</div>
            </header>
            <p> ${postObj.postText}
            </p>
        </article>
        <div class="bottom-rowEEE">
            <!-- Comment Button -->
            <div>
				<div class="comment-svg-container">
					<svg class="view-comments" viewBox="0 0 1550 1550" id="svg3013" version="1.1"
						inkscape:version="0.48.3.1 r9886" width="100%" height="100%"
						sodipodi:docname="comments_alt_font_awesome.svg">
						<g transform="matrix(1,0,0,-1,30.372881,1259.8983)" id="g3015">
							<path
								d="M 704,1152 Q 551,1152 418,1100 285,1048 206.5,959 128,870 128,768 q 0,-82 53,-158 53,-76 149,-132 l 97,-56 -35,-84 q 34,20 62,39 l 44,31 53,-10 q 78,-14 153,-14 153,0 286,52 133,52 211.5,141 78.5,89 78.5,191 0,102 -78.5,191 -78.5,89 -211.5,141 -133,52 -286,52 z m 0,128 q 191,0 353.5,-68.5 Q 1220,1143 1314,1025 1408,907 1408,768 1408,629 1314,511 1220,393 1057.5,324.5 895,256 704,256 618,256 528,272 404,184 250,144 214,135 164,128 h -3 q -11,0 -20.5,8 -9.5,8 -11.5,21 -1,3 -1,6.5 0,3.5 0.5,6.5 0.5,3 2,6 l 2.5,5 q 0,0 3.5,5.5 3.5,5.5 4,5 0.5,-0.5 4.5,5 4,5.5 4,4.5 5,6 23,25 18,19 26,29.5 8,10.5 22.5,29 Q 235,303 245.5,323 256,343 266,367 142,439 71,544 0,649 0,768 0,907 94,1025 188,1143 350.5,1211.5 513,1280 704,1280 z M 1526,111 q 10,-24 20.5,-44 10.5,-20 25,-38.5 14.5,-18.5 22.5,-29 8,-10.5 26,-29.5 18,-19 23,-25 1,-1 4,-4.5 3,-3.5 4.5,-5 1.5,-1.5 4,-5 2.5,-3.5 3.5,-5.5 l 2.5,-5 q 0,0 2,-6 2,-6 0.5,-6.5 -1.5,-0.5 -1,-6.5 -3,-14 -13,-22 -10,-8 -22,-7 -50,7 -86,16 Q 1388,-72 1264,16 1174,0 1088,0 817,0 616,132 q 58,-4 88,-4 161,0 309,45 148,45 264,129 125,92 192,212 67,120 67,254 0,77 -23,152 129,-71 204,-178 75,-107 75,-230 0,-120 -71,-224.5 Q 1650,183 1526,111 z"
								id="path3017" inkscape:connector-curvature="0" style="fill:currentColor" />
						</g>
					</svg>
				</div>
				<span class="comments-count">${postObj.comments.length}</span>
			</div>
            <!--emoji box start-->
						<div class="reaction-capsule">
							<div class="emojiContainer">
								<div class="reactBox">
									<a class="reactBtn"><img src="emoji/previewEmoji.gif" alt=""></a>
									<div class="emoji">
                            <div class="reacts">
                                <div class="holder"></div>
                            </div>
                            <div class="reacts">
                                <p>Giga Chad<br>Approved</p>
                                <img class="chadReact" src="emoji/emojiChad.gif" alt="">
                                <div class="chadReactCount rCount">
                                    <p>0</p>
                                </div>
                            </div>
                            <div class="reacts">
                                <p>I feel you<br>Bro</p>
                                <img class="feelsReact" src="emoji/emojiFeelYou.gif" alt="">
                                <div class="feelsReactCount rCount">
                                    <p>0</p>
                                </div>
                            </div>
                            <div class="reacts">
                                <p>That's sus<br>Bro</p>
                                <img class="susReact" src="emoji/emojiAnon.gif" alt="">
                                <div class="susReactCount rCount">
                                    <p>0</p>
                                </div>
                            </div>
                            <div class="reacts">
                                <p>You made<br>my day</p>
                                <img class="madeDayReact" src="emoji/emojiYesBro.gif" alt="">
                                <div class="madeDayReactCount rCount">
                                    <p>0</p>
                                </div>
                            </div>
                        </div>
								</div>
							</div>
						</div>
						<!--end of emoji box-->
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
                <div class="post-number">
								<strong>Post No.</strong>
								<span id="postnum">${postObj.postNum}</span>
							</div>
                <div class="details">
					<img src="images/closereplies.svg" alt="close button" class="close-svg">
				</div>
            </header>
            <p> ${postObj.postText}
            </p>
            <img style="width: auto; height: 300px;" src="${postObj.postImg}"/>
        </article>
        <div class="bottom-rowEEE">
            <!-- Comment Button -->
            <div>
				<div class="comment-svg-container">
					<svg class="view-comments" viewBox="0 0 1550 1550" id="svg3013" version="1.1"
						inkscape:version="0.48.3.1 r9886" width="100%" height="100%"
						sodipodi:docname="comments_alt_font_awesome.svg">
						<g transform="matrix(1,0,0,-1,30.372881,1259.8983)" id="g3015">
							<path
								d="M 704,1152 Q 551,1152 418,1100 285,1048 206.5,959 128,870 128,768 q 0,-82 53,-158 53,-76 149,-132 l 97,-56 -35,-84 q 34,20 62,39 l 44,31 53,-10 q 78,-14 153,-14 153,0 286,52 133,52 211.5,141 78.5,89 78.5,191 0,102 -78.5,191 -78.5,89 -211.5,141 -133,52 -286,52 z m 0,128 q 191,0 353.5,-68.5 Q 1220,1143 1314,1025 1408,907 1408,768 1408,629 1314,511 1220,393 1057.5,324.5 895,256 704,256 618,256 528,272 404,184 250,144 214,135 164,128 h -3 q -11,0 -20.5,8 -9.5,8 -11.5,21 -1,3 -1,6.5 0,3.5 0.5,6.5 0.5,3 2,6 l 2.5,5 q 0,0 3.5,5.5 3.5,5.5 4,5 0.5,-0.5 4.5,5 4,5.5 4,4.5 5,6 23,25 18,19 26,29.5 8,10.5 22.5,29 Q 235,303 245.5,323 256,343 266,367 142,439 71,544 0,649 0,768 0,907 94,1025 188,1143 350.5,1211.5 513,1280 704,1280 z M 1526,111 q 10,-24 20.5,-44 10.5,-20 25,-38.5 14.5,-18.5 22.5,-29 8,-10.5 26,-29.5 18,-19 23,-25 1,-1 4,-4.5 3,-3.5 4.5,-5 1.5,-1.5 4,-5 2.5,-3.5 3.5,-5.5 l 2.5,-5 q 0,0 2,-6 2,-6 0.5,-6.5 -1.5,-0.5 -1,-6.5 -3,-14 -13,-22 -10,-8 -22,-7 -50,7 -86,16 Q 1388,-72 1264,16 1174,0 1088,0 817,0 616,132 q 58,-4 88,-4 161,0 309,45 148,45 264,129 125,92 192,212 67,120 67,254 0,77 -23,152 129,-71 204,-178 75,-107 75,-230 0,-120 -71,-224.5 Q 1650,183 1526,111 z"
								id="path3017" inkscape:connector-curvature="0" style="fill:currentColor" />
						</g>
					</svg>
				</div>
				<span class="comments-count">${postObj.comments.length}</span>
			</div>
            <!--emoji box start-->
						<div class="reaction-capsule">
							<div class="emojiContainer">
								<div class="reactBox">
									<a class="reactBtn"><img src="emoji/previewEmoji.gif" alt=""></a>
									<div class="emoji">
                            <div class="reacts">
                                <div class="holder"></div>
                            </div>
                            <div class="reacts">
                                <p>Giga Chad<br>Approved</p>
                                <img class="chadReact" src="emoji/emojiChad.gif" alt="">
                                <div class="chadReactCount rCount">
                                    <p>0</p>
                                </div>
                            </div>
                            <div class="reacts">
                                <p>I feel you<br>Bro</p>
                                <img class="feelsReact" src="emoji/emojiFeelYou.gif" alt="">
                                <div class="feelsReactCount rCount">
                                    <p>0</p>
                                </div>
                            </div>
                            <div class="reacts">
                                <p>That's sus<br>Bro</p>
                                <img class="susReact" src="emoji/emojiAnon.gif" alt="">
                                <div class="susReactCount rCount">
                                    <p>0</p>
                                </div>
                            </div>
                            <div class="reacts">
                                <p>You made<br>my day</p>
                                <img class="madeDayReact" src="emoji/emojiYesBro.gif" alt="">
                                <div class="madeDayReactCount rCount">
                                    <p>0</p>
                                </div>
                            </div>
                        </div>
								</div>
							</div>
						</div>
						<!--end of emoji box-->
        </div>
    </div>
</div>`
    }


    return postHTML
}

function formatCommentHTML(commentObj) {
    const date = new Date(commentObj.commentDateTime);
    let commentHTML;

    if (commentObj.commentImg === "http://:0/" || commentObj.commentImg === "https://:0/") {
        commentHTML = `<div class="reply">
        <div class="left-column">
            <img class="profile-image" src="images/anonymousChad.jpg">
        </div>
        <div class="right-column">
            <article class="top-row">
                <header class="post-header">
                    <div class="BRUH">
                        <strong>
                            <span>${commentObj.commentUser}</span>
                        </strong>
                        <span class="dot">.</span>
                        <span class="time">${date.toString().split(' ').slice(0, -4).join(' ')}</span>
                    </div>
                    <div class="details">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <g>
                                <circle cx="5" cy="12" r="2"></circle>
                                <circle cx="12" cy="12" r="2"></circle>
                                <circle cx="19" cy="12" r="2"></circle>
                            </g>
                        </svg>
                    </div>
                </header>

                <p>${commentObj.commentText}
                </p>
            </article>
            <div class="bottom-row">
            </div>
        </div>
    </div>`
    } else {
        commentHTML = `<div class="reply">
        <div class="left-column">
            <img class="profile-image" src="images/anonymousChad.jpg">
        </div>
        <div class="right-column">
            <article class="top-row">
                <header class="post-header">
                    <div class="BRUH">
                        <strong>
                            <span>${commentObj.commentUser}</span>
                        </strong>
                        <span class="dot">.</span>
                        <span class="time">${date.toString().split(' ').slice(0, -4).join(' ')}</span>
                    </div>
                    <div class="details">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <g>
                                <circle cx="5" cy="12" r="2"></circle>
                                <circle cx="12" cy="12" r="2"></circle>
                                <circle cx="19" cy="12" r="2"></circle>
                            </g>
                        </svg>
                    </div>
                </header>

                <p>${commentObj.commentText}
                </p>
                <img style="width: auto; height: 300px;" src="${commentObj.commentImg}"/>
            </article>
            <div class="bottom-row">
            </div>
        </div>
    </div>`
    }

    return commentHTML;
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
                allPosts['AllPosts'][`${topic}Posts`].forEach(post => {
                    if (post.postNum !== 0) {
                        const postHTML = formatPostHTML(post);
                        socket.emit('updatePosts', [postHTML, topic]);
                    }
                })
                updateReactions(topic, socket)
            } catch (error) {
                console.log(error);
            }
        }
    })
}

function previousComments(commentData, socket) {
    jsonfile.readFile('./data/posts.json', (err, allPosts) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        } else {
            try {
                allPosts['AllPosts'][`${commentData[0]}Posts`].forEach(post => {
                    if (post.postNum === commentData[1]) {
                        post.comments.forEach(comment => {
                            const commentHTML = formatCommentHTML(comment);
                            socket.emit('updateComments', [commentHTML, commentData[0], post.postNum]);
                        })
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
    })
}

function storeReactions(reactionObj, socket) {
    jsonfile.readFile('./data/posts.json', async (err, allPosts) => {
        if (err) {
            console.log(err);
        } else {
            if (socket.data.alreadyReacted.length === 0) {
                newPosts = allPosts['AllPosts'][`${reactionObj['topic']}Posts`].map(post => {
                    if (post.postNum === reactionObj['postNumber']) {
                        post.postReactions[`${reactionObj['reaction']}`]++
                        return post;
                    } else {
                        return post;
                    }
                })
                allPosts['AllPosts'][`${reactionObj['topic']}Posts`] = newPosts;
                socket.data.alreadyReacted.push({
                    postNum: reactionObj['postNumber'],
                    postReaction: reactionObj['reaction']
                })
                await jsonfile.writeFile('./data/posts.json', allPosts)
                updateReactions(reactionObj['topic'], socket);
            } else {
                if (socket.data.alreadyReacted.some(alreadyObj => alreadyObj['postNum'] === reactionObj['postNumber'] && alreadyObj['postReaction'] === reactionObj['reaction'])) {
                    newPosts = allPosts['AllPosts'][`${reactionObj['topic']}Posts`].map(post => {
                        if (post.postNum === reactionObj['postNumber']) {
                            post.postReactions[`${reactionObj['reaction']}`]--
                            return post;
                        } else {
                            return post;
                        }
                    })
                    allPosts['AllPosts'][`${reactionObj['topic']}Posts`] = newPosts;
                    await jsonfile.writeFile('./data/posts.json', allPosts)
                    updateReactions(reactionObj['topic'], socket);
                    socket.data.alreadyReacted.splice(socket.data.alreadyReacted.findIndex(alreadyObj => alreadyObj['postNum'] === reactionObj['postNumber'] && alreadyObj['postReaction'] === reactionObj['reaction']), 1);
                } else {
                    newPosts = allPosts['AllPosts'][`${reactionObj['topic']}Posts`].map(post => {
                        if (post.postNum === reactionObj['postNumber']) {
                            post.postReactions[`${reactionObj['reaction']}`]++
                            return post;
                        } else {
                            return post;
                        }
                    })
                    allPosts['AllPosts'][`${reactionObj['topic']}Posts`] = newPosts;
                    socket.data.alreadyReacted.push({
                        postNum: reactionObj['postNumber'],
                        postReaction: reactionObj['reaction']
                    })
                    await jsonfile.writeFile('./data/posts.json', allPosts)
                    updateReactions(reactionObj['topic'], socket);
                }
            }
        }

    })
}

function updateReactions(topic) {
    jsonfile.readFile('./data/posts.json', (err, allPosts) => {
        if (err) {
            console.log(err)
        } else {
            allPosts['AllPosts'][`${topic}Posts`].forEach(post => {
                io.emit('updateReactions', {
                    postNum: post.postNum,
                    postReactions: post.postReactions
                })
            })
        }
    })
}


function updatePostHTML(postObj, topic) {
    const postHTML = formatPostHTML(postObj);

    io.emit('updatePosts', [postHTML, topic]);
}

function updateCommentHTML(commentObj, topic, postNumber) {
    const commentHTML = formatCommentHTML(commentObj);

    io.emit('updateComments', [commentHTML, topic, postNumber]);
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
                    postImg: data.postImg,
                    postReactions:
                    {
                        "chad": 0,
                        "sad": 0,
                        "sus": 0,
                        "good": 0
                    },
                    comments: []
                }

                postObj['postNum'] = allPosts['AllPosts'][`${data['postTopic']}Posts`].at(-1).postNum + 1;
                allPosts['AllPosts'][`${data['postTopic']}Posts`].push(postObj);
                jsonfile.writeFile('./data/posts.json', allPosts);
                updatePostHTML(postObj, data['postTopic']);
                res.status(201).send();

            } catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        }
    })
})

app.post('/sendComment', (req, res) => {
    const data = req.body
    jsonfile.readFile('./data/posts.json', (err, allPosts) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        } else {
            try {
                const commentObj = {
                    commentUser: data.commentUser,
                    commentDateTime: Date.now(),
                    commentText: data.commentText,
                    commentImg: data.commentImg
                }
                allPosts['AllPosts'][`${data['postTopic']}Posts`].forEach(post => {
                    if (post.postNum === data.commentPostNum) {
                        post.comments.push(commentObj);
                    }
                })
                jsonfile.writeFile('./data/posts.json', allPosts);
                updateCommentHTML(commentObj, data['postTopic'], data.commentPostNum);
                res.status(201).send();

            } catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        }
    })
})

module.exports = server