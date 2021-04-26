import React from 'react'
import { Card } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import NavbarConnected from '../components/NavbarConnected'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { IoArrowBack } from "react-icons/io5"

function About() {
	const { currentUser } = useAuth()

	return (
		<>
			{currentUser != null ? <NavbarConnected/> : <Navbar />}
			<div className="background-topo">
				<div className="container">
					<Card className="w-100 mx-auto my-5" style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
						<Card.Body>
							<h2 className="text-center text-info my-5 main-typo">About Us</h2>
							<p className="text-muted">
								We develop <b>Never Alone</b> to allow people to connect each other while practicing the same activties.
								Never Alone focus on outdoor activities such as hiking, mountain biking or skiing. 
								More specific sports like hangliding, mountainering or base jump require logistic and organisation.
								Other sports like paragliding, scuba diving or rock climbing are safer to practise as a group.
								Water is your element don't worries, we cover water sports like snorkelling, scuba diving or surfing.
								You don't need to be expert to test new sensations and to feel the freedom of outdoor sports.
								If you want to share your passion you can tutor a begginer and lights the flame of passion.
								If you want to learn more skills and develop new abilities you can benefit from the experience of other.
								You want to socialize with people doing the same activities as you
								Never Alone is done for you. 
								Doesn't matter if you'are at home or on holdays, on your confort zone or travelling the world. 
								Wherever you are you can meet with locals or just people at the right spot at the right time 
								for an anthology session of your favorite sport.
							</p>
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

export default About
