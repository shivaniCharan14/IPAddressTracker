"use-strict";
const inputVal = document.querySelector(".input");
const submitBtn = document.querySelector(".submit");
const addressUnit = document.querySelectorAll(".address-unit");
let map = L.map("map", {
  zoomControl: true,
}).setView([51.505, -0.09], 13);
let marker;
let tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,Coded by Shivani Charan with ❤',
});
tiles.addTo(map);

const customIcon = L.icon({
  iconUrl: "/assets/design/images/icon-location.svg",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const key_1 = "at_A7KsVbR91hpEdiyv5mseXn9DxA79h";
async function getLocation(e) {
  try {
    e.preventDefault();
    const ipAddress = inputVal.value.trim();
    if (ipAddress === "") {
      alert("Please enter an IP address.");
      return;
    }

    console.log(ipAddress);
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${key_1}&ipAddress=${ipAddress}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    if (data.code === 422) {
      alert(data.messages);
    }
    console.log(data);
    const isp = data.isp;
    const ip = data.ip;
    const { city, country, region, timezone } = data.location;
    if (addressUnit.length > 0) {
      addressUnit[0].textContent = ` ${ip}`;
      addressUnit[1].textContent = `${city}, ${region}, ${country}`;
      addressUnit[2].textContent = ` ${timezone}`;
      addressUnit[3].textContent = ` ${isp}`;
    }

    inputVal.value = "";
    const { lat, lng } = data?.location;
    map.flyTo([lat, lng], 13);
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng], { icon: customIcon });
    marker.addTo(map);
    marker.on("mouseout", () => {
      marker.bindPopup(`<h3>${city},${region},${region}</h3>`).openPopup();
    });
  } catch (error) {
    console.error(error);
    alert("Failed to fetch location data.");
  }
}

submitBtn.addEventListener("click", getLocation);
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getLocation(e);
  }
});
