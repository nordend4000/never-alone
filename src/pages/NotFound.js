import React from 'react'
import { Card } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import NavbarConnected from '../components/NavbarConnected'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { IoArrowBack } from "react-icons/io5"
import { FaMapSigns } from "react-icons/fa"


function NotFound() {
	const { currentUser } = useAuth()

	return (
		<>
			{currentUser != null ? <NavbarConnected/> : <Navbar />}
			<div className="background-topo2">
				<div className="container">
					<Card className="w-100 mx-auto my-5" style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
						<Card.Body>
							<h2 className="text-center text-info my-5 main-typo">PAGE NOT FOUND</h2>
							<h4><FaMapSigns className="mr-3" style={{fontSize: "3em"}}/> Ouupss Wrong Way : Page Not found </h4>
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

export default NotFound
