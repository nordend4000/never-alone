import React, { useState, useEffect, useRef } from 'react'
import { Card, Button, Alert, Image, Form, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../Firebase'
import { v4 as uuidV4 } from 'uuid'
import { GiCheckMark } from "react-icons/gi"
import { Link } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5"
import { MdLocalPostOffice } from 'react-icons/md'
import NavbarConnected from './NavbarConnected'
import Footer from './Footer'
import ModalSendPrivateMessage  from './ModalSendPrivateMessage'
import useResize from '../contexts/useResize'


function Comments(props) {

	const tripId = (props.history.location.search).substring(1)
	const { currentUser } = useAuth()
	const [trip, setTrip] = useState()
	const [readyComment, setReadyComment] = useState(false)
	const [response, setResponse] = useState(null);
	const [openComment, setOpenComment] = useState(false)
	const [message, setMessage] = useState("")
	const [error, setError] = useState("")
	const [errorSubmit, setErrorSubmit] = useState("")
	const [messageSubmit, setMessageSubmit] = useState("")
	const [commentList, setCommentList] = useState()
	const [readyCommentList, setReadyCommentList] = useState(false)
	const [countRender, setCountRender] = useState(0)
	const commentRef = useRef()

	const resize = useResize()
	let large = resize.large
	let medium = resize.medium
	
	let email = currentUser.email
	const rawTime = Date.now()
	const time = new Date(Date.now())
	const stringTime = time.toDateString()
	const clock = time.getHours() + ":" + time.getMinutes()

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [countRender, message, error])

	useEffect(() => {
		const fetchDataComment = () => {
			try {
				db.collection('newTrip').doc(tripId)
				.onSnapshot((snapshot) => {
					console.log("snaphot comments ====> ", snapshot.data())
					setTrip(snapshot.data());
					setReadyComment(true)
				})
			} catch (error) {
				console.log(error);
			}
		};
		fetchDataComment();
		const fetchDataUser = () => {
			try {

				db.collection('users').doc(email)
				.onSnapshot((snapshot) => {
					console.log("snaphot user for comment ====> ",snapshot.data())
					setResponse(snapshot.data());
				})
			} catch (error) {
				console.log(error);
			}
		};
		fetchDataUser();
		// get sub collection from DB to set commentList
		db.collection('newTrip').doc(tripId).collection('comments')
		.orderBy("postTime", "desc")
		.get()
		.then((querySnapshot) => {
			const trips = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}))
			setCommentList(trips)
			setReadyCommentList(true)
		})
		.catch((error) => {
			console.log("Error getting documents: ", error);
		});

	}, [countRender, email, tripId])

	function handleSubmitComment(e) {
		e.preventDefault()
		setMessage("")
		setError("")
		const newComment = {
			from: response.userName,
			fromId: response.userId,
			to: trip.userName,
			toId: trip.userId,
			message: commentRef.current.value,
			postId: tripId,
			time: clock,
			date: stringTime,
			postTime: rawTime,
			activity: trip.activity,
			dateTrip: trip.date.stringDate
		}
		if(commentRef.current.value !== ""){
			// add sub Collection
			db.collection('newTrip')
			.doc(tripId)
			.collection('comments')
			.add(newComment)
			setErrorSubmit("")
			setMessageSubmit("Thanks, your comment has been sent successfully")
		}else{
			setErrorSubmit("Sorry you can't send a empty message")
		}
		// re-Render to display new comment
		setCountRender(prevCount => prevCount + 1)
		//clear ref to clear input textarea
		commentRef.current.value = ""
	}

	const openUserProfil = (props) => (
		<Tooltip id="button-tooltip" {...props}>
		  Open User Profile
		</Tooltip>
	  );

	return (
		<>
			<NavbarConnected/>
			<div className="background-topo">
				<div className="container">
				{errorSubmit && 
				<Alert variant="danger" 
				className={!medium && !large ? "w-100 mx-auto mt-3" : "w-50 ml-3 mt-3"}>
					{errorSubmit}
				</Alert>
				}
				{messageSubmit && 
				<Alert variant="success" className={!medium && !large ? "w-100 mx-auto mt-3" : "w-50 ml-3 mt-3"}>
					{messageSubmit}
				</Alert>
				}
				{error && <Alert variant="danger" 
				className={!medium && !large ? "w-100 mx-auto mt-3" : "w-50 ml-3 mt-3"}>
					{error}
				</Alert>
				}
				{message && 
				<Alert variant="success" 
				className={!medium && !large ? "w-100 mx-auto mt-3" : "w-50 ml-3 mt-3"}>
					{message}
				</Alert>
				}
				{(readyComment && typeof(trip) != "undefined") && 
				<>
				<div className={medium  || large ? "d-flex flex-wrap justify-content-around mt-4" : "mt-4"}>
					<Card key={uuidV4()} className={large ? "w-50 p-2 m-1 mt-3" : 
					(medium ? "w-75 mt-3" : "w-100 mb-2 mx-auto")}
					style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
						<Card.Body className="text-center">
						<Link className="linked" to={`/user?${trip.userId}`}>
								<h4>
									<OverlayTrigger
										placement="right"
										delay={{ show: 150, hide: 400 }}
										overlay={openUserProfil}
									>
										<b className="px-4">{trip.userName}</b>	
									</OverlayTrigger>	
								</h4>
							</Link>
							<small>
								from <i>{trip.userCity}, {trip.userCountry}</i>  
								<p className="mt-2">posted a new trip</p>
							</small>
							<div>{/* eslint-disable-next-line */}
								<Image className="mt-2 border border-info rounded" src={process.env.PUBLIC_URL + '/images/' + `${trip.activity}` + '.png'} rounded />
							</div>
							<p className="mt-2">{trip.date.day}, {trip.date.num} {trip.date.month} {trip.date.year}</p>
							<h3 className="mt-3 text-info text-uppercase main-typo">{trip.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}</h3>
							{trip.level !== "unchecked" ? <p className="text-capitalize">{trip.level}</p> : "" }
							<h6 className="mt-4">{trip.description}</h6>
							<p><b>{trip.spot}</b> {trip.area}, {trip.country}</p>
							<small>Starting from : {trip.start}</small>
							<div className="mt-2">
								{trip.carPool && <small className="mx-5"> <GiCheckMark className="text-info mr-2"/> Car-pooling</small>}
							</div>
							<div className="mt-2">
								{trip.publicTransport && <small className="mx-5"> <GiCheckMark className="text-info mr-2"/> Public Transport</small>}
							</div>
							<div className="mt-2">
								{trip.vehicule && <small className="mx-5"> <GiCheckMark className="text-info mr-2"/> Vehicule</small>}
							</div>
							{
							response != null &&
							<ModalSendPrivateMessage 
								fromUserId={response.userId} 
								fromUserName={response.userName} 
								fromEmail={response.email}
								toEmail={trip.email}
								toUserId={trip.userId}
								toUserName={trip.userName} 
								tripId={tripId} 
								activity={trip.activity}
								date={trip.date.stringDate}
								setError={setError}
								setMessage={setMessage}
							/>
							}
							<div>
								<h4 className="mt-4 light-blue">Comments :</h4>
								{readyCommentList && typeof(commentList) != "undefined" && commentList.length > 0
								? 
								commentList.map((com) =>(
									<Card className="m-3 p-2" key={uuidV4()} style={{backgroundColor: 'rgba(201, 153, 148, 0.231)'}}>
										<p>Comment from : <b className="ml-3">{com.from}</b></p>
										<small className="mb-2">{com.date} - {com.time}</small>
										<h5 className="mb-3">{com.message}</h5>
									</Card>
									)) 
								: <p>No comment yet</p>
								}
							</div>
						</Card.Body>
					</Card>
				</div>
				{!openComment ?
					<div className="d-flex flex-wrap justify-content-center">
						<Button variant="info" className={medium ? "w-25 text-light text-center my-5" : "w-75 text-light text-center my-5"} 
						onClick={() => setOpenComment(!openComment)}>
							<MdLocalPostOffice className="mr-2" style={{fontSize: "1.2em"}}/> 
							Add a comment
						</Button>
					</div>
					: <>
					<Card  style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}
					className={large ? "w-50 p-2 m-1 mt-3 mx-auto" : (medium ? "w-75 mt-3 mx-auto" : "w-100 mb-2 mx-auto")}>
					<h3 className="text-info text-center my-3 main-typo">Post new Comment</h3>
					<Form onSubmit={handleSubmitComment}>
						<Form.Group id ="comment">
							<Form.Label className="light-blue ml-3"><h5>Your comment :</h5></Form.Label>
							<Form.Control className="w-75 ml-3" type="textarea" ref={commentRef} placeholder="Enter your comment..."/>
						</Form.Group>
						<div className="w-100 d-flex justify-content-center">
							<Button variant="info" className={medium ? "w-25 my-3 mt-4" : "w-75 my-3 mt-4"} type="submit">
								<MdLocalPostOffice className="mr-3" style={{fontSize: "1.2em"}}/> Post Comment
							</Button>
						</div>
					</Form>
					</Card>
					</>
				}
				</>
				}
				<Button variant="info" className="w-10 text-center ml-5 my-3">
					<Link className="text-light" to="/trips">
						<IoArrowBack className="mr-2" style={{fontSize: "1.2em"}}/> 
						Back
					</Link>
				</Button>
				</div>
			</div>
			<Footer/>
		</>
	)
}

export default Comments
