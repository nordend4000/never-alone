import React, { useState} from 'react'
import { Modal, Button, Alert} from 'react-bootstrap'
import { IoTrashBinSharp } from "react-icons/io5"
import Recaptcha from 'react-recaptcha'
import emailjs from 'emailjs-com'

function ModalEmailDelete(props) {

	const [humanVerified, setHumanVerified] = useState(false)
	const setError = props.setError
	const setMessage = props.setMessage
	const email = props.email
	const setModalShow = props.setModalShow
	const setCount = props.setCount

	var verifyCallback = function(response) {
		if(response){
			setHumanVerified(true)
		}
	  };
	var onloadCallback = function() {
		console.log("grecaptcha is ready!")
	  };


  function sendEmail(e) {
	e.preventDefault()
	setMessage("")
	setError("")
	console.log(e.target)
	if(humanVerified){
    emailjs.sendForm(
		process.env.REACT_APP_EMAIL_JS_SERVICE, 
		process.env.REACT_APP_EMAIL_JS_TEMPLATE, e.target, 
		process.env.REACT_APP_EMAIL_JS_USER
		)
    	.then((result) => {
			if(result.text === "OK"){
				setMessage("Thanks, your request has been sent successful... We will delete your account as soon as possible")
			}
			else{setError("Ouups something wrong happened, Try again to delet your account ...")}
    	}, (error) => {
        console.log(error.text);
    	});
	}else{alert("Please verify that your are a human !!")}
	setCount(prevCount => prevCount + 1)
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
					Delete my account
				</Modal.Title>
				
			</Modal.Header>
				<Modal.Body className="mt-3">
				<div className="mx-auto">
				<p className="text-danger ml-5">We are sad to see you leaving !!!</p>
						<Recaptcha
							sitekey={`${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`}
							render="explicit"
							verifyCallback={verifyCallback}
							onloadCallback={onloadCallback}
						/>
					</div>
					<form className="contact-form" onSubmit={sendEmail}>
						<input type="hidden" name="contact_number" />
						<input type="hidden" name="auth_email" 
						value={email != null ? email : "No Auth"}/>
						<label className="light-blue  d-flex mt-4 mb-1"><h5>Please confirme the email linked to this account :</h5></label>
						<input className="border border-rounded p-2 pr-5" type="email" 
						name="user_email" placeholder="Verify your email..."/>
						<div className="d-flex mt-3">
							<Button variant="info" className="mt-3 mb-5 p-2 px-4" type="submit">
								<IoTrashBinSharp className="mr-3" style={{fontSize: "1.2em"}}/>
								Confirme delete my account
							</Button>
						</div>
					</form>

				</Modal.Body>
			<Modal.Footer>
				<Button variant="info" onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

function ModalDeletAccount(props) {

	const [modalShow, setModalShow] = useState(false)

	return (
		<div className="my-4 mx-auto">
			<div className=" d-flex justify-content-center mt-5" onClick={() => setModalShow(true)}>
				<Alert variant="danger" className="delete"><IoTrashBinSharp className="mr-3 mb-1"/>Delete My Account</Alert>
			</div>
			<ModalEmailDelete
				show={modalShow}
				onHide={() => setModalShow(false)}
				email={props.email}
				setError={props.setError}
				setMessage={props.setMessage}
				setModalShow={setModalShow}
				setCount={props.setCount}
			/>
		</div>
	);
}

export default ModalDeletAccount