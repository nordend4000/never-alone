import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom'
import { HiOutlineSaveAs } from "react-icons/hi"

function UpdateLogin(props) {
	// Using Firebase auth
	const emailRef = useRef()
	const passwordRef = useRef()
	const passwordConfirmRef = useRef()

	const { currentUser, updateEmail, updatePassword } = useAuth()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const history = useHistory()
	const medium = props.medium
	const large = props.large

	function handleSubmitLogin(e){
		e.preventDefault()

		if(passwordRef.current.value !== passwordConfirmRef.current.value){
			return setError('Passwords do not match')
		}

		const promises = []
		setLoading(true)
		setError('')
		if(emailRef.current.value !== currentUser.email){
			promises.push(updateEmail(emailRef.current.value))
		}
		if(passwordRef.current.value !== currentUser.password){
			promises.push(updatePassword(passwordRef.current.value))
		}

		Promise.all(promises).then(() => {
			history.push('/')
		}).catch(() => {
			setError('Failed to update account')
		}).finally(() => {
			setLoading(false)
		})
	}

	return (
		<>
		<div className={ !medium && !large ? "mx-auto mt-3" : "w-75 mx-auto my-3"}>
			<Card className=""  style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
				<Card.Body>
					<h3 className={!medium && !large 
						? "text-info text-center display-5 main-typo mb-5" 
						: "text-info text-center display-4 main-typo mb-5"
						}>Update Login</h3>
					{error && <Alert variant="danger">{error}</Alert>}
					<Form onSubmit={handleSubmitLogin}>
						<Form.Group id ="email">
							<Form.Label className="light-blue"><h5>Change my Email</h5></Form.Label>
							<Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email}/>
						</Form.Group>
						<Form.Group id ="password">
							<Form.Label className="light-blue"><h5>Change my Password</h5></Form.Label>
							<Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same"/>
						</Form.Group>
						<Form.Group id ="password-confirm">
							<Form.Label className="light-blue"><h5>New Password Confirmation</h5></Form.Label>
							<Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same"/>
						</Form.Group>
						<div className="w-100 d-flex justify-content-center">
							<Button variant="info" disabled={loading}  type="submit"
							className={!medium && !large ? "w-75 my-3 p-2" :"w-25 my-3 p-2"}>
								<HiOutlineSaveAs className="mr-3" style={{fontSize: "1.2em"}}/> Update Login
							</Button>
						</div>			
					</Form>
				</Card.Body>
			</Card>
			</div>
		</>
	)
}

export default UpdateLogin
