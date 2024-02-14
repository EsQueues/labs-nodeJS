const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/nodejsdb', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    gender: String,
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/:pageName', (req, res) => {
    const pageName = req.params.pageName;

    switch (pageName) {
        case 'weather':
            res.sendFile(__dirname + '/index.html');
            break;
        case 'users':
            res.sendFile(__dirname + '/users.html');
            break;
        default:
            res.status(404).send('Page not found');
    }
});
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, { _id: 0, __v: 0 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/weather', async (req, res) => {
    try {
        let apiKey = 'f0b917381c4240aaa45111118241701';
        let city = req.query.city;
        let link = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
        const response = await axios.get(link);

        const weatherData = {
            location: response.data.location.name,
            temperature: response.data.current.temp_c,
            humidity: response.data.current.humidity,
            wind_kph: response.data.current.wind_kph,
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
