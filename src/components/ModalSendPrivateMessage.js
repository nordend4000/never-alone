import React, { useState, useRef } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { db } from '../Firebase'
import { GiCompass } from "react-icons/gi"
import { MdLocalPostOffice } from 'react-icons/md'


function ModalPrivateMessage(props) {
	const setModalShow = props.setModalShow
	const setError = props.setError
	const setMessage = props.setMessage
	const fromEmail = props.fromEmail
	const toEmail = props.toEmail
	const messageRef = useRef()

	const rawTime = Date.now()
	const time = new Date(Date.now())
	const stringTime = time.toDateString()
	const clock = time.getHours() + ":" + time.getMinutes()

	function handleSubmitPrivateMessage(e){
		e.preventDefault()
		setMessage("")
		setError("")
		const newMessage = {
			from: props.fromUserName,
			fromId: props.fromUserId,
			fromEmail: props.fromEmail,
			to: props.toUserName,
			toId: props.toUserId,
			toEmail: props.toEmail,
			message: messageRef.current.value,
			postId: props.tripId,
			dateTrip: props.date,
			time: clock,
			date: stringTime,
			postTime: rawTime,
			activity: props.activity,
			newMessage: true
		}
		if(messageRef.current.value !== ""){
			// add it in sub collection sent "from user"
			db.collection('users')
			.doc(fromEmail)
			.collection('sent')
			.add(newMessage)
			// add it in sub collection inbox "to user"
			db.collection('users')
			.doc(toEmail)
			.collection('inbox')
			.add(newMessage)

			//set userProfile with newMessage : True
			db.collection('users').doc(toEmail).update({
				newMessage: true
			})
			setError("")
			setMessage("Thanks, your message has been sent successfully")
		}else{
			setError("Sorry you can't send a empty message")
		}
		messageRef.current.value = ""
		setModalShow(false)
	}

	return (
		<Modal
		{...props}
		size="lg"
		aria-labelledby="contained-modal-title-vcenter"
		centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter" className="blue-icon ml-5 main-typo">
					Send a Private Message
				</Modal.Title>
			</Modal.Header>
				<Modal.Body>
				<Form onSubmit={handleSubmitPrivateMessage}>
					<Form.Group id ="private-message">
						<Form.Label className="light-blue ml-3">
							<h5><GiCompass className="blue-icon ml-2 mr-2" style={{fontSize: "1.3em"}}/>
							Your Message to {props.toUserName} :</h5>
						</Form.Label>
						<Form.Control className="w-75 ml-3" type="textarea" ref={messageRef} placeholder="Enter your Private Message..."/>
					</Form.Group>
					<div className="w-100 d-flex justify-content-center">
						<Button variant="info" className="w-50 my-3 mt-4" type="submit">
							<MdLocalPostOffice className="mr-3" style={{fontSize: "1.2em"}}/> Post your Message
						</Button>
					</div>
				</Form>

				</Modal.Body>
			<Modal.Footer>
				<Button variant="info" onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

function ModalSendPrivateMessage(props) {

	const [modalShow, setModalShow] = useState(false)

	return (
		<div className="my-4 w-50 mx-auto">
			<p className="text-center p-3 link-modals-profile" onClick={() => setModalShow(true)}>
				<b><MdLocalPostOffice className="mr-2" style={{fontSize: "1.2em"}}/>  Private Message </b>
			</p>
			<ModalPrivateMessage
				show={modalShow}
				onHide={() => setModalShow(false)}
				fromUserId={props.fromUserId} 
				fromUserName={props.fromUserName} 
				fromEmail={props.fromEmail}
				toEmail={props.toEmail}
				toUserId={props.toUserId} 
				toUserName={props.toUserName} 
				tripId={props.tripId} 
				activity={props.activity}
				date={props.date}
				setError={props.setError}
				setMessage={props.setMessage}
				setModalShow={setModalShow}
			/>
		</div>
	);
}

export default ModalSendPrivateMessage