import { useState, useEffect, useRef } from "react";
import { MapContainer, Popup, Marker, TileLayer, Polyline } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import axios from "axios";
import calculateDistanceAndTime from '../../../utils/DistanceTimeCal.js';
import princing from '../../../utils/PriceCal.js';
import InfoPanel from "./InfoPanel.jsx";
import markerImg from "../../../assets/sourceDestination.png"
import driversImg from '../../../assets/carIcon.png'
import L from 'leaflet';
export default function InitialMap({ source, destination,socket,customerLocation,handlePricing,isRideAccepted,driverLocation,rideCompletion }) {
    
    const mapRef = useRef(null); useRef
    const [route, setRoute] = useState([]);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [cost, setCost] = useState(null);
    const [drivers, setDrivers] = useState([]);
    

    const kolhapurBounds = [
        [16.5813, 73.7559], // Southwest corner
        [16.9737, 74.4887]  // Northeast corner
    ];

    const carIcon=L.icon({
        iconUrl:driversImg,
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

    const getRouteStoD = async () => {
        if (destination != null) {
            let Mapboxtoken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
            const directionsURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${source.lng},${source.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${Mapboxtoken}`;

            try {
                const response = await axios.get(directionsURL);
                const data = response.data.routes[0].geometry.coordinates;
                const { distanceInKm, durationInMin } = calculateDistanceAndTime(response.data.routes[0]);
                setDistance(distanceInKm);
                setDuration(durationInMin);
                let pricing = princing(distanceInKm, durationInMin);
                handlePricing(pricing);
                setCost(pricing);
                // Convert GeoJSON coordinates (lng, lat) to Leaflet format (lat, lng)
                const leafletRoute = data.map(coord => [coord[1], coord[0]]);
                setRoute(leafletRoute);
            } catch (error) {
                console.error('Error fetching route:', error);
            }
        }
    }


    useEffect(() => {
        getRouteStoD();
    }, [source, destination])

    const getRouteDtoC=async()=>{
        if (destination != null) {
            let Mapboxtoken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
            const directionsURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${driverLocation.lng},${driverLocation.lat};${source.lng},${source.lat}?geometries=geojson&access_token=${Mapboxtoken}`;

            try {
                const response = await axios.get(directionsURL);
                const data = response.data.routes[0].geometry.coordinates;
                const leafletRoute = data.map(coord => [coord[1], coord[0]]);
                setRoute(leafletRoute);
            } catch (error) {
                console.error('Error fetching route:', error);
            }
        }
    }

    useEffect(()=>{
        getRouteDtoC();
    },[driverLocation,source]);

    useEffect(() => {
        if (socket) {
            socket.on("avaliableDrivers", (updatedDrivers) => {
                console.log("Available Drivers:", updatedDrivers);
                setDrivers(updatedDrivers);
            });

        }

        return () => {
            socket.off("avaliableDrivers");
        }
    })



    return (
        <>
            <MapContainer center={customerLocation.lat != null ? [customerLocation.lat, customerLocation.lng] : [16.7050, 74.2433]} zoom={10}
                className="h-full w-full rounded-lg shadow-lg"
                bounds={kolhapurBounds}
                maxBounds={kolhapurBounds}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={true}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {customerLocation.lat != null &&
                    <Marker position={customerLocation}>
                        <Popup>You Are Here</Popup>
                    </Marker>
                }
                {
                    source &&
                    <Marker position={source} icon={markerIcon}>
                        <Popup>Pickup</Popup>
                    </Marker>
                }
                {
                    destination &&
                    <Marker position={destination} icon={markerIcon}>
                        <Popup>Drop Off</Popup>
                    </Marker>
                }
                {source && destination && route.length > 0 && <Polyline positions={route} color="#374151" />}
                {source && destination&& distance != null && duration != null && <InfoPanel distance={distance} duration={duration} cost={cost} />}

                {!rideCompletion && isRideAccepted ? 
                    <Marker
                        position={driverLocation}
                    >
                        <Popup>Your Driver</Popup>
                    </Marker>: drivers.map((driver, index) => (
                    <Marker
                        key={index}
                        position={[driver.location.coordinates[1], driver.location.coordinates[0]]}
                        icon={carIcon}
                    >
                        <Popup>Avaliable Driver</Popup>
                    </Marker>
                ))} 
            </MapContainer>
        </>
    )
}