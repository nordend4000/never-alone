import React, { useState, useEffect } from 'react'
import { Button, Alert, Col } from 'react-bootstrap'
import TripCard from './TripCard'
import TripForm from './TripForm'
import NavbarConnected from './NavbarConnected'
import Footer from './Footer'
import { db } from '../Firebase'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5"
import { MdLocalPostOffice } from 'react-icons/md'
import '../styles/app.css'
import useResize from '../contexts/useResize'

function Trips(props) {

	const { currentUser} = useAuth()
	const [readyUser, setReadyUser] = useState(false)
	const [responseUser, setResponseUser] = useState(null)
	const [count, setCount] = useState(0)
	const [message, setMessage] = useState("")
	const [error, setError] = useState("")
	const [openTripForm, setOpenTripForm] = useState(false)
	let email = currentUser.email
	const resize = useResize()
	let large = resize.large
	let medium = resize.medium
	let small = resize.small

	useEffect(() => {
		const fetchDataUser = () => {
			try {
				db.collection('users').doc(email)
				.onSnapshot((snapshot) => {
					console.log(snapshot.data())
					setResponseUser(snapshot.data())
					setReadyUser(true)
				})
			} catch (error) {
				console.log(error)
			}
		};
		fetchDataUser();
	}, [email])

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [count])

	return (
		<>
			<NavbarConnected/>
			<div className="background-topo3">
				<div className="container">
					<div className="pb-5">
						{typeof(props.history.location.state) !== "undefined" &&
							<Alert className={!medium && !large ? "w-100 mx-auto mt-3" : "w-50 ml-3 mt-3"}
							variant={props.history.location.state.variant}>
								{props.history.location.state.feedback}
							</Alert>
						}
						{error && <Alert className={!medium && !large ? "w-100 mx-auto mt-3" : "w-50 ml-3 mt-3"}
						variant="danger">{error}</Alert>}
						{message && <Alert className={!medium && !large ? "w-100 mx-auto mt-3" : "w-50 ml-3 mt-3"}
						variant="success">{message}</Alert>}
						{readyUser && <TripCard medium={medium} large={large} small={small}/>}
						{readyUser && !openTripForm ?
						<div className="d-flex flex-wrap justify-content-center">
							<Button variant="info" 
							className={!medium && !large ? "w-75 text-light text-center my-5 p-3" : "w-50 text-light text-center my-5 p-3" }
							onClick={() => setOpenTripForm(!openTripForm)}>
								<MdLocalPostOffice className="mr-3" style={{fontSize: "1.2em"}}/> 
								Post a new Trip
							</Button>
						</div>
						: 
						<TripForm dataUser={responseUser} setCount={setCount} setError={setError} 
									setMessage={setMessage} medium={medium} large={large} small={small}/> 
						}
						<Col>
							<Button variant="info" className="w-10 text-center my-3">
								<Link className="text-light" to="/dashboard">
									<IoArrowBack className="mr-2" style={{fontSize: "1.2em"}}/> 
									Back
								</Link>
							</Button>
						</Col>
					</div>
				</div>
			</div>
			<Footer/>
		</>
	)
}		

export default Trips
