import L from 'leaflet';
import markerImg from './src/assets/defaultMarker.png'

const defaultMarker=L.icon({
    iconUrl:markerImg,
    iconSize:[45,45],
    iconAnchor:[20,40],
    popupAnchor:[0,-40]
})


let server = import.meta.env.VITE_BACKEND_URL

export {server,defaultMarker};