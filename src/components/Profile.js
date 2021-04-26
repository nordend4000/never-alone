import React, { useState, useEffect} from 'react'
import UpdateLogin from './UpdateLogin'
import UpdateProfile from './UpdateProfile'
import UpdateActivities from './UpdateActivities'
import { db } from '../Firebase'
import { Card, Row, Alert, Image, Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5"
import { AiOutlineLogout } from "react-icons/ai"
import NavbarConnected from './NavbarConnected'
import Footer from './Footer'
import ModalPhotoProfile from './ModalPhotoProfile'
import ModalProfile from './ModalProfile'
import ModalDeletAccount from './ModalDeletAccount'
import { BiMessageRoundedEdit } from "react-icons/bi"
import useResize from '../contexts/useResize'


function Profile(props) {
	const { currentUser, logout } = useAuth()
	const [ready, setReady] = useState(false)
	const [count, setCount] = useState(0)
	const [profileSet, setProfileSet] = useState(true)
	const [response, setResponse] = useState(null)
	const [message, setMessage] = useState("")
	const [error, setError] = useState("")
	const history = useHistory()
	let email = currentUser.email
	const resize = useResize()
	let large = resize.large
	let medium = resize.medium

	useEffect(() => {
		const fetchData = () => {
			try {
				db.collection('users').doc(email)
				.onSnapshot((snapshot) => {
					setResponse(snapshot.data());
					setReady(true)
					setProfileSet(snapshot.data().profileSet)
				})
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();

	}, [email]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [count])

	async function handleLogout() {
		setError('')
        try {
			await logout()
			history.push("/")
		} catch {
			setError('Failed to log out')
		}
	}

	return (
		<>
			<NavbarConnected/>
			<div className="background-topo2">
				<div className="container">
					<div className="d-flex justify-content-end mr-3 mt-3" >
						<Button className={!medium && !large 
								? "text-light border border-info rounded-pill w-50" 
								: "text-light border border-info rounded-pill w-25" }
								style={{backgroundColor: 'rgba(31, 129, 140, 0.7)'}}
								variant="link" onClick={handleLogout}
						>
							<AiOutlineLogout className="mr-3" style={{fontSize: "1.2em"}}/>
							<b>Log Out </b>
						</Button>
					</div>
					{typeof(props.history.location.state) !== "undefined" &&
						<Alert className={!medium && !large ? "w-100 mx-auto mt-3" : "w-50 ml-3 mt-3"} 
						variant={props.history.location.state.variant}>
							{props.history.location.state.feedback}
						</Alert>
					}
					{error && 
					<Alert variant="danger" className={!medium && !large ? "w-100 mx-auto mt-3" : "w-50 ml-3 mt-3"}>
						{error}
					</Alert>}
					{message && 
					<Alert variant="success" className={!medium && !large ? "w-100 mx-auto mt-3" : "w-50 ml-3 mt-3"}>
						{message}
					</Alert>}
					{(ready && response != null && profileSet) &&
						<>
						<div className="d-flex justify-content-center">
							<Card className="p-1 m-1 mt-5" style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
								<Card.Body>
									<Card.Title className="d-flex justify-content-center text-capitalize mb-5 pb-4 border-bottom border-info ">
										<h3 className={!medium && !large 
										? "text-info text-center display-5 main-typo" 
										: "text-info text-center display-4 main-typo"
										}>My Profile </h3>
									</Card.Title>
									<div className={!medium && !large ? "d-flex flex-wrap" : "d-flex justify-content-around"}>
										<div className="mx-auto p-3">
											<Card.Subtitle className="d-flex justify-content-center mb-4 text-muted text-capitalize">
												{(response.photoUrl === "" || response.photoUrl == null) ? "" : 
												(<>
													{!medium && !large ?
													<>
														<Image className="mt-3 mr-2 border border-light" src={response.photoUrl} 
														roundedCircle 
														style={{"height" : "40px", "width" : "40px"}}/>
													</>
													:
													<>
														<Image className="mt-2 border border-light" src={response.photoUrl} 
														roundedCircle 
														style={{"height" : "50px", "width" : "50px"}}/>
													</>
													}
												</>)
												}
												{!medium && !large ?
													<h4 className="light-blue bgtrans py-2 px-5 rounded-pill">
														{response.userName}
													</h4>
													:
													<h2 className="ml-3 mt-2 light-blue bgtrans py-2 px-5 rounded-pill">
														{response.userName}
													</h2>
												}
											</Card.Subtitle>
											<Card.Text>
												<p><b className="mr-3 pt-2 text-info">Country : </b>{response.country}</p>
												<p><b className="mr-3 pt-2 text-info">Region / State : </b>{response.area}</p>
												<p><b className="mr-3 pt-2 text-info">City : </b>{response.city}</p>
												<p><b className="mr-3 pt-2 text-info">E-mail : </b>{response.email}</p>
												<p><b className="mr-3 pt-2 text-info">Phone : </b>{response.phone}</p>
												<p><b className="mr-3 pt-2 text-info">Bio : </b>
													{response.bio !== "" &&
														<Card className=" mx-auto p-3 mt-3" style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}>
															<BiMessageRoundedEdit className="mx-2 mb-2 text-info"/>{response.bio}
														</Card>
													}
												</p>
											</Card.Text>
											<ModalPhotoProfile email={email} setError={setError} setMessage={setMessage} setCount={setCount}/>
										</div>
										<Card.Text className="mx-auto">
											<ModalProfile userId={response.userId} userEmail={email} newMessage={response.newMessage} 
											/>			
										</Card.Text>
									</div>
								</Card.Body>
							</Card>
						</div>
						<div className="text-capitalize mt-5 p-4" style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}>
							<div className="d-flex justify-content-center text-capitalize mb-5 pb-4 border-bottom border-info ">
								<h3 className={!medium && !large 
									? "text-info text-center display-5 main-typo mb-3" 
									: "text-info text-center display-4 main-typo mb-3"
									}>My Activities </h3>
							</div>
							<p className="d-flex justify-content-center red-text"><b>Which activities are you doing ? </b></p>
							<p className="d-flex justify-content-center red-text"><b>What's your level of practise ? </b></p>
							<p className="text-center mt-2 mb-1"><i>If you changed your settings remember to save ? </i></p>
						</div>
						<Row className="d-flex justify-content-center">
							<UpdateActivities medium={medium} large={large} data={response} setCount={setCount} 
							setError={setError} setMessage={setMessage}/> 
						</Row>
						<div className={!medium && !large ? "text-center p-2 mx-auto mt-5" : "w-50 p-2 mx-auto mt-5"} 
						style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}>
							<p className="d-flex justify-content-center mb-1">
								<i>Need to update your personnal details ?</i>
							</p>
						</div>
						<Row>
							<UpdateProfile medium={medium} large={large} data={response} setCount={setCount} 
							setError={setError} setMessage={setMessage}/>
						</Row>
					</>
					}
					{(ready && response != null && !profileSet) && // profileSet False ==> first setting
					<>
					<div className="d-flex justify-content-center">
						<Card  className="p-1 m-1 mt-5" style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
							<Card.Body>
							<Card.Title className="d-flex justify-content-center text-capitalize mb-4 pb-4 border-bottom border-info ">
								<h3 className={!medium && !large 
									? "text-info text-center display-5 main-typo" 
									: "text-info text-center display-4 main-typo"
									}>My Profile </h3>
							</Card.Title>
							<Card.Subtitle className="d-flex justify-content-center mb-4 text-muted">
							<h5 className="light-blue text-center">Welcome in your Personal Profile </h5>
								{currentUser.photoURL != null && <Image src={currentUser.photoURL} roundedCircle 
								style={{"height" : "50px", "width" : "50px"}}/>
								}
								<h5 className="ml-3 mt-2 text-info text-capitalize">{currentUser.displayName}</h5>
							</Card.Subtitle>
							<p className="d-flex justify-content-center text-muted my-2">{currentUser.email}</p>
							<div className="w-100 d-flex justify-content-center">
								<small className="mt-3">
									To get a better experience, please set below your personal details.  
								</small>
							</div>
							<div className="w-100 d-flex justify-content-center">
								<small className="mt-3">
									Then you will be able to set your activities and level
								</small>
							</div>
							</Card.Body>
						</Card>
					</div>
					<div className={!medium && !large ? "text-center p-2 mx-auto mt-5" : "w-50 p-2 mx-auto mt-5"} 
					style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}>
						<p className="d-flex justify-content-center mb-1"><i>First set your Personnal detail :</i></p>
					</div>
						<Row>
							<UpdateProfile medium={medium} large={large} data={response} 
							setCount={setCount} setError={setError} setMessage={setMessage}/>
						</Row>
					</>
					}
					<div className={!medium && !large ? "text-center p-2 mx-auto mt-5" : "w-50 p-2 mx-auto mt-5"} 
					style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}>
						<p className="d-flex justify-content-center mb-1">
							<i>Need to change your login or password ?</i>
						</p>
					</div>
					<Row>
						<UpdateLogin medium={medium} large={large}/>
					</Row>
					<Button variant="info" className="w-10 text-center my-3 ml-5">
						<Link className="text-light" to="/dashboard">
							<IoArrowBack className="mr-2" style={{fontSize: "1.2em"}}/> 
							Back
						</Link>
					</Button>
					<ModalDeletAccount email={email} setError={setError} setMessage={setMessage} setCount={setCount}/>
					</div>
				</div>
			<Footer/>
		</>
		
	)
}

export default Profile
