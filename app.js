const axios = require('axios')
const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io=require('socket.io')(server, {
    cors: { origin: "*"}
});

app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('disconnect', () => console.log("User disconnected"));
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

module.exports = server