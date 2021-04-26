import React from 'react'
import { Card, Image, Row, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { v4 as uuidV4 } from 'uuid'
import { GiCheckMark } from "react-icons/gi"
import { Link } from 'react-router-dom'
import { GoLocation } from "react-icons/go"


function TripDisplayCards(props) {
	const data = props.data      
	const large = props.large      
	const medium = props.medium      
	const small = props.small      

	
	const openUserProfil = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			Open User Profile
		</Tooltip>
	)
	const openTripId = (props) => (
	<Tooltip id="button-tooltip" {...props}>
		Open Trip
	</Tooltip>
	)
	
		return(
			<>		
			<div className={medium  || large ? "d-flex flex-wrap justify-content-around" : ""}>
			{data.map((trip) => 
				<Card key={uuidV4()} className={large ? "w-25 p-2 m-1 mt-3" : 
				(medium ? "w-50 mt-3" : "w-100 mb-2 mx-auto")}
				style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
					<Card.Body className="text-center">
						<small>
							<Link className="linked" to={`/user?${trip.userId}`}>
								<h5>
									{(trip.photoUrl === "" || trip.photoUrl == null) ? "" : 
									<Image src={trip.photoUrl} roundedCircle className="mr-1 border border-light" 
									style={{"height" : "30px", "width" : "30px"}}/>
									}
									<OverlayTrigger
										placement="right"
										delay={{ show: 150, hide: 400 }}
										overlay={openUserProfil}
									>
										<b className="px-4">{trip.userName}</b>	
									</OverlayTrigger>	
								</h5>
							</Link>
							from <i >{trip.userCity}, {trip.userCountry}</i>  
							<p className="mt-1">published a new trip</p>
						</small>
						<div>
							<Link to={`/post?${trip.id}`}>
								<OverlayTrigger
									placement="right"
									delay={{ show: 150, hide: 400 }}
									overlay={openTripId}
								>
								{/* eslint-disable-next-line */}
								<Image src={process.env.PUBLIC_URL + '/images/' + `${trip.activity}` + '.png'} 
								className="my-3 border border-info rounded" rounded />
								</OverlayTrigger>	
							</Link>
						</div>
						<i className="mt-2">{trip.date.day}, {trip.date.num} {trip.date.month} {trip.date.year}</i>
						<h5 className="mt-3 text-info text-uppercase main-typo">
							{trip.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}
						</h5>
						{trip.level !== "unchecked" ? <i className="text-capitalize light-blue">{trip.level}</i>: "" }
						<h6 className="mt-4 bgtrans p-2 rounded-lg">{trip.description}</h6>
						<p><GoLocation className="text-info mr-2"/><b>{trip.spot}</b> {trip.area}, {trip.country}</p>
						<small className="text-info">Starting from : <b>{trip.start}</b></small>
						<div className="mt-2">
							{trip.carPool && <small className="mx-5"> <GiCheckMark className="text-info mr-2"/> 
							Car-pooling
						</small>}
						</div>
						<div className="mt-2">
							{trip.publicTransport && 
							<small className="mx-5"> 
								<GiCheckMark className="text-info mr-2"/> Public Transport
							</small>}
						</div>
						<div className="mt-2">
							{trip.vehicule && 
							<small className="mx-5"> 
								<GiCheckMark className="text-info mr-2"/> Vehicule
							</small>}
						</div>
					</Card.Body>
					<Row className="my-2 d-flex justify-content-center">
						<Link to={`/post?${trip.id}`} className=" m-2 link-comment">
							<small >
								<b>Comments</b>
							</small>
						</Link>
						<Link to={`/post?${trip.id}`} className=" m-2 link-comment">
							<small>
								<b>Private message</b>
							</small>
						</Link>
					</Row>
				</Card>
			)}
			</div>
			</>
		)
	}

	export default TripDisplayCards