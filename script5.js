// script.js

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('button');
    const container = document.querySelector('.container');
    const weatherBox = document.querySelector('.weather-box');
    const weatherDetails = document.querySelector('.weather-details');
    const error404 = document.querySelector('.notfound');
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    const inputField = document.getElementById('input');

    // Function to get current date and time
    function updateDateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = now.toLocaleDateString('en-US', options);
        const time = now.toLocaleTimeString('en-US');
        dateElement.textContent = date;
        timeElement.textContent = time;
    }

    // Function to clear input field and error message
    function clearInputAndError() {
        inputField.value = '';
        error404.classList.remove('active');
    }

    // Timer to clear input and error message after 5 seconds
    function startClearTimer() {
        setTimeout(clearInputAndError, 5000);
    }

    // Initial call to update date and time
    updateDateTime();

    searchButton.addEventListener('click', () => {
        const city = inputField.value.trim();

        if (city === '') {
            return;
        }

        const apiKey = '47c38caa78922ea90063cbe04c088dda'; // Replace with your OpenWeatherMap API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                const weatherImage = document.querySelector('.weather-box img');
                const temperature = document.querySelector('.temperature');
                const description = document.querySelector('.description');
                const humidity = document.querySelector('.humidity span');
                const wind = document.querySelector('.wind span');

                weatherImage.src = getWeatherImage(data.weather[0].main);
                temperature.innerHTML = `${Math.round(data.main.temp)}<span>°C</span>`;
                description.textContent = data.weather[0].description;
                humidity.textContent = `${data.main.humidity}%`;
                wind.textContent = `${data.wind.speed} km/h`;

                // Show weather information and hide "Location not found" message
                container.style.height = '555px';
                weatherBox.classList.add('active');
                weatherDetails.classList.add('active');
                error404.classList.remove('active');

                // Start timer to clear input and error message after 5 seconds
                startClearTimer();
            })
            .catch(error => {
                console.log('Error fetching weather data:', error);
                // Show "Location not found" message and hide weather information
                container.style.height = '400px';
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                error404.classList.add('active');

                // Start timer to clear input and error message after 5 seconds
                startClearTimer();
            });
    });

    function getWeatherImage(weatherType) {
        switch (weatherType.toLowerCase()) {
            case 'clear':
                return 'img/sun.png';
            case 'clouds':
                return 'img/cloud.webp';
            case 'rain':
                return 'img/rainy.png';
            case 'drizzle':
                return 'img/drizzle.png';
            case 'thunderstorm':
                return 'img/thunderstorm.png';
            case 'snow':
                return 'img/snow.png';
            case 'mist':
                return 'img/mist.png';
            case 'fog':
                return 'img/fog.png';
            default:
                return 'img/mist.png'; // Fallback image for unknown weather
        }
    }
});
