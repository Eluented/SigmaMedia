const server = require('./app')

//Server listening on Port 3000
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`\nServer listening on port ${port}\n`))
