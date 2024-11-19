export default function calculateDistanceAndTime (route){
  
    // Extract the first route (assuming multiple routes are returned, pick the first)
  
  
    // Total distance in meters from the route
    const distanceInMeters = route.distance;
  
    // Convert distance to kilometers
    const distanceInKm = distanceInMeters / 1000;
  
    // Total duration in seconds from the route
    const durationInSeconds = route.duration;
  
    // Convert duration to hours
    const durationInHours = durationInSeconds / 60;
  
    return {
      distanceInKm: distanceInKm.toFixed(2),  // Rounded to 2 decimal places
      durationInMin: durationInHours.toFixed(2)  // Rounded to 2 decimal places
    };
  };
  