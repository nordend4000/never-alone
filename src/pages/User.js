import React, { useEffect, useState } from 'react'
import { Card, Alert, Image } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import NavbarConnected from '../components/NavbarConnected'
import Footer from '../components/Footer'
import "react-datepicker/dist/react-datepicker.css"
import { v4 as uuidV4 } from 'uuid'
import { GiCompass } from "react-icons/gi"
import { db } from '../Firebase'
import ACTIVITIES from '../ressources/activities.js'
import { BiMessageRoundedEdit } from "react-icons/bi"
import ModalSendPrivateMessage  from '../components/ModalSendPrivateMessage'
import useResize from '../contexts/useResize'

// Fetch Data from database ==> Trips List
function useListTrips(IdUser) {
	const [listTrips, setListTrips] = useState([])
	useEffect(() => {
	const unsubscribe = db.collection("newTrip")
	.where("userId", "==", IdUser)
	.onSnapshot((snapshot) => {
		const trips = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}))
		setListTrips(trips)
	})
	return () => unsubscribe()
	}, [IdUser])
	return listTrips
}
// Fetch Data from database ==> Blog List
function useListBlog(IdUser) {
	const [listBlog, setListBlog] = useState([])
	useEffect(() => {
	const unsubscribe = db.collection("blog")
	.where("userId", "==", IdUser)
	.onSnapshot((snapshot) => {
		const trips = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}))
		setListBlog(trips)
	})
	return () => unsubscribe()
	}, [IdUser])
	return listBlog
}

function User(props) {
	const IdUser = (props.history.location.search).substring(1)
	const [message, setMessage] = useState("")
	const [error, setError] = useState("")
	const [responseCurrentUser, setResponseCurrentUser] = useState(null)
	const [dataUser, setDataUser] =useState(null)
	const [readyUser, setReadyUser] =useState(null)
	const dataListTrips = useListTrips(IdUser)
	const dataListBlog = useListBlog(IdUser)
	const history = useHistory()
	const { currentUser } = useAuth()
	let email = currentUser.email
	const resize = useResize()
	let large = resize.large
	let medium = resize.medium
	let small = resize.small

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [error, message])

	useEffect(() => {
				db.collection('users').where("userId", "==", IdUser)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						console.log(doc.id, " => ", doc.data())
						setDataUser(doc.data());
						setReadyUser(true)
					});
				})
				.catch((error) => {
					console.log("Error getting documents: ", error)
				});

		const fetchDataUser = async () => {
			try {
				db.collection('users').doc(email)
				.onSnapshot((snapshot) => {
					console.log("snaphot current user for user profil modal private message ====> ",snapshot.data())
					setResponseCurrentUser(snapshot.data())
				})
			} catch (error) {
				console.log(error);
			}
		};
		fetchDataUser();
			
	}, [IdUser, email]);

	function handleClickTrip(tripId){
		history.push(`/post?${tripId}`)
	}
	function handleClickBlog(){
		history.push("/blog")
	}

	return (
		<>
			<NavbarConnected />
			<div className="background-topo3">
				<div className="container">
					{error && 
					<Alert variant="danger" 
					className={!medium && !large ? "w-100 ml-3 mt-3" : "w-50 ml-3 mt-3"}>
						{error}
					</Alert>
					}
					{message && 
					<Alert variant="success"
					className={!medium && !large ? "w-100 ml-3 mt-3" : "w-50 ml-3 mt-3"}>
						{message}
					</Alert>
					}
					<div className={medium  || large ? "d-flex flex-wrap justify-content-around mt-4" : "mt-4"}>
					{readyUser &&
						<Card key={uuidV4()} className={large ? "w-50 p-2 m-1 mt-3" : 
						(medium ? "w-75 mt-3" : "w-100 mb-2 mx-auto")}
						style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
							<Card.Body>
								<Card.Title className="d-flex justify-content-center text-capitalize mb-5 pb-4 border-bottom border-info ">
									<h3 className={!medium && !large 
									? "text-info text-center display-5 main-typo mb-2" 
									: "text-info text-center display-4 main-typo mb-2"
									}>Public Profile </h3>
								</Card.Title>
								<div className="border border-light p-4">
									<Card.Subtitle className="d-flex justify-content-center flex-wrap mb-4 text-muted text-capitalize">
										{(dataUser.photoUrl === "") ? "" : 
										<Image className="mt-2 border border-light" src={dataUser.photoUrl} 
										roundedCircle style={{maxHeight: "50px"}}/>
										}
										<h2 className="ml-3 mt-2 light-blue bgtrans py-2 px-5 rounded-pill">
											{dataUser.userName}
										</h2>
									</Card.Subtitle>
									<Card.Text>
										{medium ?
										<h4 className="light-blue mb-3 mt-5 main-typo"><GiCompass className="mr-3"/>
											PROFILE :
										</h4>
										:
										<h5 className="light-blue mb-3 mt-5 main-typo"><GiCompass className="mr-3"/>
											PROFILE :
										</h5>
										}
										<p><b className="mr-3 pt-2 text-info">Country : </b>{dataUser.country}</p>
										<p><b className="mr-3 pt-2 text-info">Region / State : </b>{dataUser.area}</p>
										<p><b className="mr-3 pt-2 text-info">City : </b>{dataUser.city}</p>
										<p><b className="mr-3 pt-2 text-info">Bio : </b>
											<Card className={small ? "w-100 mt-3 p-2" : "w-75 ml-5 p-3 mt-3" }
											style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}}>
												<BiMessageRoundedEdit className="mx-2 mb-2 text-info"/>{dataUser.bio}
											</Card>
										</p>
									</Card.Text>
									<Card.Text>
									{medium ?
										<h4 className="light-blue mb-3 mt-5 main-typo"><GiCompass className="mr-3"/>
											ACTIVITIES :
										</h4>
										:
										<h5 className="light-blue mb-3 mt-5 main-typo"><GiCompass className="mr-3"/>
											ACTIVITIES :
										</h5>
										}
										{ACTIVITIES.map(sport =>(
											<ul key={uuidV4()} className="ml-n4">
												{dataUser.activities[sport] !== "unchecked" &&
												<li className="text-info text-capitalize">
													<b>{sport.replace(/([a-z])([A-Z])/g, '$1 $2')} :</b>  
													<i className="text-dark ml-2">{dataUser.activities[sport]}</i>
												</li>
												}
											</ul>
										))}
									</Card.Text>
								</div>
								<ModalSendPrivateMessage 
										fromUserId={responseCurrentUser.userId} 
										fromUserName={responseCurrentUser.userName} 
										fromEmail={responseCurrentUser.email}
										toEmail={dataUser.email}
										toUserId={dataUser.userId} 
										toUserName={dataUser.userName} 
										setError={setError}
										setMessage={setMessage}
										tripId="direct message"
										activity="direct message"
										date="direct message"
									/>
							</Card.Body>
						</Card>
					}
					</div>
					{(readyUser && dataListTrips != null) &&
					<>
						<div className={medium ? "w-75 p-1 m-1 my-5 mx-auto linked" : "w-100 p-1 m-1 my-5 mx-auto linked"} 
						style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
							{medium ?
							<h4 className="light-blue mb-3 mt-5 main-typo text-center"><GiCompass className="mr-3"/>
								UPCOMING TRIPS :
							</h4>
							:
							<h5 className="light-blue mb-3 mt-5 main-typo text-center"><GiCompass className="mr-3"/>
								UPCOMING TRIPS 
							</h5>
							}					
							<p className="ml-5 mx-auto text-muted text-center">
							{dataListTrips.length > 0 
							?  <i>Click to open a trip posted by {dataUser.userName}</i>
							: <i>{dataUser.userName} don't have any trip at the moment</i>
							}
							</p>
							{dataListTrips.map(trip =>(
								<Card className="p-2 m-3 text-center" key={uuidV4()} 
								style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}} 
								onClick={() => handleClickTrip(trip.id)}>
									<Card.Text>
										<h5 className="main-typo text-info text-capitalize">
											{trip.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}
										</h5>
										<p className="light-blue">{trip.date.stringDate}</p>
										<small>{trip.spot} {trip.area} {trip.country}</small>
									</Card.Text>
								</Card>
							))}
						</div>
					</>
					}
					{(readyUser && dataListBlog != null) &&
					<>
						<div className={medium ? "w-75 p-1 m-1 my-5 mx-auto linked" : "w-100 p-1 m-1 my-5 mx-auto linked"} 
						style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
							{medium ?
							<h4 className="light-blue mb-3 mt-5 main-typo text-center"><GiCompass className="mr-3"/>
								Blog's Post :
							</h4>
							:
							<h5 className="light-blue mb-3 mt-5 main-typo text-center"><GiCompass className="mr-3"/>
								Blog's Post :
							</h5>
							}					
							<p className="ml-5 mx-auto text-muted text-center">
							{dataListBlog.length > 0 
							?  <i>Click to open a Blog's post published by {dataUser.userName}</i>
							: <i>{dataUser.userName} don't have any blog's post at the moment</i>
							}
							</p>
							{dataListBlog.map(blog =>(
								<Card className="p-2 m-3 text-center" key={uuidV4()} 
								style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}} 
								onClick={() => handleClickBlog()}>
									<Card.Text>
										<h5 className="main-typo text-info text-capitalize">
											{blog.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}
										</h5>
										<p className="light-blue">{blog.date.stringDate}</p>
										<small>{blog.spot} {blog.area} {blog.country}</small>
									</Card.Text>
								</Card>
							))}
						</div>
					</>
					}
				</div>
			</div>
			<Footer/>
		</>
	)
}

export default User

