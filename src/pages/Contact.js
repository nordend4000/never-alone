import React, { useState} from 'react'
import { Card, Alert, Button } from 'react-bootstrap'
import emailjs from 'emailjs-com'
import Navbar from '../components/Navbar'
import NavbarConnected from '../components/NavbarConnected'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5"
import { MdLocalPostOffice } from "react-icons/md"
import Recaptcha from 'react-recaptcha'

function Contact() {

	const [error, setError] = useState("")
	const [message, setMessage] = useState("")
	const [humanVerified, setHumanVerified] = useState(false)
	const { currentUser } = useAuth()

	var verifyCallback = function(response) {
		if(response){
			setHumanVerified(true)
		}
	};

	var onloadCallback = function() {
		console.log("grecaptcha is ready!")
	};

	function sendEmail(e) {
		e.preventDefault();
		if(humanVerified){
		emailjs.sendForm(
			process.env.REACT_APP_EMAIL_JS_SERVICE, 
			process.env.REACT_APP_EMAIL_JS_TEMPLATE, e.target, 
			process.env.REACT_APP_EMAIL_JS_USER
			)
			.then((result) => {
				if(result.text === "OK"){
					setMessage("Thanks, your message has been sent successful... We will answer you back as soon as possible")
				}
				else{setError("Ouups something wrong happened, Try again to send your message ...")}
			}, (error) => {
			console.log(error.text);
			});
		}else{alert("Please verify that your are a human !!")}
	}

  return (
	<>
		{currentUser != null ? <NavbarConnected/> : <Navbar />}
			<div className="background-topo3">
				<div className="container">
				{error && <Alert variant="danger" className="w-50 ml-3 mt-3">{error}</Alert>}
				{message && <Alert variant="success" className="w-50 ml-3 mt-3">{message}</Alert>}
					<Card className="w-100 mx-auto my-5 p-4" style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
						<h2 className="text-center text-info my-5 main-typo">Contact Us</h2>
						<p className="text-center text-muted">Do you want to add a sport in our list or manage your published Trips.</p>
						<p className="text-center text-muted">If you have any ideas of improvementys for our services and community.</p>
						<p className="text-center text-muted">Please don't hesitate to contact us for any kind of request or suggestion </p>
						<p className="text-center text-muted pb-5">We will answer you as soon as possible...</p>
						<h4 className="text-center text-light p-2 bg-info border rounded">
							Please fill out the form below to tell us what's on your mind
						</h4>
						<div  className="d-flex justify-content-center mt-5">
							<form className="contact-form" onSubmit={sendEmail}>
								<input type="hidden" name="contact_number" />
								<input type="hidden" name="auth_email" 
								value={currentUser != null ? currentUser.email : "No Auth"}/>
								<label className="light-blue d-flex mt-2 mb-1"><h5>Your Name :</h5></label>
								<input className="border border-rounded p-2 pr-5" type="text" 
								name="user_name" placeholder="Enter your name..."/>
								<label className="light-blue  d-flex mt-4 mb-1"><h5>Your Email :</h5></label>
								<input className="border border-rounded p-2 pr-5" type="email" 
								name="user_email" placeholder="Enter your email..."/>
								<label className="light-blue  d-flex mt-4 mb-1"><h5>Your Message :</h5></label>
								<textarea className="border border-rounded pt-2 pb-5 pr-5 pl-2" 
								name="message"  placeholder="Enter your message..."/>
								<div className="d-flex mt-3">
									<Button variant="info" className="mt-3 mb-5 p-2 px-4" type="submit">
										<MdLocalPostOffice className="mr-3" style={{fontSize: "1.2em"}}/>
										Send Message
									</Button>
								</div>
							</form>
						</div>
						<div className="mx-auto">
							<Recaptcha
								sitekey={`${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`}
								render="explicit"
								verifyCallback={verifyCallback}
								onloadCallback={onloadCallback}
							/>
						</div>
					</Card>
					<div className="w-100 text-left mt-5 mb-4">
					<Button variant="info">
						<Link to={currentUser != null ? "/dashboard" : "/"} className="text-light">
							<IoArrowBack className="mr-3"/>Back to Home page
						</Link>
					</Button>
					</div>
				</div>
			</div>
		{currentUser != null ? <Footer notConnected={false} /> : <Footer notConnected />}	
	</>
  );
}

export default Contact
