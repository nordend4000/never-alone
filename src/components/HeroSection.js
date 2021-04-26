import React from 'react';
import { Link } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import '../styles/heroSection.css'


function HeroSection(props) {

	const medium = props.medium
	const large = props.large
	const small = props.small
	const feedback = props.feedback
	
	return (
		<>
		{small && typeof(feedback) != "undefined" &&
			<Alert className="w-100 mb-n3"
			variant="success">
				<small>{feedback}</small>
			</Alert>
		}
		<div className="hero-container">
			<video src={process.env.PUBLIC_URL + "/videos/video-1.mp4"} autoPlay loop muted />
			<div className="d-flex justify-content-start">
			{typeof(feedback) != "undefined" &&
			<>
				{(medium) &&
				<Alert className="w-100 mx-2 mt-2"
				variant="success">
					{feedback}
				</Alert>
				}
			</>
			}
			</div>
				<p className="red-text text-center pt-4 px-1">SAFETY - SOCIALIZING - SHARING - LEARNING - TUTORING</p>
				<h6 className="mt-0 mb-4">Looking for people to share your outdoors Activities ?</h6>
				<h1 className="mt-4 mb-2 text-center main-typo">Never Alone</h1>
				<h6 className="px-5">Whatever your reasons just get started ...</h6>
				<span className="hero-btns">
					<button className={!medium && !large ? "p-3 btn-home" : " px-5 py-3 btn-home"}>
						<Link to={props.btn1path} className="link-btn-home">{props.btn1}</Link>
					</button>
					<button className={!medium && !large ? "p-3 btn-home" : " px-5 py-3 btn-home"}>
						<Link to={props.btn2path} className="link-btn-home">{props.btn2}</Link>
					</button>
				</span>
		</div>
		</>
	)
}

export default HeroSection
