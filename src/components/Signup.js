import React, {useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { IoArrowBack } from "react-icons/io5"
import useResize from '../contexts/useResize'
import { db } from '../Firebase'
import { v4 as uuidV4 } from 'uuid'


function Signup() {
	const emailRef = useRef()
	const passwordRef = useRef()
	const passwordConfirmRef = useRef()
	const { signup } = useAuth()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const history = useHistory()
	const resize = useResize()
	let medium = resize.medium

	const feedback = "Well done you successfully created your account. Now to get a better experience set your personal profile and you will be ready to start posting your first Trip and meet the Never Alone Community"
	
	let userId = uuidV4()
	let userName = "User " + userId.slice(0,10)

	async function handleSubmit(e){
		e.preventDefault()

		if(passwordRef.current.value !== passwordConfirmRef.current.value){
			return setError('Passwords do not match')
		}
        try {
			setError('')
			setLoading(true)
			await signup(emailRef.current.value, passwordRef.current.value)

			let profileUser = {
				userId: userId,
				photoUrl: "",
				displayName: "",
				email: emailRef.current.value,
				userName: userName,
				profileSet: false,
				country: "",
				area: "",
				city: "",
				phone: "",
				bio: "",
				newMessage: false,
				activities: {
					hiking : "unchecked",
					skiing: "unchecked",
					skiTouring: "unchecked",
					mountainering: "unchecked",
					rockClimbing: "unchecked",
					mountainBiking: "unchecked",
					kayaking: "unchecked",
					cycling: "unchecked",
					paragliding: "unchecked",
					hangliding: "unchecked",
					speedRiding: "unchecked",
					kiteSurfing: "unchecked",
					baseJumping: "unchecked",
					skyDiving: "unchecked",
					surfing: "unchecked",
					scubaDiving: "unchecked",
					snorkelling: "unchecked",
					slackLining: "unchecked",
					tennis: "unchecked",
					justBeer: "unchecked"
				}
			}
			db.collection('users').doc(emailRef.current.value).set(profileUser)
			history.push("/dashboard", { feedback: `${feedback}`})
		} catch {
			setError('Failed to create an account')
		}
		setLoading(false)
	}

	return (
		<>
			<Navbar />
			<div className="background-topo3">
				<div className="container d-flex justify-content-center">
					<Card className={medium ? "w-50 my-5 p-4" : "w-100 my-5"} style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
						<Card.Body>
							<h2 className="text-center text-info mb-5 main-typo">Sign Up</h2>
							{error && <Alert variant="danger">{error}</Alert>}
							<Form onSubmit={handleSubmit}>
								<Form.Group id ="email">
									<Form.Label className="light-blue"><h5>Email</h5></Form.Label>
									<Form.Control type="email" ref={emailRef} required/>
								</Form.Group>
								<Form.Group id ="password">
									<Form.Label className="light-blue"><h5>Password</h5></Form.Label>
									<Form.Control type="password" ref={passwordRef} required/>
								</Form.Group>
								<Form.Group id ="password-confirm">
									<Form.Label className="light-blue"><h5>Password Confirmation</h5></Form.Label>
									<Form.Control type="password" ref={passwordConfirmRef} required/>
								</Form.Group>
								<Button disabled={loading} variant="info" className="d-flex justify-content-center w-50 mx-auto mt-3" type="submit">
									Sign Up
								</Button>
							</Form>
						</Card.Body>
						<div className="text-center mt-4">
						Already have an account ? <Link to="/login" className="text-info">Connexion</Link>
						</div>
						<div className="text-center mt-3 mb-4">
							<Link to="/" className="text-info"><IoArrowBack className="mr-3"/>Back to Home page</Link>
						</div>
					</Card>
				
				</div>
			</div>
			<Footer notConnected />
		</>
	)
}

export default Signup

