const app = require('./app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

describe("All endpoints working", () => {
    test("reach the index page endpoint", async() =>{
        const response = await request.get('/')
        expect(response.status).toBe(200) 
    })
    test ("reach the topic: anime endpoint", async() =>{
        const response = await request.get('/anime')
        expect(response.status).toBe(200)
    })
    test ("reach the topic: confessions endpoint", async() =>{
        const response = await request.get('/confessions')
        expect(response.status).toBe(200)
    })
    test ("reach the topic: fitness endpoint", async() =>{
        const response = await request.get('/fitness')
        expect(response.status).toBe(200)
    })
    test ("reach the topic: grindset endpoint", async()=>{
        const response = await request.get('/grindset')
        expect(response.status).toBe(200)
    })
    test ("reach the topic: wellbeing endpoint", async()=>{
        const response = await request.get('/wellbeing')
        expect(response.status).toBe(200)
    })
})

document.documentElement.innerHTML = "<html><head></head><body>...</body></html>";