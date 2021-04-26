import React from 'react'
import NavbarConnected from './NavbarConnected'
import Footer from './Footer'
import { Card, Button, Row, Alert} from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { db } from '../Firebase'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoArrowBack } from "react-icons/io5"
import { GiCompass } from "react-icons/gi"
import { BiMessageRoundedEdit } from "react-icons/bi"
import useResize from '../contexts/useResize'

function DeleteMessage(props) {

	const messageId = (props.history.location.search).substring(1)
	const history = useHistory()
	const message = props.history.location.state.message
	const from = props.history.location.state.from
	const to = props.history.location.state.to
	const sent = props.history.location.state.sent
	const subCollection = props.history.location.state.subCollection
	const email = props.history.location.state.email
	const resize = useResize()
	let medium = resize.medium

	function deleteMessage(){
		let feedback, variant
			db.collection("users").doc(email).collection(subCollection).doc(messageId).delete().then(() => {
			variant = "success"
			feedback = "Your message has been successfully deleted !"
			history.push("/profile", { feedback: `${feedback}`, variant: `${variant}` })
		}).catch((error) => {
			console.error("Error removing document: ", error)
			variant = "danger"
			feedback = "Ouups something wrong happened, Try again to delete your message..."
			history.push("/profile", { feedback: `${feedback}`, variant: `${variant}` })
		});
		
	}

	return (
		<>
			<NavbarConnected/>
			<div className="background-topo3">
				<div className="container">
				{subCollection === "inbox" &&
				<Card className={medium ? "w-75 my-5" : "w-100 my-5"} style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}>
					<Row className="d-flex justify-content-center">
						<h3 className="text-center my-4 mx-3 main-typo-light-blue">Delete received message</h3>			
					</Row>
					<h5 className="text-info ml-3 text-capitalize mb-3">
						<GiCompass className="mx-2 mb-1"/>
						<small>Message from : </small>
						<b className="ml-2 light-blue">{from}</b>
					</h5>
					<div className="mb-3">
						<small className="ml-2 light-blue">Sent on  {sent}</small>
					</div>
					<div className="mt-1 p-2 border border-info rounded ">
						<small className="ml-2 m-2 text-info">
							<BiMessageRoundedEdit className="mx-2 text-info"/>
							... {message}
						</small>
					</div>
					<Row className="d-flex justify-content-end mt-3">
						<Alert variant="danger" onClick={() => deleteMessage()} className="mr-5 delete">
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
				{subCollection === "sent" &&
				<Card className={medium ? "w-75 my-5" : "w-100 my-5"} style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}>
					<Row className="d-flex justify-content-center">
						<h3 className="text-center my-4 mx-3 main-typo-light-blue">Delete sent message </h3>			
					</Row>
					<h5 className="text-info ml-3 text-capitalize mb-3">
						<GiCompass className="mx-2 mb-1"/>
						<small>Message to : </small>
						<b className="ml-2 light-blue">{to}</b>
					</h5>
					<div className="mb-3">
						<small className="ml-2 light-blue">Sent on  {sent}</small>
					</div>
					<div className="mt-1 p-2 border border-info rounded ">
						<small className="ml-2 m-2 text-info">
							<BiMessageRoundedEdit className="mx-2 text-info"/>
							... {message}
						</small>
					</div>
					<Row className="d-flex justify-content-end mt-3 ">
						<Alert variant="danger" onClick={() => deleteMessage()} className="mr-5 delete">
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
				</div>
			</div>
			<Footer/>
		</>
	)
}

export default DeleteMessage
