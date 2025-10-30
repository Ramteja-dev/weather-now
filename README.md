# 🌤️ Modern Weather Application

A beautiful, modern weather application built with React and Tailwind CSS that provides real-time weather information and detailed forecasts using the Open-Meteo API.

## ✨ Features

### 🎯 Core Functionality
- **Current Location Weather**: Automatically detects and displays weather for your current location on app load
- **City Search**: Search for any city worldwide with real-time suggestions
- **Favorite Cities**: Save your favorite cities for quick access
- **Detailed Weather Reports**: Click any location to view comprehensive weather data
- **Persistent Storage**: Your favorite cities are saved locally and persist across sessions

### 🌡️ Weather Data
- Real-time temperature and "feels like" temperature
- Weather conditions with intuitive emoji icons
- Wind speed and direction
- Humidity levels
- Visibility distance
- Atmospheric pressure
- UV Index with color-coded severity levels
- Cloud cover percentage
- Precipitation data

### 📊 Forecasts
- **24-Hour Forecast**: Hourly temperature, precipitation probability, and wind speed
- **7-Day Forecast**: Daily high/low temperatures, weather conditions, rain probability, wind speed, and UV index
- **Sunrise & Sunset Times**: Beautiful gradient cards showing sun timings

### 🎨 Design Features
- Modern dark theme with glassmorphism effects
- Smooth animations and transitions
- Fully responsive design (mobile, tablet, desktop)
- Gradient backgrounds based on weather conditions
- Hover effects and interactive elements
- Clean, intuitive user interface


## 🌐 API Information

This application uses the **Open-Meteo API**, which is:
- ✅ Completely free
- ✅ No API key required
- ✅ No rate limits for personal use
- ✅ Open-source weather data

### API Endpoints Used:
- **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search`
- **Weather Forecast API**: `https://api.open-meteo.com/v1/forecast`

## 📱 Usage Guide

### Adding a City
1. Click the "Add City" button in the header
2. Type the city name in the search box
3. Select from the search results
4. The city will be added to your favorites

### Viewing Detailed Weather
1. Click on the current location card or any favorite city card
2. A detailed modal will open showing:
   - Current conditions (8 metrics)
   - Sunrise/sunset times
   - 24-hour hourly forecast
   - 7-day daily forecast

### Location Permission
- On first load, the app will request location permission
- Allow location access to see weather for your current location
- If denied, you can manually search and add cities

## 🔐 Browser Permissions

The app requires the following browser permissions:
- **Geolocation**: To detect your current location for weather data
- **Local Storage**: To save your favorite cities


## 👨‍💻 Author

Your Name
- GitHub: [Ramteja-dev](https://github.com/Ramteja-dev)
- Email: ramt24599@gmail.com