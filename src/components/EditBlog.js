import React, { useState, useEffect, useMemo } from 'react'
import NavbarConnected from './NavbarConnected'
import Footer from './Footer'
import {useDropzone} from 'react-dropzone'
import { useAuth } from '../contexts/AuthContext'
import { Card, Button, Form, Row, Alert, ProgressBar} from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Link, useHistory } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { db } from '../Firebase'
import { storage } from "../Firebase"
import ACTIVITIES from '../ressources/activities.js'
import LIST_COUNTRY_STATE from '../ressources/countries.json'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoArrowBack } from "react-icons/io5"
import { FiEdit } from "react-icons/fi"
import { GiCompass } from "react-icons/gi"
import { HiOutlineSaveAs } from "react-icons/hi";
import {baseStyle, activeStyle, acceptStyle, rejectStyle} from '../ressources/dropImage.js'
import useResize from '../contexts/useResize'

// Fetch Data from database
function useFetchBlog() {
	const [listBlog, setListBlog] = useState([])

	useEffect(() => {
	const unsubscribe = db.collection("blog")
	.onSnapshot((snapshot) => {
		const blogs = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}))
		setListBlog(blogs)
	})
	return () => unsubscribe()
	}, [])
return listBlog
}


function EditBlog(props) {

	const blogId = props.history.location.state.blogId
	const { currentUser } = useAuth()
	const history = useHistory()

	const [dataUser, setDataUser] = useState("")
	const [dataBlog, setDataBlog] = useState("")
	const [readyEdit, setReadyEdit] = useState(false);
	const [readyCompute, setReadyCompute] = useState(false);
	const listBlog = useFetchBlog()
	const [temp, setTemp] = useState();
	const [countrySelected, setCountrySelected] = useState("")
	const [regionSelected, setRegionSelected] = useState("")
	const [activitySelected, setActivitySelected] = useState("")
	const [description, setDescription] = useState("")
	const [start, setStart] = useState("")
	const [spot, setSpot] = useState("")
	const [carPool, setCarPool] = useState(false)
	const [vehicule, setVehicule] = useState(false)
	const [publicTransport, setPublicTransport] = useState(false);
	const [startDate, setStartDate] = useState(new Date())
	const [subtitle, setSubtitle] = useState("")
	const[progress, setProgress] = useState(0)
	const [action, setAction] = useState(props.history.location.state.action)

	const resize = useResize()
	let medium = resize.medium

	const email = currentUser.email
	const dayConverted = new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(startDate)
	const monthConverted = new Intl.DateTimeFormat('en-US', { month: 'long'}).format(startDate)

	console.log("listBlog", listBlog)

	if(!readyCompute){
		if(listBlog !== "" && typeof(listBlog) != "undefined" && listBlog.length > 0){
			const filteredList = listBlog.filter((blog => blog.id === blogId))
			console.log("filteredList", filteredList)
				if(filteredList.length === 1){
				setReadyCompute(true)
				handleFilteredList(filteredList[0])
				console.log("filteredList[0]", filteredList[0])
				}
		}
	}
		
	function handleFilteredList(blog){
		setReadyCompute(true)
		console.log("handle", blog)
		
		setDataBlog(blog);
		setActivitySelected(blog.activity)
		setDescription(blog.description)
		setStart(blog.start)
		setSpot(blog.spot)
		setCarPool(blog.carPool)
		setVehicule(blog.vehicule)
		setPublicTransport(blog.publicTransport)
		setSubtitle(blog.subtitle)
		// format date
		let month = blog.date.month
		let num = blog.date.num
		let year = blog.date.year
		let text = month + " " + num + " " + year		
		let event = new Date(text) 
		setStartDate(event)
		// handle select country / region
		const tabCountry = LIST_COUNTRY_STATE.filter((country => country.name === blog.country))
		setTemp(tabCountry[0].states)
		setCountrySelected(blog.country)
		setRegionSelected(blog.area)
		setReadyEdit(true)
		}

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
		db.collection("blog").doc(blogId).delete().then(() => {
			console.error("Your trip has been successfully deleted !")
			setReadyEdit(false)
			variant = "success"
			feedback = "Your blog's post has been successfully deleted !"
			history.push("/blog", { feedback: `${feedback}`, variant: `${variant}` })
		}).catch((error) => {
			setReadyEdit(false)
			console.error("Error removing document: ", error)
			variant = "danger"
			feedback = "Ouups something wrong happened, Try again to delete your blog's post..."
			history.push("/blog", { feedback: `${feedback}`, variant: `${variant}` })
		});
		
	}

	function handleSubmitBlog(e) {

		e.preventDefault()
		let urlPhotoUser = ""
		if(dataUser.photoUrl !== ""){
			urlPhotoUser = dataUser.photoUrl 
		} 
		if(acceptedFiles.length === 1){
		const uploadImage = storage.ref(`blog-media/${dataBlog.mediaName}`).put(acceptedFiles[0])
		uploadImage.on(
			'state_changed',
			//current upload progress
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
				.child(dataBlog.mediaName)
				.getDownloadURL()
				.then(url =>{
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
						mediaName: dataBlog.mediaName,
						mediaUrl: url,
						subtitle: subtitle,
						date: {
							day: dayConverted,
							num: startDate.getDate(),
							month: monthConverted,
							year: startDate.getFullYear(),
							stringDate: startDate.toDateString()
						}
					}
					let feedback, variant
					db.collection('blog').doc(blogId).update(newTrip)
					.then(() => {
						variant = "success"
						feedback = "Your blog's post has been succesfully updated !"
						history.push("/blog", { feedback: `${feedback}`, variant: `${variant}` })
					})
					.catch((error) => {
						// The document probably doesn't exist.
						console.error("Error updating profile: ", error)
						variant = "danger"
						feedback = "Ouups something wrong happened, Try again to update your blog's post..."
						history.push("/blog", { feedback: `${feedback}`, variant: `${variant}` })
					});
				})
			}
		)
		}
		//if accepted file == 0
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
			mediaName: dataBlog.mediaName,
			mediaUrl: dataBlog.mediaUrl,
			subtitle: subtitle,
			date: {
				day: dayConverted,
				num: startDate.getDate(),
				month: monthConverted,
				year: startDate.getFullYear(),
				stringDate: startDate.toDateString()
			}
		}
		let feedback, variant
		db.collection('blog').doc(blogId).update(newTrip)
		.then(() => {
			variant = "success"
			feedback = "Your blog's post has been succesfully updated !"
			history.push("/blog", { feedback: `${feedback}`, variant: `${variant}` })
		})
		.catch((error) => {
			// The document probably doesn't exist.
			console.error("Error updating profile: ", error)
			variant = "danger"
			feedback = "Ouups something wrong happened, Try again to update your blog's post..."
			history.push("/blog", { feedback: `${feedback}`, variant: `${variant}` })
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
					<h3 className="text-center mx-5 mt-3 mb-5 main-typo-light-blue">Delete My Blog's post</h3>			
				</Row>
				<h5 className="text-info ml-3 text-capitalize mb-1">
					<GiCompass className="mx-2 mb-1"/>
					<b>{dataBlog.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}</b> - <small>{dataBlog.spot}</small>
				</h5>
				<p className="light-blue ml-4">
					<small className="ml-1"> Published on <b>{dataBlog.date.stringDate}</b></small>
				</p>
				<Button variant="info" className={medium ? "w-50 text-center my-3 ml-5" : "w-75 text-center my-3 mx-auto" } 
				onClick={() => setAction("edit")}>
				<FiEdit className="mr-2" style={{fontSize: "1.2em"}}
				/> 
						Edit My blog's post
				</Button>
				<Row className="d-flex justify-content-end ">
					<Alert variant="danger" onClick={() => deleteTrip(blogId)} className="mr-5 delete">
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
							<h3 className="text-center mb-5 main-typo-light-blue mx-5">Edit My Blog's Post</h3>			
						</Row>
						<h5 className="text-info ml-1 text-capitalize mb-1">
							<GiCompass className="mx-2 mb-1"/>
							<b>{dataBlog.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}</b> - <small>{dataBlog.spot}</small>
						</h5>
						<p className="light-blue ml-2">
							<small className="ml-1"> Published on <b>{dataBlog.date.stringDate}</b></small>
						</p>
						<Row className="d-flex justify-content-end">
							<Button variant="info" className={medium ? "w-25 text-center my-3 ml-5" : "w-50 text-center my-3 mx-auto mb-5"} 
							onClick={() => setAction("delete")}>
								<AiOutlineDelete className="mr-2" style={{fontSize: "1.2em"}}/> 
								Delete
							</Button>
						</Row>
						<Form onSubmit={handleSubmitBlog}>
							<Form.Group id="date">
								<Form.Label className="light-blue"><h5>Trip Date</h5></Form.Label>
								<div>
									<DatePicker className="mb-3" selected={startDate}
									onChange={date => setStartDate(date)} >
										<div className="mb-3 mt-4 ml-3" style={{ color: "blue"}}>When was your trip !</div>
									</DatePicker>
								</div>
							</Form.Group>
							<Form.Group id="activity">
								<Form.Label className="light-blue"><h5>Activity</h5></Form.Label>
								<Form.Control className="text-capitalize" as="select" value={activitySelected} 
								onChange={e => setActivitySelected(e.target.value)}>
									<option default>Which activity did you parctice ?</option>
									{ACTIVITIES.map(activity =>(
										<option key={uuidV4()} value={activity}>
											{activity.replace(/([a-z])([A-Z])/g, '$1 $2')}
										</option>
									))}
								</Form.Control>
							</Form.Group>
							<Form.Group id="userName">
								<Form.Label className="light-blue"><h5>Description</h5></Form.Label>
								<Form.Control as="textarea" defaultValue={description} placeholder="Tell us how was your trip..."
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
								<Form.Control type="text" defaultValue={start} placeholder="Where did you start ?"
									onChange={e => setStart(e.target.value)}
								/>
							</Form.Group>
							<Form.Group id="spot">
								<Form.Label className="light-blue"><h5>Spot to go</h5></Form.Label>
								<Form.Control type="text" defaultValue={spot} placeholder="Which spot / area did you go ?"
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
							<Form.Group id="image-description">
							<Form.Label className="light-blue"><h5>Illustrative Picture</h5></Form.Label>
							<Form.Control type="text" defaultValue={subtitle} placeholder="Change your image's subtitle..."
								onChange={e => setSubtitle(e.target.value)}
							/>
							<div className="container mt-3">
							
								<div {...getRootProps({style})}>
									<input {...getInputProps()} />
									<p>if you want to update your Blog's post image ...</p>
									<p>Drag 'n' drop your image here, or click to select your file</p>
									<em>Only one image file .jpeg or .png will be accepted</em>
								</div>
								{<aside>
									{fileRejectionItems.length > 0 && 
									<p className="text-danger">Rejected files : {fileRejectionItems}</p>
									}
									{acceptedFileItems.length > 0 && 
									<p className="text-success">Accepted files : {acceptedFileItems}</p>
									}
									{(progress > 0 && progress < 99) && 
									<ProgressBar striped variant="info" value={progress} max="100" className="mt-1"/>
									}
								</aside>
							}
							</div>
							</Form.Group>
							<div className="w-100 d-flex justify-content-center">
								<Button variant="info" type="submit"
								className={medium ? "w-50 text-center my-3 ml-5" : "w-75 text-center my-3 mx-auto mb-5"} >
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

export default EditBlog