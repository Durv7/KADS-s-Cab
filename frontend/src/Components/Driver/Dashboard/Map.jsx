import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup,Polyline } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import markerImg from '../../../assets/sourceDestination.png'
import axios from 'axios';
import defaultMarkerImg from '../../../assets/defaultMarker.png'
export default function Map({ socket, handleDriverPosition, rideDetails }) {
  const [driverLocation, setDriverLocation] = useState(null);
  const lastEmitTimeRef = useRef(0);
  const [route, setRoute] = useState([]);

  const defaultMarker=L.icon({
    iconUrl:defaultMarkerImg,
    iconSize:[45,45],
    iconAnchor:[20,40],
    popupAnchor:[0,-40]
})

  const markerIcon=L.icon({
    iconUrl:markerImg,
    iconSize:[45,45],
    iconAnchor:[20,40],
    popupAnchor:[0,-40]
})

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        let { latitude, longitude } = pos.coords;

        setDriverLocation({ lat: latitude, lng: longitude });
      }, (err) => {
        console.log(err)
      }, {
        enableHighAccuracy: true,
      })
    }
  })

  useEffect(() => {
    const throttleInterval = 5000;

    const sendLocation = () => {

      const currentTime = Date.now();

      if (currentTime - lastEmitTimeRef.current > throttleInterval) {
        if (driverLocation) {
          socket.emit("driverLocation", driverLocation);
          handleDriverPosition(driverLocation);
          console.log("Location sent:", driverLocation); 4

          lastEmitTimeRef.current = currentTime;
        }
      }

    }

    sendLocation();

  }, [driverLocation])



  const getRoute = async () => {
    if (rideDetails) {
      let Mapboxtoken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      const directionsURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${driverLocation.lng},${driverLocation.lat};${rideDetails.sourceCords[0]},${rideDetails.sourceCords[1]}?geometries=geojson&access_token=${Mapboxtoken}`;

      try {
        const response = await axios.get(directionsURL);
        const data = response.data.routes[0].geometry.coordinates;
        // Convert GeoJSON coordinates (lng, lat) to Leaflet format (lat, lng)
        const leafletRoute = data.map(coord => [coord[1], coord[0]]);
        setRoute(leafletRoute);
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    }
  }

  useEffect(()=>{
    getRoute();
  },[driverLocation]);




  return (
    <div className="bg-yellow-500 rounded-lg p-4 shadow-md h-[400px] lg:h-[600px]">
      <MapContainer center={driverLocation || [16.7050, 74.2433]} zoom={13} className="w-full h-full rounded-lg z-20">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={driverLocation || [16.7050, 74.2433]} icon={defaultMarker}>
          <Popup>Your Location</Popup>
        </Marker>

        {rideDetails && rideDetails.customerLocation &&
          <Marker position={rideDetails.customerLocation} icon={defaultMarker}>
            <Popup>
              Your Customer
            </Popup>
          </Marker>
        }
        {rideDetails &&
          rideDetails.sourceCords &&
          <Marker position={rideDetails.sourceCords} icon={markerIcon}>
            <Popup>
              Pickup Location
            </Popup>
          </Marker>

        }

        {rideDetails && driverLocation && rideDetails.sourceCords && route.length > 0 && <Polyline positions={route} color="#374151" />}
      </MapContainer>
    </div>
  );
}
