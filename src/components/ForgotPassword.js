import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { IoArrowBack } from "react-icons/io5"

function ForgotPassword() {
	const emailRef = useRef()

	const { resetPassword } = useAuth()
	const [error, setError] = useState('')
	const [message, setMessage] = useState('')
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e){
		e.preventDefault()
        try {
			setMessage('')
			setError('')
			setLoading(true)
			await resetPassword(emailRef.current.value)
			setMessage('Check your inbox for further instructions')
		} catch {
			setError('Failed to reset Password')
		}
		setLoading(false)
	}

	return (
		<>
			<Navbar />
			<div className="background-topo">
				<div className="container">
					<Card className="w-50 mx-auto my-5" style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
						<Card.Body>
						<h2 className="text-center text-info my-4 main-typo">Reset Password</h2>
							{error && <Alert variant="danger">{error}</Alert>}
							{message && <Alert variant="success">{message}</Alert>}
							<Form onSubmit={handleSubmit}>
								<Form.Group id ="email">
									<Form.Label>Email</Form.Label>
									<Form.Control type="email" ref={emailRef} required/>
								</Form.Group>
								<div className="d-flex justify-content-center mt-5">
								<Button disabled={loading} className="w-50" variant="info" type="submit">Reset Password</Button>
								</div>
							</Form>
							<div className="w-100 text-center mt-5">
								Login : <Link to="/login" className="text-info">Connexion</Link>
							</div>
						</Card.Body>
						<div className="w-100 text-center mt-2">
						Need an account ? <Link to="/signup" className="text-info">Sign Up</Link>
					</div>
					<div className="w-100 text-center mt-3 mb-4">
							<Link to="/" className="text-info"><IoArrowBack className="mr-3"/>Back to Home page</Link>
						</div>
					</Card>
				</div>
			</div>
			<Footer notConnected />
		</>
	)
}

export default ForgotPassword
