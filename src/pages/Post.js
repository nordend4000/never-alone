import React, {useRef, useEffect, useState} from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom'
import NavbarConnected from '../components/NavbarConnected'
import Footer from '../components/Footer'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { MdLocalPostOffice } from 'react-icons/md'
import { v4 as uuidV4 } from 'uuid'
import { db } from '../Firebase'
import SelectCountry from '../components/SelectCountry'
import ACTIVITIES from '../ressources/activities.js'
import Geocode from "react-geocode"
import useResize from '../contexts/useResize'


function Post() {
	const { currentUser } = useAuth()
	const descriptionRef = useRef()
	const startRef = useRef()
	const spotRef = useRef()
	const history = useHistory()
	const [dataUser, setDataUser] = useState(null)
	const [readyUser, setReadyUser] = useState(false)
	const [countrySelected, setCountrySelected] = useState("")
	const [regionSelected, setRegionSelected] = useState("")
	const [activitySelected, setActivitySelected] = useState("")
	const [carPool, setCarPool] = useState(false)
	const [vehicule, setVehicule] = useState(false)
	const [publicTransport, setPublicTransport] = useState(false)
	const [startDate, setStartDate] = useState(new Date())
	const [lattitude, setLattitude] = useState("")
	const [longitude, setLongitude] = useState("")
	const [readyPost, setReadyPost] = useState(false)
	const [errorForm, setErrorForm] = useState(false)
	const [errorGeo, setErrorGeo] = useState(false)
	const [updateGeo, setUpdateGeo] = useState(0)
	const [wait, setWait] = useState(true)
	const email = currentUser.email
	const resize = useResize()
	let large = resize.large
	let medium = resize.medium

	const dayConverted = new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(startDate)
	const monthConverted = new Intl.DateTimeFormat('en-US', { month: 'long'}).format(startDate)

	useEffect(() => {
		const fetchDataUser = () => {
			try {
				db.collection('users').doc(email)
				.onSnapshot((snapshot) => {
					setDataUser(snapshot.data())
					setReadyUser(true)
				})
			} catch (error) {
				console.log(error)
			}
		};
		fetchDataUser()
	}, [email])

	function handleSelectActivity(e) {
		e.preventDefault()
		setActivitySelected(e.target.value)
	}

	function callGeoCode(){
		let address
		if(updateGeo > 0){
			address = spotRef.current.value + " " + regionSelected + " " + countrySelected
			console.log(address)
			Geocode.setApiKey(`${process.env.REACT_APP_GEOCODE_API_KEY}`)
			// Get latitude & longitude from address.
			Geocode.fromAddress(address).then(	
				(response) => {
				const { lat, lng } = response.results[0].geometry.location
				console.log(lat, lng)
				setLattitude(lat)
				setLongitude(lng)
				setWait(false)
				setErrorGeo("")
				setReadyPost(true)
				},
				(error) => {
				console.error("geocode", error)
				})
	}else{setErrorGeo("Please enter a spot to go ")}
}

function updateGeoCode(){
	setUpdateGeo(prev => prev + 1 )
}

useEffect(() => {
	callGeoCode()
	//eslint-disable-next-line
}, [countrySelected, regionSelected, updateGeo])

	function handleSubmitTrip(e) {
		e.preventDefault()
		let urlPhotoUser = ""
		if(dataUser.photoUrl !== ""){
			urlPhotoUser = dataUser.photoUrl 
		} 
		if(activitySelected !== "" && countrySelected !== "" && spotRef.current.value !== ""){

		const newTrip = {
			activity: activitySelected,
			description: descriptionRef.current.value,
			start: startRef.current.value,
			spot: spotRef.current.value,
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
		let feedback, isError
		db.collection('newTrip').add(newTrip)
		.then(() => {
			console.log("New Post done")
			isError = "success"
			feedback = "Your new trip has been succesfully posted !"
			history.push("/trips", { feedback: `${feedback}`, variant: `${isError}` })
		})
		.catch((error) => {
			// The document probably doesn't exist.
			console.error("Error updating profile: ", error)
			isError = "danger"
			feedback = "Ouups something wrong happened, Try again to post your new trip... "
			history.push("/trips", { feedback: `${feedback}`, variant: `${isError}` })
		});
	}else{setErrorForm("Please select an activity ")}
	}

	return (
		<>
			<NavbarConnected />
			<div className="background-topo">
				<div className="container">
					{readyUser &&
					<Card className={ !medium && !large ? "mx-auto my-5" : "w-75 mx-auto my-5"} 
					style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}>
						<Card.Body >
							<h3 className={!medium && !large 
							? "text-center display-5 main-typo-light-blue mb-5" 
							: "text-center display-4 main-typo-light-blue mb-5"
							}>
								Post a New Trip
							</h3>
							<Form onSubmit={handleSubmitTrip}>
								<Form.Group id="activity">
										<Form.Label className="light-blue"><h5>Activity</h5></Form.Label>
										<Form.Control as="select" value={activitySelected} 
										onChange={e => handleSelectActivity(e)}>
											<option default>Select an activity...</option>
											{ACTIVITIES.map(activity =>(
												<option key={uuidV4()} value={activity}>
													{activity.replace(/([a-z])([A-Z])/g, '$1 $2')}
												</option>
											))}
										</Form.Control>
									</Form.Group>
								<Form.Group id="date">
									<Form.Label className="light-blue"><h5>Trip Date</h5></Form.Label>
									<div>
										<DatePicker className="mb-3 " selected={startDate} 
										onChange={date => setStartDate(date)} >
											<div className="mb-3 mt-4 ml-3" style={{ color: "blue"}}>
												Don't forget to check the weather!
											</div>
										</DatePicker>
									</div>
								</Form.Group>
								<Form.Group id="userName">
									<Form.Label className="light-blue"><h5>Description</h5></Form.Label>
									<Form.Control as="textarea" ref={descriptionRef} 
									placeholder="Enter a description of your plan..."/>
								</Form.Group>
								<Form.Group id="spot">
								<Form.Label className="light-blue"><h5>Spot to go</h5></Form.Label>
								<Form.Control type="text" ref={spotRef} placeholder="Enter the spot / area you'd like to visit..." 
								onBlur={() => updateGeoCode()}/>
								</Form.Group>
								<SelectCountry 
									regionSelected={regionSelected} 
									countrySelected={countrySelected} 
									setCountrySelected={setCountrySelected} 
									setRegionSelected={setRegionSelected} 
									readyCountrySearch= {false}
									readyCountry
								/>
								<Form.Group id="start">
									<Form.Label className="light-blue"><h5>Starting point</h5></Form.Label>
									<Form.Control type="text" ref={startRef} 
									placeholder="Enter the place where you'll start..."/>
								</Form.Group>
								<Form.Group className="mt-4 light-blue" id="transport">
								<Form.Label className="light-blue mr-5"><h5>Commuting</h5></Form.Label>
									<Form.Check 
											type="checkbox"
											inline
											id="publicTransport"
											label="Public Transport"
											checked={publicTransport}
											onChange={e => setPublicTransport(e.target.checked)}
									/>
									<Form.Check 
											type="checkbox"
											inline
											id="carpooling"
											label="Carpooling"
											checked={carPool}
											onChange={e => setCarPool(e.target.checked)}
									/>
									<Form.Check 
											type="checkbox"
											inline
											id="vehicule"
											label="Vehicule"
											checked={vehicule}
											onChange={e => setVehicule(e.target.checked)}
									/>
								</Form.Group>
								{errorForm && <Alert className="w-100 mx-auto mt-3" variant="danger">
									{errorForm}
								</Alert>}
								{(wait && countrySelected !== "" && errorGeo) && <Alert className="w-100 mx-auto mt-3" variant="danger">
									{errorGeo}
								</Alert>}
								<div className="w-100 d-flex justify-content-center">
								{readyPost ?
									<Button variant="info" type="submit"
									className={ !medium && !large ? "w-75 my-3 mt-4" : "w-50 my-3 mt-4"}>
										<MdLocalPostOffice className="mr-3" style={{fontSize: "1.2em"}}/> 
										Post New Trip
									</Button>
									:
									<Button variant="info" type="submit" disabled
									className={ !medium && !large ? "w-75 my-3 mt-4" : "w-50 my-3 mt-4"}>
										<MdLocalPostOffice className="mr-3" style={{fontSize: "1.2em"}}/> 
										Post New Trip
									</Button>
								}
								</div>
							</Form>
						</Card.Body>
					</Card>
					}
				</div>
			</div>
			<Footer/>	
		</>
	)
}

export default Post

