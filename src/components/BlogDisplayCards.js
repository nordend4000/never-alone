import React from 'react'
import { Card, Image, Row } from 'react-bootstrap'
import { v4 as uuidV4 } from 'uuid'
import { GiCheckMark } from "react-icons/gi"
import { Link } from 'react-router-dom'
import { GoLocation } from "react-icons/go"


function BlogDisplayCards(props) {
	const data = props.data
	const large = props.large      
	const medium = props.medium 
	
		return(
			<div className={medium  || large ? "d-flex flex-wrap justify-content-around" : ""}>
			{data.map((blog) =>(
			<>
				<Card key={uuidV4()} className={large ? "w-50 mt-3" : 
				(medium ? "w-75 mb-2 mt-3" : "w-100 mb-2 mx-auto")}
				style={{backgroundColor: 'rgba(220, 232, 233, 0.8)'}}>
					<Card.Body className="text-center">
						<small>
							<h4 className="light-blue">
								{(blog.photoUrl === "" || blog.photoUrl == null) ? "" : 
								<Image src={blog.photoUrl} roundedCircle className="ml-1 mr-2 border border-light" 
								style={{"height" : "30px", "width" : "30px"}}/>
								}
								<b>{blog.userName}</b>
							</h4>
							from <i>{blog.userCity}, {blog.userCountry}</i>  
							<p className="mt-1">published a new blog post</p>
						</small>
						<i className="mt-2 text-info">{blog.date.day}, {blog.date.num} {blog.date.month} {blog.date.year}</i>
						<h3 className="mt-3 text-info text-uppercase main-typo">
							{blog.activity.replace(/([a-z])([A-Z])/g, '$1 $2')}
						</h3>
						{blog.level !== "unchecked" ? <p className="text-capitalize light-blue">{blog.level}</p> : "" }
						<div>
						{(blog.mediaUrl !== "") && 
						<>
							<Link to={`/post?${blog.id}`}>
								<div>
									<Image src={blog.mediaUrl} alt="firebase-image" style={{maxWidth: "100%"}} 
									className="border border-light"  rounded/>
								</div>
							</Link>
							<div className="mx-auto text-muted">
								<small><i>{blog.subtitle}</i></small>
							</div>
						</>
						}
						</div>
						<h6 className="mt-4 bgtrans p-2 rounded-lg">{blog.description}</h6>
						<p><GoLocation className="text-info mr-2"/><b>{blog.spot}</b> {blog.area}, {blog.country}</p>
						<small className="text-info">Started from : <b>{blog.start}</b></small>
						<div className="mt-2">
							{blog.carPool && 
							<small className="mx-5"> 
								<GiCheckMark className="text-info mr-2"/> 
								Car-pooling
							</small>}
						</div>
						<div className="mt-2">
							{blog.publicTransport && 
							<small className="mx-5"> 
								<GiCheckMark className="text-info mr-2"/> Public Transport
							</small>}
						</div>
						<div className="mt-2">
							{blog.vehicule && 
							<small className="mx-5"> 
								<GiCheckMark className="text-info mr-2"/> Vehicule
							</small>}
						</div>
					</Card.Body>
					<Row className="my-2 d-flex justify-content-center">
						<Link to={`/blog-post?${blog.id}`} className=" m-2 link-comment">
							<small >
								<b>Comments</b>
							</small>
						</Link>
						<Link to={`/blog-post?${blog.id}`} className=" m-2 link-comment">
							<small>
								<b>Private message</b>
							</small>
						</Link>
					</Row>
				</Card>
			</>
			))}
			</div>
		)
	}
export default BlogDisplayCards
