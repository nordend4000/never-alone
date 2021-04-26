import React, { useState, useEffect } from 'react'
import NavbarConnected from './NavbarConnected'
import Footer from './Footer'
import { useAuth } from '../contexts/AuthContext'
import { Card, Button, Form, Row, Alert} from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Link, useHistory } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { db } from '../Firebase'
import ACTIVITIES from '../ressources/activities.js'
import Geocode from 'react-geocode'
import LIST_COUNTRY_STATE from '../ressources/countries.json'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoArrowBack } from "react-icons/io5"
import { FiEdit } from "react-icons/fi"
import { GiCompass } from "react-icons/gi"
import { HiOutlineSaveAs } from "react-icons/hi"
import useResize from '../contexts/useResize'


// Fetch Data from database
function useFetchTrips() {
	const [listTrips, setListTrips] = useState([])

	useEffect(() => {
	const unsubscribe = db.collection("newTrip")
	.onSnapshot((snapshot) => {
		const trips = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}))
		setListTrips(trips)
	})
	return () => unsubscribe()
	}, [])
return listTrips
}


function EditTrip(props) {


	const tripId = props.history.location.state.tripId
	const { currentUser } = useAuth()
	const history = useHistory()
	const [dataUser, setDataUser] = useState("")
	const [dataTrip, setDataTrip] = useState("")
	const [readyEdit, setReadyEdit] = useState(false)
	const [readyCompute, setReadyCompute] = useState(false)
	const listTrips = useFetchTrips()
	const [temp, setTemp] = useState();
	const [countrySelected, setCountrySelected] = useState("")
	const [regionSelected, setRegionSelected] = useState("")
	const [activitySelected, setActivitySelected] = useState("")
	const [description, setDescription] = useState("")
	const [start, setStart] = useState("")
	const [spot, setSpot] = useState("")
	const [carPool, setCarPool] = useState(false)
	const [vehicule, setVehicule] = useState(false)
	const [publicTransport, setPublicTransport] = useState(false)
	const [startDate, setStartDate] = useState(new Date())
	const [lattitude, setLattitude] = useState("")
	const [longitude, setLongitude] = useState("")
	const [action, setAction] = useState(props.history.location.state.action)
	const resize = useResize()
	let medium = resize.medium
	const email = currentUser.email
	const dayConverted = new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(startDate)
	const monthConverted = new Intl.DateTimeFormat('en-US', { month: 'long'}).format(startDate)

	if(!readyCompute){
		if(listTrips !== "" && typeof(listTrips) != "undefined" && listTrips.length > 0){
			const filteredList = listTrips.filter((trip => trip.id === tripId))
				if(filteredList.length === 1){
				setReadyCompute(true)
				handleFilteredList(filteredList[0])
				}
		}
	}
		
	function handleFilteredList(trip){
		setReadyCompute(true)
		setDataTrip(trip);	
		setActivitySelected(trip.activity)
		setDescription(trip.description)
		setStart(trip.start)
		setSpot(trip.spot)
		setCarPool(trip.carPool)
		setVehicule(trip.vehicule)
		setPublicTransport(trip.publicTransport)
		// format date
		let month = trip.date.month
		let num = trip.date.num
		let year = trip.date.year
		let text = month + " " + num + " " + year		
		let event = new Date(text) 
		setStartDate(event)
		// handle select country / region
		const tabCountry = LIST_COUNTRY_STATE.filter((country => country.name === trip.country))
		setTemp(tabCountry[0].states)
		setCountrySelected(trip.country)
		setRegionSelected(trip.area)
		setReadyEdit(true)
		}


useEffect(() => {
		const fetchDataUser = () => {
			try {
				db.collection('users').doc(email)
				.onSnapshot((snapshot) => {
					console.log("snaphot user for comment ====> ",snapshot.data())
					setDataUser(snapshot.data());
				})
			} catch (error) {
				console.log(error);
			}
		};
		fetchDataUser();
	}, [email])


	function handleSelectCountry(e){
		e.preventDefault()
		const tabCountry = LIST_COUNTRY_STATE.filter((country => country.name === e.target.value))
		setTemp(tabCountry[0].states)
		setCountrySelected(e.target.value)
	}

	function handleSelectState(e){
		e.preventDefault()
		setRegionSelected(e.target.value)
	}

	function deleteTrip(){
		let feedback, variant
		db.collection("newTrip").doc(tripId).delete().then(() => {
			console.error("Your trip has been successfully deleted !")
			setReadyEdit(false)
			variant = "success"
			feedback = "Your trip has been successfully deleted !"
			history.push("/trips", { feedback: `${feedback}`, variant: `${variant}` })
		}).catch((error) => {
			setReadyEdit(false)
			console.error("Error removing document: ", error)
			variant = "danger"
			feedback = "Ouups something wrong happened, Try again to delete your trip..."
			history.push("/trips", { feedback: `${feedback}`, variant: `${variant}` })
		});
	}

	function handleSubmitTrip(e) {

		e.preventDefault()
		if(readyEdit &&
			(countrySelected !== dataTrip.country 
				|| regionSelected !== dataTrip.area 
				|| spot !== dataTrip.spot
			)){
				let address = spot + " " + regionSelected + " " + countrySelected
				Geocode.setApiKey(process.env.GEOCODE_API_KEY);
				// Get latitude & longitude from address.
				Geocode.fromAddress(address).then(
					(response) => {
					const { lat, lng } = response.results[0].geometry.location;
					console.log(lat, lng);
					setLattitude(lat)
					setLongitude(lng)
					},
					(error) => {
					console.error(error);
					})
		}

		let urlPhotoUser = ""
		if(dataUser.photoUrl !== ""){
			urlPhotoUser = dataUser.photoUrl 
		} 
		const newTrip = {
			activity: activitySelected,
			description: description,
			start: start,
			spot: spot,
			country: countrySelected,
			area: regionSelected,
			carPool: carPool,
			vehicule: vehicule,
			publicTransport: publicTransport,
			photoUrl: urlPhotoUser,
			email: dataUser.email,
			userName: dataUser.userName,
			userCountry: dataUser.country,
			userArea: dataUser.area,
			userCity: dataUser.city,
			phone: dataUser.phone,
			level: dataUser.activities[activitySelected],
			userId: dataUser.userId,
			timePost: Date.now(),
			timeTrip: startDate.getTime(),
			lat: lattitude,
			lon: longitude,
			date: {
				day: dayConverted,
				num: startDate.getDate(),
				month: monthConverted,
				year: startDate.getFullYear(),
				stringDate: startDate.toDateString()
			}
		}
		let feedback, variant
		db.collection('newTrip').doc(tripId).update(newTrip)
		.then(() => {
			variant = "success"
			feedback = "Your new trip has been succesfully updated !"
			history.push("/trips", { feedback: `${feedback}`, variant: `${variant}` })
		})
		.catch((error) => {
			// The document probably doesn't exist.
			console.error("Error updating profile: ", error)
			variant = "danger"
			feedback = "Ouups something wrong happened, Try again to update your trip..."
			history.push("/trips", { feedback: `${feedback}`, variant: `${variant}` })
		});
	}

	return (
		<>
		<NavbarConnected/>
		<div className="background-topo2">
			<div className="container">
			{(readyEdit && action === "delete") && 
			<Card className={medium ? "mx-5 my-5 w-75" : "w-100 my-5" } style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}>
				<Row className="d-flex justify-content-center">
					<h3 className="text-center mx-5 mt-3 mb-5 main-typo-light-blue">Delete My Trip</h3>			
				</Row>
				<h5 className="text-info ml-3 text-capitalize mb-1">
					<GiCompass className="mx-2 mb-1"/>
					<b>{dataTrip.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}</b> - <small>{dataTrip.spot}</small>
				</h5>
				<p className="light-blue ml-4">
					<small className="ml-1"> Published on <b>{dataTrip.date.stringDate}</b></small>
				</p>
				<Button variant="info" className={medium ? "w-50 text-center my-3 ml-5" : "w-75 text-center my-3 mx-auto" } onClick={() => setAction("edit")}>
				<FiEdit className="mr-2" style={{fontSize: "1.2em"}}
				/> 
					Edit My Trip
				</Button>
				<Row className="d-flex justify-content-end ">
					<Alert variant="danger" onClick={() => deleteTrip(tripId)} className="mr-5 delete">
						<AiOutlineDelete className="mx-2 mb-1"/>Delete
					</Alert>
				</Row>
				<Button variant="info" className={medium ? "w-25 text-center mt-3 ml-3 mb-3" : "w-50 text-center mt-3 ml-3 mb-3"}>
					<Link className="text-light" to="/profile">
						<IoArrowBack className="mr-2" style={{fontSize: "1.2em"}}/> 
						My Profile
					</Link>
				</Button>
			</Card>
			}
			
			{(readyEdit && action === "edit") &&
			<Card className={medium ? "mx-5 my-5 w-75" : "w-100 my-5" }  style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}>
					<Card.Body >
						<Row className="d-flex justify-content-center">
							<h3 className="text-center mb-5 mx-5 main-typo-light-blue">Edit My Trip</h3>			
						</Row>
						<h5 className="text-info ml-1 text-capitalize mb-1">
							<GiCompass className="mx-2 mb-1"/>
							<b>{dataTrip.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}</b> - <small>{dataTrip.spot}</small>
						</h5>
						<p className="light-blue ml-2">
							<small className="ml-1"> Published on <b>{dataTrip.date.stringDate}</b></small>
						</p>
						<Row className="d-flex justify-content-end">
							<Button variant="info" className={medium ? "w-25 text-center my-3 ml-5" : "w-50 text-center my-3 mx-auto mb-5"} onClick={() => setAction("delete")}>
								<AiOutlineDelete className="mr-2" style={{fontSize: "1.2em"}}/> 
								Delete
							</Button>
						</Row>
						<Form onSubmit={handleSubmitTrip}>
							<Form.Group id="date">
								<Form.Label className="light-blue"><h5>Trip Date</h5></Form.Label>
								<div>
									<DatePicker className="mb-3" selected={startDate}
									onChange={date => setStartDate(date)} >
										<div className="mb-3 mt-4 ml-3" style={{ color: "blue"}}>Don't forget to check the weather!</div>
									</DatePicker>
								</div>
							</Form.Group>
							<Form.Group id="activity">
								<Form.Label className="light-blue"><h5>Activity</h5></Form.Label>
								<Form.Control className="text-capitalize" as="select" value={activitySelected} 
								onChange={e => setActivitySelected(e.target.value)}>
									<option default>Select an activity...</option>
									{ACTIVITIES.map(activity =>(
										<option key={uuidV4()} value={activity}>{activity.replace(/([a-z])([A-Z])/g, '$1 $2')}</option>
									))}
								</Form.Control>
							</Form.Group>
							<Form.Group id="userName">
								<Form.Label className="light-blue"><h5>Description</h5></Form.Label>
								<Form.Control as="textarea" defaultValue={description} placeholder="Enter a description of your plan..."
									onChange={e => setDescription(e.target.value)}
									
								/>
							</Form.Group>
							<Form.Group id ="country">
								<Form.Label className="light-blue"><h5>Country</h5></Form.Label>
								<Form.Control as="select" value={countrySelected} onChange={e => handleSelectCountry(e)}>
									<option default>Select a Country...</option>
									{LIST_COUNTRY_STATE.map(country =>(
										<option key={uuidV4()} value={country.name}>{country.name}</option>
									))
									}
								</Form.Control>
								{typeof(temp) != "undefined" &&
								<>
								<Form.Label className="light-blue mt-2"><h5>State / Region</h5></Form.Label>
								<Form.Control as="select" value={regionSelected}  onChange={e => handleSelectState(e)}>
									<option default>Select a Region / State...</option>
									{temp.map(state =>(
										<option key={uuidV4()} value={state.name}>{state.name}</option>
									))
									}
								</Form.Control>
								</>
								}
							</Form.Group>
							<Form.Group id="start">
								<Form.Label className="light-blue"><h5>Starting point</h5></Form.Label>
								<Form.Control type="text" defaultValue={start} placeholder="Enter the place where you'll start..."
									onChange={e => setStart(e.target.value)}
								/>
							</Form.Group>
							<Form.Group id="spot">
								<Form.Label className="light-blue"><h5>Spot to go</h5></Form.Label>
								<Form.Control type="text" defaultValue={spot} placeholder="Enter the spot / area you'd like to visit..."
									onChange={e => setSpot(e.target.value)}
								/>
							</Form.Group>
							<Form.Group className="mt-4 light-blue" id="transport">
							<Form.Label className="light-blue mr-5"><h5>Commuting</h5></Form.Label>
								<Form.Check 
										type="checkbox"
										inline
										id="publicTransport"
										label="Public Transport"
										defaultChecked={publicTransport}
										onChange={e => setPublicTransport(e.target.checked)}
								/>
								<Form.Check 
										type="checkbox"
										inline
										id="carpooling"
										label="Carpooling"
										defaultChecked={carPool}
										onChange={e => setCarPool(e.target.checked)}
								/>
								<Form.Check 
										type="checkbox"
										inline
										id="vehicule"
										label="Vehicule"
										defaultChecked={vehicule}
										onChange={e => setVehicule(e.target.checked)}
								/>
							</Form.Group>
							<div className="w-100 d-flex justify-content-center">
								<Button variant="info" className={medium ? "w-50 text-center my-3 ml-5" : "w-75 text-center my-3 mx-auto mb-5"} type="submit">
									<HiOutlineSaveAs className="mr-3" style={{fontSize: "1.2em"}}/> 
									Save Changes
								</Button>
							</div>
						</Form>
						<Button variant="info" className={medium ? "w-25 text-center my-3 ml-5" : "w-75 text-center my-3 mx-auto mb-5"}>
							<Link className="text-light" to="/profile">
								<IoArrowBack className="mr-2" style={{fontSize: "1.2em"}}/> 
								My Profile
							</Link>
						</Button>
					</Card.Body>
			</Card>
			}
			</div>
		</div>	
		<Footer/>
		</>
	)
}

export default EditTrip