export default function princing(distance,duration){
    let perKmRate=10;
    let baseRate=20;
    let perMinRate=1;

    // console.log(distanceInKm,durationInMin);

    let totDistRate = perKmRate*distance;

    let totDurationRate = perMinRate*duration;

    return (totDistRate+totDurationRate+baseRate).toFixed(2);
}



