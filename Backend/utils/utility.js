
function calculateDistance(lat1, lon1,driverLocation) {
  
  if (
    typeof lat1 !== "number" ||
    typeof lon1 !== "number" ||
    typeof driverLocation[1] !== "number" ||
    typeof driverLocation[0] !== "number"
  ){
    console.log("invalid location");
    return;
  }
    let lat2=driverLocation[1];
    let lon2=driverLocation[0];
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance =R*c;
    console.log(distance);
    return distance; 
} 


module.exports={calculateDistance}