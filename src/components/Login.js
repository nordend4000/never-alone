import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { IoArrowBack } from "react-icons/io5"
import useResize from '../contexts/useResize'


function Login() {
	const emailRef = useRef()
	const passwordRef = useRef()
	const { login, socialSignIn } = useAuth()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const history = useHistory()
	const resize = useResize()
	let medium = resize.medium

	async function handleSubmit(e){
		e.preventDefault()
        try {
			setError('')
			setLoading(true)
			await login(emailRef.current.value, passwordRef.current.value)
			history.push("/dashboard")
		} catch {
			setError('Failed to log in')
		}
		setLoading(false)
	}
	
	async function handleGoogleSignIn(e){
		e.preventDefault()
        try {
			setError('')
			setLoading(true)
			await socialSignIn("google")
			history.push("/dashboard")
		} catch {
			setError('Failed to log in')
		}
		setLoading(false)
	}

	return (
		<>
			<Navbar />
			<div className="background-topo2">
				<div className="container">
					<Card className={medium ? "w-50 my-5 p-2 mx-auto" : "w-100 my-5"} 
					style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
						<Card.Body>
							<div className="d-flex justify-content-center">
								<FcGoogle className="mb-4" style={{fontSize: "3em"}}/>
							</div>
							<div className="d-flex justify-content-center">
								<Button disabled={loading} className="w-50" variant="info" onClick={handleGoogleSignIn}>
									Log In with Google
								</Button>
							</div>
						</Card.Body>
					</Card>
					<Card className={medium ? "w-50 my-5 p-4 mx-auto" : "w-100 my-5"} 
					style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
						<Card.Body>
						<h2 className="text-center text-info mb-4 main-typo">Log In</h2>
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
								<div className="d-flex justify-content-center mt-3">
									<Button disabled={loading} className="w-50" variant="info" type="submit">
										Connexion
									</Button>
								</div>
							</Form>
							<div className="w-100 text-center mt-5">
								<Link to="/forgot-password" className="text-info">Forgot Password ?</Link>
							</div>
						</Card.Body>
						<div className="w-100 text-center mt-4">
							Need an account ? <Link to="/signup" className="ml-2 text-info">Sign Up</Link>
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

export default Login

