import React, { useState, useRef, useMemo } from 'react'
import { Card, Button, Form, ProgressBar, Alert} from 'react-bootstrap'
import {useDropzone} from 'react-dropzone';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { useHistory } from 'react-router-dom'
import { MdLocalPostOffice } from 'react-icons/md'
import { v4 as uuidV4 } from 'uuid'
import { db } from '../Firebase'
import { storage } from "../Firebase"
import SelectCountry from './SelectCountry'
import ACTIVITIES from '../ressources/activities.js'
import {baseStyle, activeStyle, acceptStyle, rejectStyle} from '../ressources/dropImage.js'

function BlogForm(props) {
	
	const descriptionRef = useRef()
	const startRef = useRef()
	const spotRef = useRef()
	const subtitleRef = useRef()
	const history = useHistory()
	const [countrySelected, setCountrySelected] = useState("");
	const [regionSelected, setRegionSelected] = useState("");
	const [activitySelected, setActivitySelected] = useState("")
	const [carPool, setCarPool] = useState(false);
	const [vehicule, setVehicule] = useState(false);
	const [publicTransport, setPublicTransport] = useState(false)
	const [startDate, setStartDate] = useState(new Date())
	const[progress, setProgress] = useState(0)
	const [errorForm, setErrorForm] = useState(false)
	const medium = props.medium
	const large = props.large

	// DRAG & DROP  
	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
		fileRejections,
		acceptedFiles
		} = useDropzone({
			accept: 'image/jpeg, image/png',
			maxFiles: 1
		});

	const style = useMemo(() => ({
		...baseStyle,
		...(isDragActive ? activeStyle : {}),
		...(isDragAccept ? acceptStyle : {}),
		...(isDragReject ? rejectStyle : {})
	}), [
		isDragActive,
		isDragReject,
		isDragAccept
	])

	const acceptedFileItems = acceptedFiles.map(file => (
		<li key={file.path}>
		{file.path} - {file.size} bytes
		</li>
	));
	const fileRejectionItems = fileRejections.map(({ file, errors  }) => { 
		return (
			<li key={file.path}>
				{file.name} - {file.size} bytes
				<ul>
					{errors.map(e => <li key={e.code}>{e.message}</li>)}
				</ul>
			</li>
		) 
	});

	const setCount = props.setCount
	const setError = props.setError
	const setMessage = props.setMessage
	const dataUser = props.dataUser

	const dayConverted = new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(startDate)
	const monthConverted = new Intl.DateTimeFormat('en-US', { month: 'long'}).format(startDate)

	function handleSelectActivity(e) {
		e.preventDefault()
		setActivitySelected(e.target.value)
	}

	function handleSubmitTrip(e) {
		e.preventDefault()
		if(activitySelected !== "" && countrySelected !== ""){
			const mediaName = uuidV4()
			if(acceptedFiles.length === 1){
			const uploadImage = storage.ref(`blog-media/${mediaName}`).put(acceptedFiles[0])
			uploadImage.on(
				'state_changed',
				//current progress of the upload
				snapshot =>{
					const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)* 100)
					setProgress(progress)
				},
				error =>{
					console.log(error)
				},
				//if successful
				() => {
					storage
					.ref('blog-media')
					.child(mediaName)
					.getDownloadURL()
					.then(url =>{
						// if url image is ready send the rest of informations
						const blogPost = {
							activity: activitySelected,
							description: descriptionRef.current.value,
							start: startRef.current.value,
							spot: spotRef.current.value,
							country: countrySelected,
							area: regionSelected,
							carPool: carPool,
							vehicule: vehicule,
							publicTransport: publicTransport,
							photoUrl: dataUser.photoUrl,
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
							mediaName: mediaName,
							mediaUrl: url,
							subtitle: subtitleRef.current.value,
							date: {
								day: dayConverted,
								num: startDate.getDate(),
								month: monthConverted,
								year: startDate.getFullYear(),
								stringDate: startDate.toDateString()
							}
						}
							db.collection('blog').add(blogPost)
							.then(() => {
								setMessage("Your new Blog Post has been succesfully posted !")
								console.log("New Post done")
							})
							.catch((error) => {
								// The document probably doesn't exist.
								console.error("Error updating profile: ", error)
								setError("Ouups something wrong happened, Try again to post your blog post... ")
							});
							setCount(prevCount => prevCount + 1)
							setCountrySelected("")
							setRegionSelected("")
							setActivitySelected("")
							setCarPool(false)
							setVehicule(false)
							setPublicTransport(false);
							descriptionRef.current.value = ""
							startRef.current.value = ""
							spotRef.current.value = ""
							subtitleRef.current.value = ""
							history.push("/blog")
					})
				}
			)
			}
			//if accepted file == 0
			const emptyUrl = "" 
			const blogPost = {
				activity: activitySelected,
				description: descriptionRef.current.value,
				start: startRef.current.value,
				spot: spotRef.current.value,
				country: countrySelected,
				area: regionSelected,
				carPool: carPool,
				vehicule: vehicule,
				publicTransport: publicTransport,
				photoUrl: dataUser.photoUrl,
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
				mediaName: mediaName,
				mediaUrl: emptyUrl,
				subtitle: subtitleRef.current.value,
				date: {
					day: dayConverted,
					num: startDate.getDate(),
					month: monthConverted,
					year: startDate.getFullYear(),
					stringDate: startDate.toDateString()
				}
			}
			
				db.collection('blog').add(blogPost)
				.then(() => {
					setMessage("Your new Blog Post has been succesfully posted !")
					console.log("New Post done")
				})
				.catch((error) => {
					// The document probably doesn't exist.
					console.error("Error updating profile: ", error)
					setError("Ouups something wrong happened, Try again to post your blog post... ")
				});
				setCount(prevCount => prevCount + 1)
				setCountrySelected("")
				setRegionSelected("")
				setActivitySelected("")
				setCarPool(false)
				setVehicule(false)
				setPublicTransport(false);
				descriptionRef.current.value = ""
				startRef.current.value = ""
				spotRef.current.value = ""
				subtitleRef.current.value = ""
				history.push("/blog")
				
		}else{setErrorForm("Please select at least an activity and a country")}
	}

	return (
		<>
		<Card className={ !medium && !large ? "mx-auto my-5" : "w-75 mx-auto my-3"} 
		style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}>
				<Card.Body >
					<h3 className={!medium && !large 
						? "text-center display-5 main-typo-light-blue mb-5" 
						: "text-center display-4 main-typo-light-blue mb-5"
						}>New Blog Post</h3>
					<Form onSubmit={handleSubmitTrip}>
						<Form.Group id="activity">
							<Form.Label className="light-blue"><h5>Activity</h5></Form.Label>
							<Form.Control as="select" value={activitySelected} onChange={e => handleSelectActivity(e)}>
								<option default>Which activity did you parctice ?</option>
								{ACTIVITIES.map(activity =>(
									<option key={uuidV4()} value={activity}>{activity.replace(/([a-z])([A-Z])/g, '$1 $2')}</option>
								))}
							</Form.Control>
						</Form.Group>
						<Form.Group id="date">
							<Form.Label className="light-blue"><h5>Trip Date</h5></Form.Label>
							<div>
								<DatePicker className="mb-3 " selected={startDate} onChange={date => setStartDate(date)} >
									<div className="mb-3 mt-4 ml-3" style={{ color: "blue"}}>How was the weather ?</div>
								</DatePicker>
							</div>
						</Form.Group>
						<Form.Group id="userName">
							<Form.Label className="light-blue"><h5>Description</h5></Form.Label>
							<Form.Control as="textarea" ref={descriptionRef} placeholder="Tell us how was your trip..."/>
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
							<Form.Label className="light-blue"><h5>Starting Point</h5></Form.Label>
							<Form.Control type="text" ref={startRef} placeholder="Where did you start ?"/>
						</Form.Group>
						<Form.Group id="spot">
							<Form.Label className="light-blue"><h5>Spot / Area</h5></Form.Label>
							<Form.Control type="text" ref={spotRef} placeholder="Which spot / area did you go ?"/>
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
						<Form.Group id="image-description">
						<Form.Label className="light-blue"><h5>Illustrative Picture</h5></Form.Label>
						<Form.Control type="text" ref={subtitleRef} placeholder="Enter your image subtitle..."/>
						<div className="container mt-3">
						
							<div {...getRootProps({style})}>
								<input {...getInputProps()} />
								<p>Drag 'n' drop your image here, or click to select your file</p>
								<em>Only one image file .jpeg or .png will be accepted</em>
							</div>
							{<aside>
								
								{fileRejectionItems.length > 0 && <p className="text-danger">Rejected files : {fileRejectionItems}</p>}
								{acceptedFileItems.length > 0 && <p className="text-success">Accepted files : {acceptedFileItems}</p>}
								{(progress > 0 && progress < 99) && <ProgressBar striped variant="info" value={progress} max="100" className="mt-1"/>}
							</aside>
						}
						</div>
						</Form.Group>
						{errorForm && <Alert className="w-100 mx-auto mt-3" variant="danger">
							{errorForm}
						</Alert>}
						<div className="w-100 d-flex justify-content-center">
							<Button variant="info" type="submit"
							className={ !medium && !large ? "w-75 my-3 mt-4" : "w-50 my-3 mt-4"} >
								<MdLocalPostOffice className="mr-3" style={{fontSize: "1.2em"}}/> Publish my Post
							</Button>
						</div>
					</Form>
				</Card.Body>
		</Card>
		</>
	)
}

export default BlogForm
