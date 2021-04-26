import React from 'react'
import { Card, Image, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import ACTIVITIES from '../ressources/activities.js'
import { ImBlog } from "react-icons/im"
import { SiOpenstreetmap } from "react-icons/si";
import { ImProfile } from "react-icons/im"
import { IoColorFilterSharp } from "react-icons/io5"
import { GiWindsock } from "react-icons/gi"
import { AiOutlinePicture } from "react-icons/ai"
import { BiMessageRoundedEdit } from "react-icons/bi"

// 350X250 pictures size
function CardSports(props) {

	const medium = props.medium
	const large = props.large
	const notConnected = props.notConnected

	return (
		<>
			<div className="border-top border-bottom border-info" style={{ 
				backgroundImage: `url(${process.env.PUBLIC_URL + '/images/home5.gif'})`,
				backgroundRepeat: 'repeat',
				backgroundSize: 'contain',
			}}
			>
			<h3 className="text-center main-typo my-5 social-icon bgtrans p-2">GET READY TO MEET THE COMMUNITY</h3>
			{ medium ?
			<>
			<Row className="w-75 mx-auto my-5">
				<Col className="my-auto">
					<Image rounded className="w-100" src={process.env.PUBLIC_URL + '/images/info1.png'}/>
				</Col>
				<Col xs={8} className="blue-text d-flex justify-content-center align-items-center  bgtransdark">
					<h4 className="text-center">
						<Link to={!notConnected ? "/new" : "/signup"} className="blue-link p-3">
							<ImBlog className="mr-4"/>Publish a post before your trip 
						</Link>
					</h4>
				</Col>
			</Row>
			<Row className="w-75 mx-auto my-5">
				<Col xs={8} className="blue-text d-flex justify-content-center align-items-center  bgtransdark">
					<h4 className="text-center">
						<Link to={!notConnected ? "/trips" : "/signup"} className="blue-link p-3">
							<GiWindsock className="mr-4"/>Search upcoming trips
						</Link>
					</h4>
				</Col>
				<Col className="my-auto">
					<Image rounded className="w-100" src={process.env.PUBLIC_URL + '/images/info2.png'}/>
				</Col>
			</Row>
			<Row className="w-75 mx-auto my-5">
				<Col className="my-auto">
					<Image rounded className="w-100" src={process.env.PUBLIC_URL + '/images/info3.png'}/>
				</Col>
				<Col xs={8} className="blue-text d-flex justify-content-center align-items-center  bgtransdark">
					<h4 className="text-center">
						<Link to={!notConnected ? "/trips" : "/signup"} className="blue-link p-3">
							<IoColorFilterSharp className="mr-4"/>Sort by date, activity or location.
						</Link>
					</h4>
				</Col>
			</Row>
			<Row className="w-75 mx-auto my-5">
				<Col xs={8} className="blue-text d-flex justify-content-center align-items-center  bgtransdark">
					<h4 className="text-center">
						<Link to={!notConnected ? "/map" : "/signup"} className="blue-link p-3">
							<SiOpenstreetmap className="mr-4"/> Browse map to find trips close to you
						</Link>
					</h4>
				</Col>
				<Col className="my-auto">
					<Image rounded className="w-100" src={process.env.PUBLIC_URL + '/images/info4.png'}/>
				</Col>
			</Row>
			<Row className="w-75 mx-auto my-5">
				<Col className="my-auto">
					<Image rounded className="w-100" src={process.env.PUBLIC_URL + '/images/info5.png'}/>
				</Col>
				<Col xs={8} className="blue-text d-flex justify-content-center align-items-center  bgtransdark">
					<h4 className="text-center">
						<Link to={!notConnected ? "/blog" : "/signup"} className="blue-link p-3">
							<AiOutlinePicture className="mr-4"/>Blog to share your memories
						</Link>
					</h4>
				</Col>
			</Row>
			<Row className="w-75 mx-auto my-5">
				<Col xs={8} className="blue-text d-flex justify-content-center align-items-center  bgtransdark">
					<h4 className="text-center">
						<Link to={!notConnected ? "/profile" : "/signup"} className="blue-link p-3">
							<BiMessageRoundedEdit className="mx-4"/>Communicate with your buddies
						</Link>
					</h4>
				</Col>
				<Col className="my-auto">
					<Image rounded className="w-100" src={process.env.PUBLIC_URL + '/images/info6.png'}/>
				</Col>
			</Row>
			<Row className="w-75 mx-auto my-5">
				<Col className="my-auto">
					<Image rounded className="w-100" src={process.env.PUBLIC_URL + '/images/info7.png'}/>
				</Col>
				<Col xs={8} className="blue-text d-flex justify-content-center align-items-center  bgtransdark">
					<h4 className="text-center">
						<Link to={!notConnected ? "/profile" : "/signup"} className="blue-link p-3">
							<ImProfile className="mr-4"/>Manage your activtity
						</Link>
					</h4>
				</Col>
			</Row>
			</>
			:
			<>
			<Link to={!notConnected ? "/new" : "/signup"} className="no-underline">
				<div className="border border-info w-75 mx-auto mb-5">
					<div className="blue-text mx-auto bgtransdark mb-n2">
						<h3 className="text-center pb-2 ">
							<ImBlog/>
						</h3>
					</div>
					<div className="d-flex justify-content-center mb-2">
						<Image className="w-100" src={process.env.PUBLIC_URL + '/images/info1.png'}/>
					</div>
					<div className="mx-auto blue-text bgtransdark mt-n2 p-2">
						<h5 className="text-center pt-1">
							Publish a post before your trip 
						</h5>
					</div>
				</div>
			</Link>
			<Link to={!notConnected ? "/trips" : "/signup"} className="no-underline">
				<div className="border border-info w-75 mx-auto mb-5">
					<div className="blue-text mx-auto bgtransdark mb-n2">
						<h3 className="text-center pb-2 ">
							<GiWindsock/>
						</h3>
					</div>
					<div className="d-flex justify-content-center mb-2">
						<Image className="w-100" src={process.env.PUBLIC_URL + '/images/info2.png'}/>
					</div>
					<div className="mx-auto blue-text bgtransdark mt-n2 p-2">
						<h5 className="text-center pt-1">
							Search upcoming trips
						</h5>
					</div>
				</div>
			</Link>
			<Link to={!notConnected ? "/trips" : "/signup"} className="no-underline">
				<div className="border border-info w-75 mx-auto mb-5">
					<div className="blue-text mx-auto bgtransdark mb-n2">
						<h3 className="text-center pb-2 ">
							<IoColorFilterSharp/>
						</h3>
					</div>
					<div className="d-flex justify-content-center mb-2">
						<Image className="w-100" src={process.env.PUBLIC_URL + '/images/info3.png'}/>
					</div>
					<div className="mx-auto blue-text bgtransdark mt-n2 p-2">
						<h5 className="text-center pt-1">
							Sort by date, activity or location.
						</h5>
					</div>
				</div>
			</Link>
			<Link to={!notConnected ? "/map" : "/signup"} className="no-underline">
				<div className="border border-info w-75 mx-auto mb-5">
					<div className="blue-text mx-auto bgtransdark mb-n2">
						<h3 className="text-center pb-2 ">
							<SiOpenstreetmap/>
						</h3>
					</div>
					<div className="d-flex justify-content-center mb-2">
						<Image className="w-100" src={process.env.PUBLIC_URL + '/images/info4.png'}/>
					</div>
						<div className="mx-auto blue-text bgtransdark mt-n2 p-2">
						<h5 className="text-center pt-1">
							Browse map to find trips close to you
						</h5>
					</div>
				</div>
			</Link>
			<Link to={!notConnected ? "/blog" : "/signup"} className="no-underline">
				<div className="border border-info w-75 mx-auto mb-5">
					<div className="blue-text mx-auto bgtransdark mb-n2">
						<h3 className="text-center pb-2 ">
							<AiOutlinePicture/>
						</h3>
					</div>
					<div className="d-flex justify-content-center mb-2">
						<Image className="w-100" src={process.env.PUBLIC_URL + '/images/info5.png'}/>
					</div>
					<div className="mx-auto blue-text bgtransdark mt-n2 p-2">
						<h5 className="text-center pt-1">
							Blog to share your memories
						</h5>
					</div>
				</div>
			</Link>
			<Link to={!notConnected ? "/profile" : "/signup"} className="no-underline">
				<div className="border border-info w-75 mx-auto mb-5">
					<div className="blue-text mx-auto bgtransdark mb-n2">
						<h3 className="text-center pb-2 ">
							<BiMessageRoundedEdit/>
						</h3>
					</div>
					<div className="d-flex justify-content-center mb-2">
						<Image className="w-100" src={process.env.PUBLIC_URL + '/images/info6.png'}/>
					</div>
					<div className="mx-auto blue-text bgtransdark mt-n2 p-2">
						<h5 className="text-center pt-1">
							Communicate with your buddies
						</h5>
					</div>
				</div>
			</Link>
			<Link to={!notConnected ? "/profile" : "/signup"} className="no-underline">
				<div className="border border-info w-75 mx-auto mb-5">
					<div className="blue-text mx-auto bgtransdark mb-n2">
						<h3 className="text-center pb-2 ">
							<ImProfile/>
						</h3>
					</div>
					<div className="d-flex justify-content-center mb-2">
						<Image className="w-100" src={process.env.PUBLIC_URL + '/images/info7.png'}/>
					</div>
					<div className="mx-auto blue-text bgtransdark mt-n2 p-2">
						<h5 className="text-center pt-1">
							Manage your activtity
						</h5>
					</div>
				</div>
			</Link>
			</>
			}
			<Row className="h-25"></Row>
			<h3 className="text-center main-typo my-5 social-icon bgtrans p-2">GET READY FOR A NEW ADVENTURE</h3>
			
			<div className="d-flex justify-content-center flex-wrap py-3">
				{	ACTIVITIES.map(activity =>(
					<Card className={medium ? "w-25 card-sport 	mb-4 mt-5 mx-4" : "w-75 card-sport mb-4 mt-3"}
					style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}} key={uuidV4()} border="dark">
					{large ?
						<h4 className="text-center text-capitalize main-typo mt-2 dark-blue">
							<b>{activity.replace(/([a-z])([A-Z])/g, '$1 $2')}</b>
						</h4>
						:
						<h5 className="text-center text-capitalize main-typo mt-2 dark-blue">
							<b>{activity.replace(/([a-z])([A-Z])/g, '$1 $2')}</b>
						</h5>
					}{/* eslint-disable-next-line */}
						<Image rounded className="p-2" src={process.env.PUBLIC_URL + '/images/' + `${activity}` + '2.png'}/>
						<Link to={props.link} 
						className={medium 
						? "text-center w-50 mx-auto p-1 mb-3 link-upcoming" 
						: "text-center w-75 mx-auto p-1 mb-3 link-upcoming"}
						>
							<small>Upcoming Trips</small>
						</Link>
					</Card>
					))
				}
				</div>
			</div>
		</>
	)
}

export default CardSports