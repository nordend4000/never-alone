import React, { useState, useEffect } from 'react'
import { Modal, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { db } from '../Firebase'
import { v4 as uuidV4 } from 'uuid'
import { GiCompass } from "react-icons/gi"
import { IoOpenOutline } from "react-icons/io5"
import { FiEdit } from "react-icons/fi"
import { AiOutlineDelete } from "react-icons/ai"
import { RiQuestionAnswerLine } from "react-icons/ri"
import { BiMessageRoundedEdit } from "react-icons/bi"
import { AiOutlineToTop } from "react-icons/ai"
import { AiOutlineVerticalAlignBottom } from "react-icons/ai"
import { MdFiberNew } from "react-icons/md"

// Fetch Data from database ==> Trips List
function useListTrips() {
	const [listTrips, setListTrips] = useState([])
	useEffect(() => {
	const unsubscribe = db.collection("newTrip")
	.orderBy("timeTrip", "desc")
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

// Fetch Data from database ==> Comment List
function useListComments(idUser) {
	const [listComments, setListComments] = useState([])
	useEffect(() => {
		var commentsUser = db.collectionGroup('comments')
		.where('fromId', '==', idUser)
		.orderBy("postTime", "desc")
		commentsUser.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				const comments = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
				}))
				setListComments(comments)
			});
		});
	}, [idUser])
	return listComments
}

// Fetch Data from database ==> SENT List
function useListSent(emailUser) {
	const [listMessage, setListMessage] = useState([])
	
	useEffect(() => {
	db.collection('users').doc(emailUser).collection("sent")
	.orderBy("date", "asc")
	.get()
	.then((querySnapshot) => {
		const messages = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}))
		setListMessage(messages)
		})
		.catch((error) => {
			console.log("Error getting documents: ", error);
		});
	}, [emailUser])
	return listMessage
}

// Fetch Data from database ==> BLOG List
function useListBlog() {
	const [listBlog, setListBlog] = useState([])
	useEffect(() => {
	const unsubscribe = db.collection("blog")
	.orderBy("timePost", "desc")
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

function ModalMyTrip(props) {	

	const listTrips = props.filteredtrips
	const listComments = props.filteredcomments
	const listBlogs = props.filteredBlogs
	const listInbox = props.inbox
	const listSent = props.sent

	return (
		<Modal
		{...props}
		size="lg"
		aria-labelledby="contained-modal-title-vcenter"
		centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter" className="blue-icon ml-5 main-typo">
					{(listTrips != null) && <h4>My Trips Published :</h4>}
					{(listBlogs != null) && <h4>My Blog's Post Published :</h4>}
					{(listComments != null) && <h4>My Comments Posted :</h4>}
					{(listInbox != null) && <h4>My Private Message : <b className="ml-3">INBOX</b></h4>}
					{(listSent != null) && <h4>My Private Message : <b className="ml-3">SENT</b></h4>}
				</Modal.Title>
			</Modal.Header>
				<Modal.Body>
				{props.errorfilter && <Alert variant="danger">{props.errorfilter}</Alert>}
				{(listTrips != null) &&
					listTrips.map((trip)=>(
						<div className="border-bottom border-info my-2 pb-4" key={uuidV4()}>
							<p className="mt-3"><GiCompass className="blue-icon ml-2 mr-3" style={{fontSize: "1.3em"}}/>
								<b className="text-capitalize text-info">{trip.activity.replace(/([a-z])([A-Z])/g, '$1 $2')} -</b> 
								<small className="ml-2 text-info">{trip.spot} {trip.area}, {trip.country}</small>
							</p> 
							<span className="ml-5 mb-4 light-blue">Posted on {trip.date.stringDate}</span>
							<div className="d-flex flex-wrap mt-3">
								<p className="mx-2">
									<Link to={`/post?${trip.id}`} className="link-modals-profile ml-1 p-1 pr-2">
										<IoOpenOutline className="mx-2 mb-1"/> Open
									</Link>
								</p>
								<p className="mx-2">
									<Link
										to={{
											pathname: "/editTrip",
											state: { action: "edit", tripId: `${trip.id}`}
										}}
										className="link-modals-profile ml-1 p-1 pr-2"
									>
										<FiEdit className="mx-2 mb-1"/>Edit
									</Link>
								</p>
								<p className="mx-2">
									<Link
										to={{
											pathname: "/editTrip",
											state: { action: "delete", tripId: `${trip.id}`}
										}}
										className="link-modals-profile ml-1 my-2 p-1 pr-2"
									>
										<AiOutlineDelete className="mx-2 mb-1"/>Delete
									</Link>
								</p>
							</div>
						</div>
					))
				}
				{(listBlogs != null) &&
					listBlogs.map((blog)=>(
						<div className="border-bottom border-info my-2 pb-4" key={uuidV4()}>
							<p className="mt-3"><GiCompass className="blue-icon ml-2 mr-3" style={{fontSize: "1.3em"}}/>
								<b className="text-capitalize text-info">{blog.activity.replace(/([a-z])([A-Z])/g, '$1 $2')} -</b> 
								<small className="ml-2 text-info">{blog.spot} {blog.area}, {blog.country}</small>
							</p> 
							<span className="ml-5 mb-4 light-blue">Posted on {blog.date.stringDate}</span>
							<div className="d-flex flex-wrap mt-3">
								<p className="mx-2">
									<Link to={`/blog?${blog.id}`} className="link-modals-profile ml-1 p-1 pr-2">
										<IoOpenOutline className="mx-2 mb-1"/> Open
									</Link>
								</p>
								<p className="mx-2">
									<Link
										to={{
											pathname: "/editblog",
											state: { action: "edit", blogId: `${blog.id}`}
										}}
										className="link-modals-profile ml-1 p-1 pr-2"
									>
										<FiEdit className="mx-2 mb-1"/>Edit
									</Link>
								</p>
								<p className="mx-2">
									<Link
										to={{
											pathname: "/editblog",
											state: { action: "edit", blogId: `${blog.id}`}
										}}
										className="link-modals-profile ml-1 p-1 pr-2"
									>
										<AiOutlineDelete className="mx-2 mb-1"/>Delete
									</Link>
								</p>
							</div>
						</div>
					))
				}
				{(listComments != null) &&
					listComments.map((list)=>(
						<div className="border-bottom border-info pb-4" key={uuidV4()}>
							<p className="text-info mt-3">
								<GiCompass className="blue-icon ml-2 mr-2" style={{fontSize: "1.3em"}}/>
								Comment to : <b className="ml-2">{list.to} </b>
							</p> 
							<small className="light-blue">
								Regarding 
								<b className="text-uppercase mx-2">{list.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}</b>
								trip 
							</small>
							<p className="text-info"><small>on {list.date} </small></p>
							<p className="mt-3 bgtrans p-2"><BiMessageRoundedEdit className="mx-2 text-info"/><i>{list.message}</i></p>
							<span className="ml-2 light-blue">Posted on <i>{list.date} {list.time}</i></span>
							<div className="d-flex flex-wrap mt-3">
								<p className="mx-2">
									<Link to={`/post?${list.postId}`} className="link-modals-profile ml-1 p-1 pr-2">
										<IoOpenOutline className="mx-2 mb-1"/> Open
									</Link>
								</p>
								<p className="mx-2">
									<Link to={`/user?${list.fromId}`} className="link-modals-profile ml-1 p-1 pr-2">
										<RiQuestionAnswerLine className="mx-2 mb-1"/> Answer
									</Link>
								</p>
								<p className="mx-2">
									<Link
										to={{
											pathname: "/deleteComment",
											search: `?${list.id}`,
											state: { message: `${list.message}`,
													sent: `${list.date}`,
													to: `${list.to}`,
													subCollection: "comments",
													postId: `${list.postId}`,
													activity: `${list.activity}`
													}
										}}
										className="link-modals-profile ml-1 p-1 pr-2"
									>
										<AiOutlineDelete className="mx-2 mb-1"/>Delete
									</Link>
								</p>
							</div>
						</div>
					))
				}
				{(listInbox != null && listInbox.length === 0) &&
					<h6 className="light-blue">
						You don't have any message yet
					</h6>
				}
				{(listInbox != null && listInbox.length > 0) &&
					listInbox.map((list)=>(
						<div className="border-bottom border-info" key={uuidV4()}>
							<p className="text-info mt-3">
								<GiCompass className="blue-icon ml-2 mr-2" style={{fontSize: "1.3em"}}/>
								Message from : <b className="ml-2">{list.from} </b>
								{list.newMessage && 
								<MdFiberNew className="ml-3 mb-1 light-blue" style={{fontSize: "1.5em"}}/>}
								<p><small className="ml-5">Sent on {list.date} - {list.time}</small></p>
							</p> 
							{list.activity === "direct message" 
							?   <small className="light-blue">Direct Message</small>
							:	<small className="light-blue">
									Regarding your Trip : 
									<b className="text-capitalize mx-2">
										{list.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}
									</b>
									on {list.dateTrip} 
								</small> 
							}
							<p className="mt-3 bgtrans p-2">
								<BiMessageRoundedEdit className="mx-2 text-info"/>
								<i>{list.message}</i>
							</p>
							<div className="d-flex flex-wrap mt-3">
								<p className="mx-2">
								{list.activity !== "direct message" &&
									<Link to={`/post?${list.postId}`} className="link-modals-profile ml-1 p-1 pr-2">
										<IoOpenOutline className="mx-2 mb-1"/> Open
									</Link>
								}
								</p>
								<p className="mx-2">
									<Link to={`/user?${list.fromId}`} className="link-modals-profile ml-1 p-1 pr-2">
										<RiQuestionAnswerLine className="mx-2 mb-1"/> Answer
									</Link>
								</p>
								<p className="mx-2">
									<Link
										to={{
											pathname: "/deleteMessage",
											search: `?${list.id}`,
											state: { message: `${list.message}`,
													sent: `${list.date}`,
													from: `${list.from}`,
													subCollection: "inbox",
													email: `${list.toEmail}`
													}
										}}
										className="link-modals-profile ml-1 p-1 pr-2"
									>
										<AiOutlineDelete className="mx-2 mb-1"/>Delete
									</Link>
								</p>
							</div>
						</div>
					))
				}
				{(listSent != null && listSent.length === 0) && 
					<h6 className="light-blue">
						You don't have any message yet
					</h6>
				}
				{(listSent != null && listSent.length > 0) &&
					listSent.map((list)=>(
						<div className="border-bottom border-info" key={uuidV4()}>
							<p className="text-info mt-3">
								<GiCompass className="blue-icon ml-2 mr-2" style={{fontSize: "1.3em"}}/>
								Message to : <b className="ml-2">{list.to} </b>
								<p><small className="ml-5">Sent on {list.date} - {list.time}</small></p>
							</p> 
							{list.activity === "direct message" 
							?   <small className="light-blue">Direct Message</small>
							:	<small className="light-blue">
									Regarding the Trip : 
									<b className="text-capitalize mx-2">
										{list.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}
									</b>
									on {list.dateTrip} 
								</small> 
							}
							<p className="mt-3 bgtrans p-2">
								<BiMessageRoundedEdit className="mx-2 text-info"/>
								<i>{list.message}</i>
							</p>
							<div className="d-flex flex-wrap mt-3">
								<p className="mx-2">
									{list.activity !== "direct message" &&
										<Link to={`/post?${list.postId}`} className="link-modals-profile ml-1 p-1 pr-2">
											<IoOpenOutline className="mx-2 mb-1"/> Open
										</Link>
									}
								</p>
								<p className="mx-2">
								<Link to={`/user?${list.toId}`} className="link-modals-profile ml-1 p-1 pr-2">
									<RiQuestionAnswerLine className="mx-2 mb-1"/> Answer
								</Link>
								</p>
								<p className="mx-2">
								<Link
									to={{
										pathname: "/deleteMessage",
										search: `?${list.id}`,
										state: { message: `${list.message}`,
												sent: `${list.date}`,
												to: `${list.to}`,
												subCollection: "sent",
												email: `${list.fromEmail}`
												}
									}}
									className="link-modals-profile ml-1 p-1 pr-2"
								>
									<AiOutlineDelete className="mx-2 mb-1"/>Delete
								</Link>
								</p>
							</div>
						</div>
					))
				}
				</Modal.Body>
			<Modal.Footer>
				<Button variant="info" onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

function ModalProfile(props) {

	const [listMessage, setListMessage] = useState([])
	const [modalShow, setModalShow] = useState(false)
	const [filteredTrips, setFilteredTrips] = useState(null)
	const [filteredComments, setFilteredComments] = useState(null)
	const [filteredBlogs, setFilteredBlogs] = useState(null)
	const [inbox, setInbox] = useState(null)
	const [sent, setSent] = useState(null)
	const [errorFilter, setErrorFilter] = useState('')
	const [count, setCount] = useState(0)
	const idUser = props.userId
	const emailUser = props.userEmail
	const dataListTrips = useListTrips()
	const dataListComments = useListComments(idUser)
	const dataListBlogs = useListBlog()
	const dataListSent = useListSent(emailUser)

	useEffect(() => {
	db.collection('users').doc(emailUser).collection("inbox")
	.orderBy("date", "asc")
	.get()
	.then((querySnapshot) => {
		const messages = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}))
		setListMessage(messages)
		})
		.catch((error) => {
			console.log("Error getting documents INBOX: ", error);
		});
	}, [count, emailUser])

	function filterTripsUser(){
		const  newArray = dataListTrips.filter(function (el) {
			return el.userId === idUser
		});
		if(newArray.length === 0){
		setErrorFilter("Sorry you don't have any trip published yet ...")
		setFilteredTrips(null)
		}else{
			setFilteredTrips(newArray)
			setErrorFilter("")
		}
		setModalShow(true)
	}

	function filterBlogUser(){
		const  newArray = dataListBlogs.filter(function (el) {
			return el.userId === idUser
		});
		if(newArray.length === 0){
		setErrorFilter("Sorry you don't have any Blog's post published yet ...")
		setFilteredBlogs(null)
		}else{
			setFilteredBlogs(newArray)
			setErrorFilter("")
		}
		setModalShow(true)
	}

	function filterCommentsUser(){
		if(dataListComments.length === 0){
		setErrorFilter("Sorry you don't have any comment posted yet ...")
		setFilteredComments(null)
		}else{
			setFilteredComments(dataListComments)
			setErrorFilter("")
		}
		setModalShow(true)
	}

	function getDataInbox(){
		setInbox(listMessage)
		setModalShow(true)
		setErrorFilter("")

		//update the New message in USER to false
		db.collection('users').doc(emailUser).update({
			newMessage: false
		})
	
		// update the New message in INBOX to false
		var test = db.collectionGroup('inbox').where('toEmail', '==', emailUser)
		test.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
			console.log(doc.id, ' =>xxx ', doc.data());
				doc.ref.update({newMessage: false})
			})
		})
		setCount(prevCount => prevCount + 1)
	}

	function getDataSent(){
		setSent(dataListSent)
		setModalShow(true)
		setErrorFilter("")
	}

	function handleCloseModal(){
		setFilteredTrips(null)
		setFilteredComments(null)
		setModalShow(false)
		setInbox(null)
		setSent(null)
	}

	return (
		<div className="border border-light px-5 py-4">
			<h4 className="text-center py-3 light-blue">My Private Messages :</h4>
			<p className="text-center p-3 link-modals-profile" onClick={() => getDataInbox()}>
				<b><AiOutlineVerticalAlignBottom className="mr-2 mb-1" style={{fontSize: "1.3em"}} />Inbox 
				{props.newMessage && <MdFiberNew className="ml-3 mb-1 light-blue" style={{fontSize: "1.5em"}}/>}
				</b>
			</p>
			<p className="text-center p-3 link-modals-profile" onClick={() => getDataSent()}>
				<b><AiOutlineToTop className="mr-2 mb-1" style={{fontSize: "1.3em"}}/>Sent </b>
			</p>
			<h4 className="text-center mt-5 pb-3 light-blue">My History :</h4>
			<p className="text-center p-3 link-modals-profile" onClick={() => filterTripsUser()}>
				<b>My Trips</b>
			</p>
			<p className="text-center p-3 link-modals-profile" onClick={() => filterCommentsUser()}>
				<b>My Comments</b>
			</p>
			<p className="text-center p-3 link-modals-profile" onClick={() => filterBlogUser()}>
				<b>My blog's Post</b>
			</p>
			<ModalMyTrip
				show={modalShow}
				onHide={() => handleCloseModal()}
				filteredtrips={filteredTrips}
				filteredcomments={filteredComments}
				filteredBlogs={filteredBlogs}
				errorfilter={errorFilter}
				inbox={inbox}
				sent={sent}
			/>
		</div>
	);
}

export default ModalProfile