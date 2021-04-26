import React, {useRef, useState} from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import SelectCountry from './SelectCountry'
import { db } from '../Firebase'
import { HiOutlineSaveAs } from "react-icons/hi"

function UpdateProfile(props) {

	const userNameRef = useRef("")
	const cityRef = useRef("")
	const phoneRef = useRef("")
	const bioRef = useRef("")
	const [countrySelected, setCountrySelected] = useState("")
	const [regionSelected, setRegionSelected] = useState("")
	const { currentUser } = useAuth()
	const [dbUser, setDbUser] = useState(props.data)
	const setCount = props.setCount
	const setError = props.setError
	const setMessage = props.setMessage
	const medium = props.medium
	const large = props.large

	function handleSubmitProfile(e){
	e.preventDefault()
	let profileUser
	if(!props.data.profileSet){
		let photoUrl = ""
		if(currentUser.photoURL != null){
			photoUrl = currentUser.photoURL
		}
		let displayName = ""
		if(currentUser.displayName != null){
			displayName = currentUser.displayName
		}
		let userName
		if(userNameRef.current.value !== ""){
			userName = userNameRef.current.value
		}else{userName = dbUser.userName}

		profileUser = {
			userId: props.data.userId,  
			photoUrl: photoUrl,
			displayName: displayName,
			email: props.data.email,
			userName: userName,
			profileSet: true,
			country: countrySelected,
			area: regionSelected,
			city: cityRef.current.value,
			phone: phoneRef.current.value,
			bio: bioRef.current.value,
			newMessage: false,
			activities: {
				hiking : "unchecked",
				skiing: "unchecked",
				skiTouring: "unchecked",
				mountainering: "unchecked",
				rockClimbing: "unchecked",
				mountainBiking: "unchecked",
				kayaking: "unchecked",
				cycling: "unchecked",
				paragliding: "unchecked",
				hangliding: "unchecked",
				speedRiding: "unchecked",
				kiteSurfing: "unchecked",
				baseJumping: "unchecked",
				skyDiving: "unchecked",
				surfing: "unchecked",
				scubaDiving: "unchecked",
				snorkelling: "unchecked",
				slackLining: "unchecked",
				tennis: "unchecked",
				justBeer: "unchecked"
			}
		}
		console.log("first profile setting")
		setDbUser(prevValues => ({
			...prevValues,
			profileUser
		}))
	}else{
	
		let photoUrl, displayName, userName, country, area, city, phone, bio
		if(userNameRef.current.value !== ""){
			userName = userNameRef.current.value
		}else{userName = dbUser.userName}
		if(dbUser.photoUrl !== "") { photoUrl = dbUser.photoUrl}else{ photoUrl = currentUser.photoURL}
		if(dbUser.displayName !== "") { displayName = dbUser.displayName}else{ displayName = currentUser.displayName}
		if(dbUser.country !== "" && countrySelected === "") { country = dbUser.country}else{ country = countrySelected}
		if(dbUser.area !== "" && regionSelected === "") { area = dbUser.area}else{ area = regionSelected}
		if(dbUser.city !== "" && cityRef.current.value === "") { city = dbUser.city}else{ city = cityRef.current.value}
		if(dbUser.phone !== "" && phoneRef.current.value === "") { phone = dbUser.phone}else{ phone = phoneRef.current.value}
		if(dbUser.bio !== "" && bioRef.current.value === "") { bio = dbUser.bio}else{ bio = bioRef.current.value}
	
		profileUser = {
			userId: dbUser.userId,
			photoUrl: photoUrl,
			displayName: displayName,
			email: dbUser.email,
			userName: userName,
			profileSet: true,
			country: country,
			area: area,
			city: city,
			phone: phone,
			bio: bio,
			newMessage: dbUser.newMessage,
			activities: {
				hiking : dbUser.activities.hiking,
				skiing: dbUser.activities.skiing,
				skiTouring: dbUser.activities.skiTouring,
				mountainering: dbUser.activities.mountainering,
				rockClimbing: dbUser.activities.rockClimbing,
				mountainBiking: dbUser.activities.mountainBiking,
				kayaking: dbUser.activities.kayaking,
				cycling: dbUser.activities.cycling,
				paragliding: dbUser.activities.paragliding,
				hangliding: dbUser.activities.hangliding,
				speedRiding: dbUser.activities.speedRiding,
				kiteSurfing: dbUser.activities.kiteSurfing,
				baseJumping: dbUser.activities.baseJumping,
				skyDiving: dbUser.activities.skyDiving,
				surfing: dbUser.activities.surfing,
				scubaDiving: dbUser.activities.scubaDiving,
				snorkelling: dbUser.activities.snorkelling,
				slackLining: dbUser.activities.slackLining,
				tennis: dbUser.activities.tennis,
				justBeer: dbUser.activities.justBeer
			}	
		}
		console.log("update of profile")
		setDbUser(prevValues => ({
			...prevValues,
			profileUser
		}))
		}
		db.collection('users').doc(currentUser.email).update(profileUser)
		.then(() => {
			console.log("update Profile done")
			setMessage("Your Personnal details have been succesfully updated !")
		})
		.catch((error) => {
			console.error("Error updating profile: ", error)
			setError("Ouups something wrong happened, Try again to save your personal details... ")
		});
		setCount(prevCount => prevCount + 1)
	}

	return (
		<>
		<div className={ !medium && !large ? "mx-auto mt-3" : "w-75 mx-auto my-3"}>
			<Card className=""  style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
				<Card.Body >
					<h3 className={!medium && !large 
						? "text-info text-center display-5 main-typo mb-5" 
						: "text-info text-center display-4 main-typo mb-5"
						}>Personal Details</h3>
					<Form onSubmit={handleSubmitProfile}>
						<Form.Group id ="userName">
							<Form.Label className="light-blue"><h5>User Name</h5></Form.Label>
							<Form.Control type="text" ref={userNameRef} placeholder="Enter your User Name"/>
						</Form.Group>
						<SelectCountry regionSelected={regionSelected} countrySelected={countrySelected} 
						setCountrySelected={setCountrySelected} setRegionSelected={setRegionSelected} 
						readyCountrySearch= {false} readyCountry />
						<Form.Group id ="city">
							<Form.Label className="light-blue"><h5>City</h5></Form.Label>
							<Form.Control type="text" ref={cityRef} placeholder="Enter your City"/>
						</Form.Group>
						<Form.Group id ="phone">
							<Form.Label className="light-blue"><h5>Phone Number</h5></Form.Label>
							<Form.Control type="Phone" ref={phoneRef} placeholder="Enter your Phone Number"/>
						</Form.Group>
						<Form.Group id ="bio">
							<Form.Label className="light-blue"><h5>Bio</h5></Form.Label>
							<Form.Control as="textarea" ref={bioRef} placeholder="what's your background ? Tell us your story..."/>
						</Form.Group>
						<div className="w-100 d-flex justify-content-center">
							<Button variant="info" className={!medium && !large ? "w-75 my-3 p-2" :"w-25 my-3 p-2"} type="submit">
								<HiOutlineSaveAs className="mr-3" style={{fontSize: "1.2em"}}/> Save Profile
							</Button>
						</div>
					</Form>
				</Card.Body>
			</Card>
		</div>
		</>
	)
}

export default UpdateProfile