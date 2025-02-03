import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { toastErrorStyle, toastSuccessStyle } from "../../../utils/ToastStyle";
export default function SearchForm({ onSelectLocation, currentLocation, socket,cost,handleRideAcceptance,handleDriverLocation,handleRideCompletion }) {
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [sourceSuggestions, setSourceSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [isReqSent,setIsReqSent]=useState(false);
    const [sourceCords,setSourceCords]=useState(null);
    const [destiCords,setDestiCords]=useState(null);


    const handleSourceChange = (e) => {
        let value = e.target.value;
        setSource(value);

        if (value.length > 1) {
            fetchSuggestions(value, setSourceSuggestions, true);
        } else {
            setSourceSuggestions([]);
        }

    };
    const handleDestinationChange = (e) => {
        let value = e.target.value;
        setDestination(value);
        if (value.length > 1) {
            fetchSuggestions(value, setDestinationSuggestions, false);
        } else {
            setDestinationSuggestions([]);
        }
    };

    useEffect(()=>{
        const noDriversAvailable=(msg)=>{
            setIsReqSent(false);
            toast.error(msg, toastErrorStyle);
        }

        const driverAssigned=(data)=>{
            console.log(data);
            toast.error("You have assigned a driver", toastSuccessStyle);
        }

        const  rideAccepted=(data)=>{
            console.log(data);
            handleRideAcceptance(true);
            handleDriverLocation(data.driverLocation);
            toast.success("Your Request Accepted",toastSuccessStyle);
        }

        const rideDeclined=(data)=>{
            console.log(data);
            setIsReqSent(false);
            toast.error(data,toastErrorStyle);
        }

        const rideCompleted=(msg)=>{
            setIsReqSent(false);
            setSource("");
            onSelectLocation("source",null);
            onSelectLocation("destination",null)
            handleRideCompletion(true);
            setDestination("");
            toast.success(msg,toastSuccessStyle);
        }

        const driverLocationUpdate =(driverLocation)=>{
            handleDriverLocation(driverLocation);
        }

        socket.on("rideAccepted",rideAccepted)

        socket.on("noDriversAvailable",noDriversAvailable);
    
        socket.on("driverAssigned", driverAssigned);

        socket.on("rideDeclined",rideDeclined);

        socket.on("reachedDestination",rideCompleted);

        socket.on("driverLocationUpdate",driverLocationUpdate);

        return(()=>{
            socket.off("noDriversAvailable",noDriversAvailable);
            socket.off("driverAssigned",driverAssigned);
            socket.off("rideDeclined",rideDeclined);
            socket.off("rideAccepted",rideAccepted);
            socket.off("reachedDestination",rideCompleted);
            socket.off("driverLocationUpdate",driverLocationUpdate);
        })
    })





    const bookRide = async() => {
        console.log("Source:", source, "Destination:", destination);
        console.log(source.length);
        console.log(destination.length);

        
        if(source==="current location"){
            let Mapboxtoken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
            const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${currentLocation.lng},${currentLocation.lat}.json?access_token=${Mapboxtoken}`);

            let sourceText;
            
            if (response.data && response.data.features.length > 0) {
                // Return the first result, which is usually the most relevant
                sourceText=response.data.features[0].place_name;
              } else {
                console.error("No results found for the given coordinates.");
                sourceText="Unknown location";
              }

              if (socket && currentLocation && source && destination) {
                socket.emit("requestRide", {customerLocation:currentLocation,source:sourceText,destination,cost,sourceCords,destiCords});
                setIsReqSent(true);
    
            }
        }else{
            if (socket && currentLocation && source && destination) {
                socket.emit("requestRide", {customerLocation:currentLocation,source,destination,cost,sourceCords,destiCords});
                setIsReqSent(true);
    
            }
        }



    };

    const fetchSuggestions = async (query, setSuggestions, isIncludeCurrentLocation) => {
        try {
            const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
                {
                    params: {
                        access_token: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
                        autocomplete: true,
                        limit: 7,
                        bbox: [73.74, 16.32, 74.57, 17.18],
                    }
                });
            const places = response.data.features.map((feature) => ({
                place_name: feature.place_name,
                coords: feature.geometry.coordinates
            }));

            if (isIncludeCurrentLocation && currentLocation.lat && currentLocation.lng) {
                places.unshift({
                    place_name: 'current location',
                    coords: [currentLocation.lng, currentLocation.lat],
                    isCurrent: true
                })
            }

            setSuggestions(places);

        } catch (err) {
            console.log("Error In Fetching Suggestions:", err);
        }
    }

    const handleSelectLocation = (placeName, coords, setLocation, setSuggestions, type) => {
        setLocation(placeName);
        setSuggestions([]);
        if(type==="source"){
            setSourceCords(coords);
        }else if(type==="destination"){
            setDestiCords(coords);
        }
        onSelectLocation(type, coords);
    };

    if (currentLocation.lat == null) {
        return <div className="text-center p-4">Loading...</div>;
    }

    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Book Your Ride
            </h2>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                    Pickup Location
                </label>
                <input
                    type="text"
                    value={source}
                    onChange={handleSourceChange}
                    placeholder="Enter pickup location"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500"
                />

                {sourceSuggestions.length > 0 && (
                    <ul className="mt-2 bg-white border rounded shadow">
                        {sourceSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className={`p-2 hover:bg-gray-200 cursor-pointer ${suggestion.isCurrent ? 'text-blue-500 font-semibold' : ''}`}
                                onClick={() =>
                                    handleSelectLocation(
                                        suggestion.place_name,
                                        suggestion.coords,
                                        setSource,
                                        setSourceSuggestions,
                                        'source'
                                    )
                                }
                            >
                                {suggestion.place_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                    Drop-off Location
                </label>
                <input
                    type="text"
                    value={destination}
                    onChange={handleDestinationChange}
                    placeholder="Enter drop-off location"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500"
                />
                {destinationSuggestions.length > 0 && (
                    <ul className="mt-2 bg-white border rounded shadow">
                        {destinationSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() =>
                                    handleSelectLocation(
                                        suggestion.place_name,
                                        suggestion.coords,
                                        setDestination,
                                        setDestinationSuggestions,
                                        'destination'
                                    )
                                }
                            >
                                {suggestion.place_name}
                            </li>
                        ))}
                    </ul>
                )}

            </div>

            {
                source.length != 0 && destination.length != 0 && !isReqSent &&
                <button
                    onClick={bookRide}
                    className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-md shadow-lg transition-transform transform hover:bg-yellow-600 hover:scale-105"

                >
                    Book Ride
                </button>
            }

        </>
    )
}