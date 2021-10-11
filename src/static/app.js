(() => {
  "use-static";

  const config = {
    MAPBOX_API_KEY:
      "pk.eyJ1IjoiaW10YXVzZWVmMDYzOSIsImEiOiJja3Q5MGp2ZWUxN2g0MnFyd3RybXlyYTg2In0.Q4V7FQm-Xtkn9spI4NaKDw",
  };

  const map = L.map("__map").setView(INITIAL_POSE, 7);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution: "",
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: config.MAPBOX_API_KEY,
    }
  ).addTo(map);

  const satelliteIcon = L.icon({
    iconUrl: SATELLITE_ICON,

    iconSize: [50, 50], // size of the icon
    iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
  });

  let satelliteLayers = [];
  let satellitePathLayers = [];
  let satellitePath = [];
  const source = new EventSource("/api/pose");
  source.onmessage = (message) => {
    const data = JSON.parse(message.data);
    satellitePath.push(new L.LatLng(data.latitude, data.longitude));

    for (let layer of satelliteLayers) map.removeLayer(layer);
    for (let layer of satellitePathLayers) map.removeLayer(layer);

    const satellite = L.marker([data.latitude, data.longitude], {
      icon: satelliteIcon,
    }).addTo(map);

    const path = new L.Polyline(satellitePath, {
      weight: 3,
      color: "#f76545",
      opacity: 1,
      smoothFactor: 1,
    }).addTo(map);

    satelliteLayers.push(satellite);
    satellitePathLayers.push(satellite);
  };
})();
