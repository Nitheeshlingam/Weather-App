"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const images = [
        "images/img1.avif",
        "images/img2.avif",
        "images/img3.avif",
        "images/img4.avif",
        "images/img5.avif",
        "images/img6.avif",
        "images/img7.avif",
        "images/img8.avif",
    ];

    const button = document.querySelector(".btn_search");

    button.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent form submission
        const randomIndex = Math.floor(Math.random() * images.length);
        const selectedImage = images[randomIndex];
        document.body.style.backgroundImage = `url('${selectedImage}')`;
    });
});

const API = "b079490d4c324f2ec84b0f80664e26c6";

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const btnEl = document.querySelector(".btn_search");
const inputEl = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const emojiContainer = document.querySelector(".emoji_container"); // Updated emoji container

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

// display the day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// display date
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();

dateEl.textContent = date + " " + month + " " + year;

// add event
btnEl.addEventListener("click", (e) => {
    e.preventDefault();

    // check empty value
    if (inputEl.value !== "") {
        const searchQuery = inputEl.value.trim(); // Trim whitespace from search query
        inputEl.value = "";
        findLocation(searchQuery);
    } else {
        console.log("Please Enter City or Country Name");
    }
});

// Function to get weather emoji based on description
function getWeatherEmoji(description) {
    const weatherEmojis = {
        Clear: "😎",
        Clouds: "😊",
        Rain: "😔",
        Drizzle: "😕",
        Thunderstorm: "😱",
        Snow: "🥶",
        Mist: "😶",
        Smoke: "😷",
        Haze: "😷",
        Dust: "😷",
        Fog: "😶",
        Sand: "😷",
        Ash: "😷",
        Squall: "😨",
        Tornado: "🌪️",
        default: "❓",
    };

    return weatherEmojis[description] || weatherEmojis.default;
}

// Function to fetch weather data from API
async function findLocation(name) {
    iconsContainer.innerHTML = "";
    dayInfoEl.innerHTML = "";
    emojiContainer.innerHTML = ""; // Clear emoji container
    try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.cod !== "404") {
            // Display image content
            const imageContent = displayImageContent(data);

            // Display right side content
            const rightSide = rightSideContent(data);

            // Get emoji based on weather description
            const emoji = getWeatherEmoji(data.weather[0].main);
            const emojiElement = `<span class="emoji">${emoji}</span>`;

            // Add emoji to the container
            emojiContainer.insertAdjacentHTML("afterbegin", emojiElement);

            // Display the fetched content
            setTimeout(() => {
                iconsContainer.insertAdjacentHTML("afterbegin", imageContent);
                iconsContainer.classList.add("fadeIn");
                dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
            }, 1500);
        } else {
            const message = `<h2 class="weather_temp">${data.cod}</h2>
            <h3 class="cloudtxt">${data.message}</h3>`;
            iconsContainer.insertAdjacentHTML("afterbegin", message);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Function to display image content and temperature
function displayImageContent(data) {
    const temperature = Math.floor(data.main.temp - 273.15);
    const { icon, description } = data.weather[0];
    const imageContent = `<img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${description}" />
        <h2 class="weather_temp">${temperature}°C</h2>
        <h3 class="cloudtxt">${description}</h3>`;
    return imageContent;
}

// Function to display right side content
function rightSideContent(data) {
    const { name } = data;
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    const rightSide = `<div class="content">
            <p class="title">NAME</p>
            <span class="value">${name}</span>
        </div>
        <div class="content">
            <p class="title">TEMP</p>
            <span class="value">${Math.floor(temp - 273.15)}°C</span>
        </div>
        <div class="content">
            <p class="title">HUMIDITY</p>
            <span class="value">${humidity}%</span>
        </div>
        <div class="content">
            <p class="title">WIND SPEED</p>
            <span class="value">${speed} Km/h</span>
        </div>`;
    return rightSide;
}

// Rotate emoji based on mouse movement
emojiContainer.addEventListener("mousemove", function (e) {
    const emoji = emojiContainer.querySelector(".emoji");
    const rect = emoji.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const angle = (e.clientX - centerX) / 100;

    emoji.style.transform = `rotate(${angle}deg)`;
});
