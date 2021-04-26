import React from 'react'
import { Card } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import NavbarConnected from '../components/NavbarConnected'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { IoArrowBack } from "react-icons/io5"
import { BsPersonLinesFill } from "react-icons/bs"


function TermsConditions() {
	const { currentUser } = useAuth()

	return (
		<>
			{currentUser != null ? <NavbarConnected/> : <Navbar />}
			<div className="background-topo2">
				<div className="container">
					<Card className="w-100 mx-auto my-5" style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
						<Card.Body>
							<h2 className="text-center text-info my-5 main-typo">Terms and Condition</h2>
							<div className="d-flex"><BsPersonLinesFill className="mr-5 pb-4   text-info" style={{fontSize: "8em"}}/> 
							<p className="mb-4">
							The purpose of these terms & conditions are to inform you of the condition of use of our service. Just to make sure people undestand
							that personal responsability is essential while practicing outdoor activities. Never Alone can't be responsable for any incident or damage happening to someone using
							our service to meet people. Never Alone encourage user to onwn there personnal insurance for safety rescu and medical assistance.
							</p></div>
							<h5 className="mt-4"><b className="text-info">Article 1 - </b> Acceptance of rules concerning the use of terms & conditions :</h5>
							<p>By using any of the Never Alone services, you acknowledge that you have read and agree to these rules regarding the conditions of use. 
							If you disagree with them, please do not access the Never Alone sites.</p>
							<h5 className="mt-4"><b className="text-info">Article 2 - </b> Community cordial and benevolent:</h5>
							<p>Never Alone's users are commited for kind and friendly meeting</p>
							<p>No bullying, no negative comment, no judgment or racial statement</p>
							<h5 className="mt-4"><b className="text-info">Article 3 - </b> Responsibilities of users : </h5>
							<p>Never Alone's users are responsible for their own decisions. Outdoor Sports can be hazardous
							Never Alone is just a platform to connect
							people each other and can be responsible for any trouble hapenning while people are meeting trought our website. </p>
							<p>Every Never Alone's user are responsible for their act and can't make Never Alone accountable for any damage or incident. </p>
							<p>Never Alone encourage people to stay safe and to practice activities according to their level and experiences.</p>
							<h5 className="mt-4"><b className="text-info">Article 3 - </b> Recommandation and common sense : </h5>
							<p>Never Alone's users need to be trainned for high risk activity such as flying, diving or any thing hazardous.</p>
							<p>If you go on a trip with people having a high level of practice just remember "better safe than sorry", don't hesitate to give up and use your common sense before being at risk.</p>
							<p>If you keen to try new activities with Never Alone's user just stay oin your confort zone and don't overestimate your capacities, professionnal trainning is highly recommended or mandatory for 
							most of our targeted sports.</p>
							<p>If you keen to spend time share your experience with other Never Alone's user just keep in mind that you're not a profesional instructor and 
							you don't have to let a beginner without experience in a hazardous position.</p>
							<p>Meeting with stranger through our service is on your own responsabilities and we will ban from our site any user having bad recommendation from our user.</p>
							<p>If you feel unsafe with someone met on our site let us know as soon as possible and we will take action. </p>
							<p> If you are happy with these mandatory list of recommendations just don't forget to have fun, take pictures and post a blog when you safely back home !</p>
						</Card.Body>
						{currentUser != null ?
							<div className="w-100 text-center mt-5 mb-4">
								<Link to="/dashboard" className="text-info"><IoArrowBack className="mr-3"/>
									Back to Home page
								</Link>
							</div>
						:
							<div className="w-100 text-center mt-5 mb-4">
								<Link to="/" className="text-info"><IoArrowBack className="mr-3"/>
									Back to Home page
								</Link>
							</div>
						}
					</Card>
				</div>
			</div>
			{currentUser != null ? <Footer notConnected={false} /> : <Footer notConnected />}	
		</>
	)
}


export default TermsConditions
