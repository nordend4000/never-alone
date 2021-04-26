import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TiThMenuOutline } from "react-icons/ti"
import { IoClose } from "react-icons/io5"
import { GiCompass } from "react-icons/gi"
import { ImProfile } from "react-icons/im"
import { FiArrowDown } from "react-icons/fi"
import '../styles/navbar.css'
import { Image, Row } from 'react-bootstrap'
import { db } from '../Firebase'
import { useAuth } from '../contexts/AuthContext'
import { RiArrowRightSLine } from "react-icons/ri"
import { SiOpenstreetmap } from "react-icons/si"
import { AiOutlinePicture } from "react-icons/ai"
import { ImBlog } from "react-icons/im"
import { GiWindsock } from "react-icons/gi"

function Navbar() {
	const [click, setClick] = useState(false)
	const [button, setButton] = useState(true)
	const { currentUser } = useAuth()
    const [readyUser, setReadyUser] = useState(false)
	const [responseUser, setResponseUser] = useState(null)
	const [width, setWidth] = useState(true)
	let email = currentUser.email

	useEffect(() => {
		const fetchDataUser = () => {
			try {
				db.collection('users').doc(email)
				.onSnapshot((snapshot) => {
					setResponseUser(snapshot.data())
					setReadyUser(true)
				})
			} catch (error) {
				console.log(error);
			}
		};
		fetchDataUser();
		
	}, [email]);

	const handleClick = () => setClick(!click)
	const closeMobileMenu = () => setClick(false)

	const showButton = () => {
		if(window.innerWidth <= 960){
			setButton(false)
			setWidth(false)
			if(click){
				setClick(false)
			}
			} else {
				setButton(true)
				setWidth(true)
			if(click){
				setClick(false)
			}
		}
	};

	useEffect(() =>{
		showButton();
		// eslint-disable-next-line
	}, []);

	window.addEventListener('resize', showButton);

    return (
        <>
        <nav className="navbar-connected">
		<div className="py-1 d-flex justify-content-end pr-3">
		{(readyUser && typeof(responseUser) != "undefined") ?
			<div className="">
				<Row>

					<small className="bluedark pr-1"><i className="mr-1">Welcome </i>
						{typeof(responseUser.userName) != "undefined" 
						? responseUser.userName 
						: currentUser.displayName
						}
					</small>
					{(responseUser.photoUrl === "" || responseUser.photoUrl == null) ? "" : 
					<Image src={responseUser.photoUrl} roundedCircle className="ml-1 mr-2 border border-light" 
					style={{"height" : "30px", "width" : "30px"}}/>
					}
				</Row>
			</div>
		:	<div className="">
		{width ?
				<Row className="mb-2">
					<h6 className="text-info mx-auto">Welcome 
						<small className="ml-1">{currentUser.email}</small>
					</h6>
					<h6 className="light-blue ml-3">
					<small>
						<FiArrowDown className="text-left light-blue mr-1"/>
						Set your Profile 
					</small>
					</h6>
				</Row>
				:
				<Row>
					<small className="text-info mx-auto">Welcome  <i>{currentUser.email}</i></small>
				</Row>
		}
			</div>
		}
		</div>
		<div>
		{!width ?
			<div className="ml-2 mb-5">
            <Link to="/dashboard" className="navbar-brand main-typo" onClick={closeMobileMenu}>
			<h4><GiCompass className="mr-3 "/> Never Alone </h4>
            </Link>
			</div>
			: " "
        }
		</div>
			<div className="navbar-container-connected">
			{width ?
				<div className="ml-2 mt-4">
				<Link to="/dashboard" className="navbar-brand main-typo" onClick={closeMobileMenu}>
				<h2><GiCompass className="mr-3 mt-1"/> Never Alone </h2>
				</Link>
				</div>
				: " "
			}
				<div className="menu-icon mr-n4 mt-4" onClick={handleClick}>
					{!click ?  <TiThMenuOutline/> : <IoClose/>}
				</div>
				{click ?
				<ul className="nav-menu active">
					<li className="nav-item">
						<Link to="/trips" className="nav-links" onClick={closeMobileMenu}>
						<GiWindsock className="ml-1 mr-4 mb-1"/>Latest Post<RiArrowRightSLine className="ml-5 bluedark" style={{fontSize: "1.6em"}}/>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/map" className="nav-links" onClick={closeMobileMenu}>
						<SiOpenstreetmap className="ml-1 mr-4 mb-1"/>Browse Map<RiArrowRightSLine className="ml-5 bluedark" style={{fontSize: "1.6em"}}/>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/new" className="nav-links" onClick={closeMobileMenu}>
						<ImBlog className="ml-1 mr-4 mb-1"/>Publish Trip<RiArrowRightSLine className="ml-5 bluedark" style={{fontSize: "1.6em"}}/>
						</Link>
						
					</li>
					<li className="nav-item">
						<Link to="/blog" className="nav-links" onClick={closeMobileMenu}>
						<AiOutlinePicture className="ml-1 mr-4 mb-1"/>Blog Post<RiArrowRightSLine className="ml-5 bluedark" style={{fontSize: "1.6em"}}/>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/profile" className="nav-links-mobile" onClick={closeMobileMenu}>
						<ImProfile className="mr-2" style={{fontSize: "1.2em"}}/>  My Profile</Link>
					</li>
				</ul>
				:
				<ul className="nav-menu">
					<li className="nav-item">
						<Link to="/trips" className="nav-links" onClick={closeMobileMenu}>
						Latest Post
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/map" className="nav-links" onClick={closeMobileMenu}>
						Browse Map
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/new" className="nav-links" onClick={closeMobileMenu}>
						Publish Trip
						</Link>
						
					</li>
					<li className="nav-item">
						<Link to="/blog" className="nav-links" onClick={closeMobileMenu}>
						Blog Post
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/profile" className="nav-links-mobile" onClick={closeMobileMenu}>
						<ImProfile className="mr-2" style={{fontSize: "1.2em"}}/>  My Profile</Link>
					</li>
				</ul>
				}
				{button && 
				<Link to="/profile" className="nav-links-profile text-center">
					<small className="profile">
						<ImProfile className="mr-2" style={{fontSize: "1.2em"}}/>  
						My Profile
					</small>
				</Link>
				}
			</div>
		</nav>
        </>
    )
}

export default Navbar
