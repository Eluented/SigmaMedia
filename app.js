const axios = require('axios')
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
app.use(express.json())
app.use(express.static('public')); 
app.set('view engine', 'ejs');

io.on('connection', (socket) => {
    usersOnline++;
    socket.emit('newUser', usersOnline);
    socket.broadcast.emit('newUser', usersOnline);
    socket.on('disconnect', () => {
        usersOnline--;
        socket.broadcast.emit('newUser', usersOnline);
    });
})

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/:topic', (req, res) => {
    switch (req.params.topic) {
        case "anime":
            console.log("anime");
            res.render('index');
            break;
        case "confessions":
            console.log("confessions");
            res.render('index');
            break;
        case "fitness":
            console.log("fitness");
            res.render('index');
            break;
        case "grindset":
            console.log("grindset");
            res.render('index');
            break;
        case "wellbeing":
            console.log("wellbeing");
            res.render('index');
            break;
        default:
            res.status(404).send("Error page not found.");
            break;
    }
})

app.post('/sendPost', (req, res) => {
    const data = req.body
    jsonfile.readFile('./data/posts.json', (err, allPosts) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        } else {
            try {
                switch (data['postTopic']) {
                    case 'general':
                        allPosts['AllPosts'][0]['generalPosts'].push({
                            postNum: allPosts['AllPosts'][0]['generalPosts'].at(-1).postNum + 1,
                            postUser: data.postUser,
                            postDateTime: Date.now(),
                            postText: data.postText
                        })
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        res.status(201).send();
                        break
                    case 'anime':
                        allPosts['AllPosts'][1]['animePosts'].push({
                            postNum: allPosts['AllPosts'][1]['animePosts'].at(-1).postNum + 1,
                            postUser: data.postUser,
                            postDateTime: Date.now(),
                            postText: data.postText
                        })
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        res.status(201).send();
                        break
                    case 'confessions':
                        allPosts['AllPosts'][2]['confessionPosts'].push({
                            postNum: allPosts['AllPosts'][2]['confessionPosts'].at(-1).postNum + 1,
                            postUser: data.postUser,
                            postDateTime: Date.now(),
                            postText: data.postText
                        })
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        res.status(201).send();
                        break
                    case 'fitness':
                        allPosts['AllPosts'][3]['fitnessPosts'].push({
                            postNum: allPosts['AllPosts'][3]['fitnessPosts'].at(-1).postNum + 1,
                            postUser: data.postUser,
                            postDateTime: Date.now(),
                            postText: data.postText
                        })
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        res.status(201).send();
                        break
                    case 'grindset':
                        allPosts['AllPosts'][4]['grindsetPosts'].push({
                            postNum: allPosts['AllPosts'][4]['grindsetPosts'].at(-1).postNum + 1,
                            postUser: data.postUser,
                            postDateTime: Date.now(),
                            postText: data.postText
                        })
                        jsonfile.writeFile('./data/posts.json', allPosts);
                        res.status(201).send();
                        break
                    case 'wellbeing':
                        allPosts['AllPosts'][7]['wellbeingPosts'].push({
                            postNum: allPosts['AllPosts'][7]['wellbeingPosts'].at(-1).postNum + 1,
                            postUser: data.postUser,
                            postDateTime: Date.now(),
                            postText: data.postText
                        })
                        jsonfile.writeFile('./data/posts.json', allPosts);
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