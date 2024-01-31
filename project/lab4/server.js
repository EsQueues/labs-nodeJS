const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/:pageName', (req, res) => {
    const pageName = req.params.pageName

    switch (pageName) {
        case 'weather':
            res.sendFile(__dirname + '/index.html')
            break
        case 'users':
            res.sendFile(__dirname + '/users.html')
            break

        default:
            res.status(404).send('Page not found')
    }
})
// Define a route to get weather information
app.get('/api/weather', async (req, res) => {
    try {
        // Replace 'YOUR_API_KEY' with your actual WeatherAPI API key
        let apiKey = 'f0b917381c4240aaa45111118241701' //bd5e378503939ddaee76f12ad7a97608
        let city = req.query.city // Get the city from the query parameters
        let link = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
        // Make a request to the WeatherAPI
        const response = await axios.get(
            link
        )

        const weatherData = {
            location: response.data.location.name,
            temperature: response.data.current.temp_c,
            condition: response.data.current.condition.text,
        }
        res.json(weatherData)

    } catch (error) {
        // Handle errors
        console.error('Error fetching weather data:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.get('/api/users', async (req, res) => {
    try {
        let link = `https://reqres.in/api/users`
        const response = await axios.get(link)

        const users = response.data.data.map(user => ({
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            avatar: user.avatar,
        }))

        res.json(users)
    } catch (error) {
        // Handle errors
        console.error('Error fetching weather data:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})
// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
