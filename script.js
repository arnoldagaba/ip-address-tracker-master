// Initialize the map
let map = L.map('map').setView([0, 0], 2); // Default view, to be updated with IP location

// Set up the map tile layer (from OpenStreetMap or other sources)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// API key from IPify
const apiKey = 'at_M1QhuOigURVJC4Z2svoM5PKxNVIRL';

// Function to fetch IP geolocation data
async function fetchIPDetails(ip = '') {
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ip}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching the IP details:', error);
  }
}

// Function to update the map and display the IP details
function updateMapAndDetails(data) {
  const { lat, lng } = data.location;

  // Center the map on the IP's location
  map.setView([lat, lng], 13); // Zoom level 13 for city view

  // Add a marker on the map
  L.marker([lat, lng]).addTo(map).bindPopup(`IP: ${data.ip}`).openPopup();

  // Update the details in the HTML
  document.getElementById('address').value = data.ip;
  document.getElementById('location').value = `${data.location.city}, ${data.location.region}`;
  document.getElementById('time').value = `UTC ${data.location.timezone}`;
  document.getElementById('provider').value = data.isp;
}

// Fetch and display user's own IP location on page load
window.onload = async () => {
  const ipDetails = await fetchIPDetails(); // Empty means user's own IP
  updateMapAndDetails(ipDetails);
};

// Handle search for specific IP or domain
document.querySelector('.search-btn').addEventListener('click', async () => {
  const searchInput = document.querySelector('.search-input').value;
  const ipDetails = await fetchIPDetails(searchInput);
  updateMapAndDetails(ipDetails);
});
