import React from 'react'
import { Card } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import NavbarConnected from '../components/NavbarConnected'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { IoArrowBack } from "react-icons/io5"
import { BsPersonLinesFill } from "react-icons/bs"


function PrivacyPolicy() {
	const { currentUser } = useAuth()

	return (
		<>
			{currentUser != null ? <NavbarConnected/> : <Navbar />}
			<div className="background-topo2">
				<div className="container">
					<Card className="w-100 mx-auto my-5" style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
						<Card.Body>
							<h2 className="text-center text-info my-5 main-typo">Privacy Policy</h2>
							<div className="d-flex"><BsPersonLinesFill className="mr-5 pb-4 text-info" style={{fontSize: "8em"}}/> 
							<p className="mb-4">
							The purpose of this Privacy Policy is to inform you of the means that Never Alone uses to process your personal data, 
							while respecting your rights. 
							It is possible to use Never Alone services without sharing personal data, but access to our database require a mandatory 
							registration for which the identifier is a validated email address or Google Account.
        					As a European company, Never Alone complies, in the collection and management of your personal data, with the GDPR that 
							came into effect in May 2018.
							</p></div>
							<h5 className="mt-4"><b className="text-info">Article 1 - </b> Acceptance of rules concerning the use of personal data :</h5>
							<p>By using any of the Never Alone services, you acknowledge that you have read and agree to these rules regarding the use of personal data. 
							If you disagree with them, please do not access the Never Alone sites.</p>
							<h5 className="mt-4"><b className="text-info">Article 2 - </b> Nature of personal data :</h5>
							<p>Personnal data are available publicly on the user's public profile with display of user Name, profile picture, city, Region, Country</p>
							<p>Your activities and level are display too as well as your post and blog's post</p>
							<p>Your email address and phone number won't be display publicly unless you post your contact detail on a public space such as trip post, comments or blog's post.</p>
							<p>You can comment a trip or a blog and this will be avalaible to all user of Never Alone.</p>
							<p>If you're looking for more privacy, you have acces to Private Message. It allow you to give your contact detail to someone without sharing these information publicly.</p>
							<p>Personal data includes any personally identifiable information that you deliberately provide when registering on Never Alone site. 
							Personal data includes "registration data", "usage data", “activity data” and “user contributions”:</p>
							<p>The registration data corresponds to the fields you fill in when you create or update your Never Alone account.
							A validated, personal and not “temporary” email address is mandatory.</p>
							<h5 className="mt-4"><b className="text-info">Article 3 - </b> Rights and responsibilities of users : Deletion of personal data :</h5>
							<p>In accordance with the GDPR, you can obtain communication and, if necessary, correction or deletion of 
							information about you. Your data is considered as highly confidential and no third-party can have access to it from us.</p>
							<p>You can remove your account at any time through your personal "My Profile"</p>
						</Card.Body>
						{currentUser != null ?
							<>
							<div className="w-100 text-center my-3">
								<Link to="/trip" className="link-comment p-2">Browse Map </Link>
							</div>
							<div className="w-100 text-center my-3">
								<Link to="/trip" className="link-comment p-2">Search Upcoming Trips </Link>
							</div>
							<div className="w-100 text-center my-3">
								<Link to="/trip" className="link-comment p-2">Post New Trip </Link>
							</div>
							<div className="w-100 text-center mt-5 mb-4">
								<Link to="/dashboard" className="text-info"><IoArrowBack className="mr-3"/>
									Back to Home page
								</Link>
							</div>
						</>
						:
						<>
							<div className="w-100 text-center mt-4">
								<b className="light-blue">Want to create an account ? </b>
								<Link to="/signup" className="link-comment ml-3 p-2">Sign In</Link>
							</div>
							<div className="w-100 text-center mt-4">
								<b className="light-blue">Already have an account ?</b> 
								<Link to="/login" className="link-comment ml-3 p-2">Log In</Link>
							</div>
							<div className="w-100 text-center mt-5 mb-4">
								<Link to="/" className="text-info"><IoArrowBack className="mr-3"/>
									Back to Home page
								</Link>
							</div>
						</>
						}
					</Card>
				</div>
			</div>
			{currentUser != null ? <Footer notConnected={false} /> : <Footer notConnected />}	
		</>
	)
}

export default PrivacyPolicy
