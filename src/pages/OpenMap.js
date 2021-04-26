import React, {useState, useEffect} from 'react'
import { Link} from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; 
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility'
import "leaflet/dist/leaflet.css"
import { GoLocation } from "react-icons/go"
import { db } from '../Firebase'
import Footer from '../components/Footer'
import NavbarConnected from '../components/NavbarConnected'
import { SiOpenstreetmap } from "react-icons/si"
import { v4 as uuidV4 } from 'uuid'


function YourLocation() {
	const [position, setPosition] = useState(null)
	const map = useMapEvents({
	click() {
		map.locate()
	},
	locationfound(e) {
		setPosition(e.latlng)
		map.flyTo(e.latlng, map.getZoom())
	},
	})
	return position === null ? null : (
		<Marker position={position}>
		<Popup><h6 className="text-info main-typo">You are here</h6></Popup>
		</Marker>
	)
}

function useFetchTrips(sortBy, reset) {
	const [newTrip, setNewTrip] = useState([])
	useEffect(() => {
		const unsubscribe = db.collection("newTrip")
		.onSnapshot((snapshot) => {
			const trips = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}))
			setNewTrip(trips)
		})
		return () => unsubscribe()
	}, [sortBy, reset])
	return newTrip
}

function OpenMap() {

	const dataTrips = useFetchTrips()
	const center = [43.439482, 11.910221]
	var myIcon = L.icon({
		iconUrl: process.env.PUBLIC_URL + '/images/location.png',
		iconSize: [30, 38],
		iconAnchor: [15, 38],
		popupAnchor: [0, -40],
	});

	return(
		<>
		<NavbarConnected/>
		<div className="bgtrans" style={{height: "80%"}}>	
			<h4 className="main-typo ml-2 text-info text-left pt-1">
			<SiOpenstreetmap className="ml-1 mr-4 mb-1"/>Browse Map :</h4>
				<p className="light-blue text-left pl-3 pb-1">
					Click on the map to find your position  -  Click on the markers to get more info
				</p>
		</div>
		<div className="mt-n3">
			<MapContainer center={center} zoom={5} scrollWheelZoom={false} 
			style={{height: "80vh"}} >
			
			<TileLayer
				attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
				url={process.env.REACT_APP_OPEN_MAP_URL_KEY}
			/>
			{dataTrips.map(trip =>(
				<Marker position={[`${trip.lat}`, `${trip.lon}`]} icon={myIcon} key={uuidV4()}>
					<Popup>
					<h5 className="text-info main-typo text-capitalize">
						{trip.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}
					</h5>
					<h6 className=""><GoLocation className="text-info mr-2"/>
						<b>{trip.spot}</b>
					</h6>
					<div>
						<small className="light-blue">{trip.userName}</small>
					</div>
					<small className="light-blue">{trip.date.stringDate}</small>
					<Link className="link-comment ml-2 mt-n2" to={`/post?${trip.id}`}>Open</Link>
					</Popup>
				</Marker>
			))
			}
			<YourLocation />
			</MapContainer>
		</div>
		<Footer/>
		</>
	)

}

export default OpenMap