import React, { useState, useEffect } from 'react'
import { Button, Alert, Col } from 'react-bootstrap'
import BlogCard from './BlogCard'
import BlogForm from './BlogForm'
import Footer from './Footer'
import NavbarConnected from './NavbarConnected'
import { db } from '../Firebase'
import { useAuth } from '../contexts/AuthContext'
import useResize from '../contexts/useResize'
import { Link } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import { MdLocalPostOffice } from 'react-icons/md'
import '../styles/app.css';

function Blog(props) {

	const { currentUser } = useAuth()
	const [readyUser, setReadyUser] = useState(false)
	const [responseUser, setResponseUser] = useState(null)
	const [count, setCount] = useState(0)
	const [message, setMessage] = useState("")
	const [error, setError] = useState("")
	const [openBlogForm, setOpenBlogForm] = useState(false)
	const resize = useResize()
	let email = currentUser.email

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
		fetchDataUser()
	}, [email])

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [count])
	
	return (
		<>
			<NavbarConnected/>
			<div className="background-topo">
				<div className="container">
				{error && <Alert className={!resize.medium ? "w-100 ml-3 mt-3" : "w-50 ml-3 mt-3"} variant="danger">
					{error}
				</Alert>}
				{message && <Alert className={!resize.medium ? "w-100 ml-3 mt-3" : "w-50 ml-3 mt-3"} variant="success">
					{message}
				</Alert>}
				{typeof(props.history.location.state) !== "undefined" &&
					<Alert className={!resize.medium && !resize.large ? "w-100 mx-auto mt-3" : "w-50 ml-3 mt-3"}
					variant={props.history.location.state.variant}>
						{props.history.location.state.feedback}
					</Alert>
				}
				{readyUser && !openBlogForm ?
				<div className={!resize.medium ? "d-flex flex-wrap justify-content-center" : "d-flex flex-wrap justify-content-start"}>
					<Button className={ resize.medium ? "w-25 text-light text-center mt-2 p-1" : "w-50 text-light text-center mt-2 p-1"}
							onClick={() => setOpenBlogForm(!openBlogForm)} variant="info" >
						<MdLocalPostOffice className="mr-3 mb-1" style={{fontSize: "1.2em"}}/> 
						Publish New Post
					</Button>
				</div>
				: 
				<BlogForm dataUser={responseUser} setCount={setCount} setError={setError} 
							setMessage={setMessage} medium={resize.medium} large={resize.large}/> 
				}
				{readyUser && <BlogCard medium={resize.medium} large={resize.large} small={resize.small}/>}
				{typeof(props.history.location.state) !== "undefined" &&
					<Alert className={!resize.medium ? "w-100 ml-3 mt-3" : "w-50 ml-3 mt-3"}
					variant={props.history.location.state.variant}>
						{props.history.location.state.feedback}
					</Alert>
				}
				{readyUser && !openBlogForm ?
				<div className="d-flex flex-wrap justify-content-center" id="publish-new-blog">
					<Button className={ resize.medium ? "w-50 text-light text-center my-5 p-3" : "w-75 text-light text-center my-5 p-2"}
							onClick={() => setOpenBlogForm(!openBlogForm)} variant="info" >
						<MdLocalPostOffice className="mr-3 mb-1" style={{fontSize: "1.2em"}}/> 
						Publish New Post
					</Button>
				</div>
				: 
				<BlogForm dataUser={responseUser} setCount={setCount} setError={setError} 
							setMessage={setMessage} medium={resize.medium} large={resize.large}/> 
				}
				<Col>
						<Button variant="info" className="w-10 text-center my-3 mb-5">
							<Link className="text-light" to="/trips">
								<IoArrowBack className="mr-2" style={{fontSize: "1.2em"}}/> 
								Back
							</Link>
						</Button>
					</Col>
				</div>
			</div>
			<Footer/>
		</>
	)	
}	

export default Blog
