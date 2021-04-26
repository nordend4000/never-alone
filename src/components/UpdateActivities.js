import React, {useState} from 'react'
import { Form, Button, Card, Image} from 'react-bootstrap'
import { db } from '../Firebase'
import { useAuth } from '../contexts/AuthContext'
import "firebase/firestore"
import { v4 as uuidV4 } from 'uuid'
import { HiOutlineSaveAs } from "react-icons/hi"
import ACTIVITIES from '../ressources/activities.js'

const LEVEL = ["expert", "advanced", "intermediate", "beginner"]

function UpdateActivities(props) {

	const { currentUser } = useAuth()
	const [dataActivities, setDataActivities] = useState(props.data.activities)
	const setCount = props.setCount
	const setError = props.setError
	const setMessage = props.setMessage
	const medium = props.medium
	const large = props.large

	function handleCheckActivity(e) {
		e.preventDefault()
		let change
		if(e.target.checked){ change = "checked"}
		else{ change = "unchecked"}
		setDataActivities(prevValues => ({
			...prevValues,
			[e.target.id]: change
		}))
	}

	function handleCheckLevel(e, sport) {
		e.preventDefault()
		setDataActivities(prevValues => ({
			...prevValues,
			[sport]: e.target.id
		}))
	}

	function handleSubmitActivities(e){
		e.preventDefault()
		const updateActivities = db.collection('users').doc(currentUser.email)
			updateActivities.update({
				activities: dataActivities
			})
		.then(() => {
			console.log("Document successfully updated!")
			setMessage("Your activities & level have been successfully updated!")
		})
		.catch((error) => {
			console.error("Error updating document: ", error);
			setError("Ouups something wrong happened, Try again to save your activities & level... ")
		});
		setCount(prevCount => prevCount + 1)
	}

	return (
		<div>
			
				<Form className="d-flex flex-wrap justify-content-around" onSubmit={handleSubmitActivities}>
					{
						ACTIVITIES.map(activity =>(
						<Card className={!large && !medium ? "p-1 mt-3 mx-2" : "w-25 p-1 mt-3 mx-2"} 
						style={{backgroundColor: 'rgba(194, 229, 232, 0.8)'}} key={uuidV4()}>
							<div  className="d-flex justify-content-center p-3">
							{/* eslint-disable-next-line */}
							<Image src={process.env.PUBLIC_URL + '/images/' + `${activity}` + '.png'}
							className="border border-info rounded" rounded />
							</div>
							<Form.Group  className="my-4 ml-4">
								<Form.Check 
									type="switch"
									className="mb-3 text-uppercase font-weight-bolder light-blue main-typo"
									id={activity}
									variant="info"
									label={activity.replace(/([a-z])([A-Z])/g, '$1 $2')}
									checked={dataActivities[activity] === "unchecked" ? false : true}
									onChange={e => handleCheckActivity(e, activity)}
								/>
							{ dataActivities[activity] !== "unchecked" &&
								LEVEL.map(level => (
								<span key={uuidV4()}>
									<Form.Check 
										type="checkbox"
										className="mb-3 text-capitalize text-muted px-2"
										inline
										id={level}
										label={level}
										checked={level !== dataActivities[activity] ? false : true}
										onChange={e => handleCheckLevel(e, activity)}
									/>
								</span>
								))
							}
							</Form.Group>
						</Card>
					))}
					<div className="w-100 d-flex justify-content-center">
					<Button variant="info" className={!large && !medium ? "w-75 mt-3 mb-5 p-2" : "w-25 mt-3 mb-5 p-2"} 
					type="submit">
						<HiOutlineSaveAs className="mr-3" style={{fontSize: "1.2em"}}/>
						Save Activities
					</Button>
				</div>
				</Form>
		
		</div>
	)
}

export default UpdateActivities


