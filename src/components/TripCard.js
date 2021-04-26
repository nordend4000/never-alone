import React, { useState, useEffect } from 'react'
import { Button, Alert, Form, Col, Row } from 'react-bootstrap'
import { db } from '../Firebase'
import { v4 as uuidV4 } from 'uuid'
import DatePicker from 'react-datepicker'
import SelectCountry from './SelectCountry'
import TripDisplayCards from './TripDisplayCards'
import { BiReset } from "react-icons/bi"
import { IoColorFilterSharp } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io"
import ACTIVITIES from '../ressources/activities.js'

const SORT_OPTIONS = {
	'SOONER' : {column: 'timeTrip', direction: 'asc'},
	'LATER' : {column: 'timeTrip', direction: 'desc'},
	'LATEST' : {column: 'timePost', direction: 'asc'},
	'OLDEST' : {column: 'timePost', direction: 'desc'}
}
// Fetch Data from database
function useNewTrip(sortBy, reset) {

		const [newTrip, setNewTrip] = useState([])
		useEffect(() => {
		const unsubscribe = db.collection("newTrip")
		.orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
		.onSnapshot((snapshot) => {
			const trips = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}))
			setNewTrip(trips)
		})
		return () => unsubscribe()
	}, [sortBy, reset])
	return newTrip
}

function TripCard(props) {
	const [sortBy, setSortBy] = useState('SOONER')
	const [reset, setReset] = useState(0)
	const dataTrips = useNewTrip(sortBy, reset)
	const [filteredTrips, setFilteredTrips] = useState(null)
	const [errorFilter, setErrorFilter] = useState('')
	const [search, setSearch] = useState('Select activity')
	const [countrySelected, setCountrySelected] = useState('')
	const [regionSelected, setRegionSelected] = useState('')
	const [startDate, setStartDate] = useState(new Date())
	const [openFilters, setOpenFilters] = useState(false)
	const medium = props.medium
	const large = props.large
	const small = props.small

	// FILTERING FUNCTIONS
	useEffect(() => {
		const  newArray = dataTrips.filter(function (el) {
			return el.area === regionSelected
		});
		if(newArray.length === 0){
		setErrorFilter("Sorry no result found for your search")
		setFilteredTrips(null)
		}else{
			setFilteredTrips(newArray)
			setErrorFilter("")
		}
	}, [regionSelected, dataTrips])

	useEffect(() => {
		const  newArray = dataTrips.filter(function (el) {
			return el.country === countrySelected
		});
		if(newArray.length === 0){
		setErrorFilter("Sorry no result found for your search")
		setFilteredTrips(null)
		}else{
			setFilteredTrips(newArray)
			setErrorFilter("")
		}
	}, [countrySelected, dataTrips])

	useEffect(() => {
		setErrorFilter("")
		setFilteredTrips(null)
	}, [sortBy, reset, dataTrips])
	
	function handleSearch(e){
		setSearch(e)
		const  newArray = dataTrips.filter(function (el) {
			return el.activity === e
		});
		if(newArray.length === 0){
		setErrorFilter("Sorry no result found for your search")
		setFilteredTrips(null)
		}else{
			setFilteredTrips(newArray)
			setErrorFilter("")
		}
	}

	function handleSearchDate(date){
		setStartDate(date)
		const  newArray = dataTrips.filter(function (el) {
			return el.date.stringDate === date.toDateString()
		});
		if(newArray.length === 0){
		setErrorFilter("Sorry no result found for your search")
		setFilteredTrips(null)
		}else{
			setFilteredTrips(newArray)
			setErrorFilter("")
		}
	}

	return (
		<>
		<h2 className={!large && !medium 
		? "text-center w-100 display-6 border border-info p-3 my-5 mx-auto rounded-bottom bgtrans main-typo-light-blue" 
		: "text-center w-100 display-4 border border-info p-3 my-5 mx-auto rounded-bottom bgtrans main-typo-light-blue"} >
			Upcoming Trips
		</h2>
		<Row>
			<div className="w-100 d-flex justify-content-center">
				<Button variant="info" className={!large && !medium ? "w-50 my-4 p-2" : "w-25 my-4 p-2" }
				onClick={()=> setOpenFilters(!openFilters)}>
					{!openFilters ? (<><IoColorFilterSharp className="mr-2" /> Open Filters </>) 
					: (<><IoIosCloseCircleOutline className="mr-2" /> Close Filters</>)}
				</Button>
			</div>
		</Row>
		{openFilters &&
		<div className={!large && !medium ? "bgtrans mb-5" : "p-4 bgtrans mb-5"}>
		{small && !large && !medium ?
		<>{/*  Sort SMALL  */}
				<div >
					<div className="d-flex justify-content-center pt-3">
						<Form.Label className="mr-3 bgtrans rounded p-2 text-info mx-5"><b>Sort By :</b></Form.Label>
					</div>
					<div className="d-flex justify-content-center">
						<Form.Control as="select" className="p-1 w-50" value={sortBy} 
						onChange={e => setSortBy(e.currentTarget.value)}>
							<option disabled>Happening</option>
							<option value="LATER">Latest</option>
							<option value="SOONER">Sooner</option>
							<option disabled>-------------</option>
							<option disabled>Posted</option>
							<option value="LATEST">Latest</option>
							<option value="OLDEST">Oldest</option>
						</Form.Control>
					</div>
				</div>
				<div>
					<div className="d-flex justify-content-center pt-3">
						<Form.Label className="mr-3 bgtrans rounded p-2 text-info"><b>Search by Activities : </b></Form.Label>
					</div>
					<div className="d-flex justify-content-center">
						<Form.Control as="select" className="p-1 w-50 mx-auto" value={search} 
										onChange={e => handleSearch(e.currentTarget.value)}>
							<option disabled default>Select activity</option>
							{ACTIVITIES.map((activity)=>(
								<option  key={uuidV4()} className="" 
									value={activity}>{activity.replace(/([a-z])([A-Z])/g, '$1 $2')}
								</option>
							))
							}
						</Form.Control>
					</div>
				</div>
				<div>
					<div className="d-flex justify-content-center pt-3">
						<Form.Label className="mr-3 bgtrans rounded p-2 text-info"><b>Search by Date : </b></Form.Label>
					</div>
					<div className="d-flex justify-content-center">
						<DatePicker className="mb-3 p-1 border-muted mx-auto" selected={startDate} 
									onChange={date => handleSearchDate(date)} >
							<div className="mb-3 mt-4 ml-3" style={{ color: "blue"}}>
								Don't forget to check the weather!
							</div>
						</DatePicker>
					</div>
				</div>
				<Row className="d-flex justify-content-center mt-3 ml-1">
					<SelectCountry regionSelected={regionSelected} 
					countrySelected={countrySelected} setCountrySelected={setCountrySelected} 
					setRegionSelected={setRegionSelected} readyCountry= {false} readyCountrySearch/>
				
				</Row>
		</>
		: 
		<> {/*  Sort LARGE && MEDIUM  */}
			<Row className="mb-4 d-flex justify-content-center mx-auto">
				<Col className="ml-4">
					<Form.Label className="mr-3 bgtrans rounded p-2 text-info"><b>Sort By :</b></Form.Label>
					<Form.Control as="select" className="p-1 w-50" value={sortBy} 
					onChange={e => setSortBy(e.currentTarget.value)}>
						<option disabled>Happening</option>
						<option value="LATER">Latest</option>
						<option value="SOONER">Sooner</option>
						<option disabled>-------------</option>
						<option disabled>Posted</option>
						<option value="LATEST">Latest</option>
						<option value="OLDEST">Oldest</option>
					</Form.Control>
				</Col>
				<Col>
					<Form.Label className="mr-3 bgtrans rounded p-2 text-info"><b>Search by Activities : </b></Form.Label>
					<Form.Control as="select" className="p-1 w-75" value={search} 
									onChange={e => handleSearch(e.currentTarget.value)}>
						<option disabled default>Select activity</option>
						{ACTIVITIES.map((activity)=>(
							<option  key={uuidV4()} className="" 
								value={activity}>{activity.replace(/([a-z])([A-Z])/g, '$1 $2')}
							</option>
						))
						}
					</Form.Control>
				</Col>
				<Col >
					<Form.Label className="mr-3 bgtrans rounded p-2 text-info"><b>Search by Date : </b></Form.Label>
					<div>
						<DatePicker className="mb-3 p-1 border-muted" selected={startDate} 
									//onChange={date => setStartDate(date)} >
									onChange={date => handleSearchDate(date)} >
							<div className="mb-3 mt-4 ml-3" style={{ color: "blue"}}>
								Don't forget to check the weather!
							</div>
						</DatePicker>
					</div>
				</Col>
			</Row>
			<Row>
				<Col className="ml-4">
				<Form.Label className="mr-3 bgtrans rounded p-2 text-info"><b>Search by Country : </b></Form.Label>
					<SelectCountry regionSelected={regionSelected} 
					countrySelected={countrySelected} setCountrySelected={setCountrySelected} 
					setRegionSelected={setRegionSelected} readyCountry= {false} readyCountrySearch/>
				</Col>
			</Row>
		</>
		}
		<Row>
			<div className="w-100 d-flex justify-content-center">
				<Button variant="info" className={!large && !medium ? "w-50 my-4 p-2" : "w-25 my-4 p-2" }
				onClick={()=> setReset(prevCount => prevCount + 1)}>
					<BiReset className="mr-2" /> Reset Filters
				</Button>
			</div>
		</Row>
		</div>	
		}
		<div className="d-flex justify-content-center">
		{errorFilter && <Alert variant="danger" 
		className={!medium && !large ? "w-100 ml-3 mt-3" : "w-50 ml-3 mt-3"}>
		{errorFilter}</Alert>
		}
		</div>
		<div>
		{filteredTrips == null 
			? <TripDisplayCards data={dataTrips} medium={medium} large={large} small={small}/>
			: <TripDisplayCards data={filteredTrips} medium={medium} large={large} small={small}/>
		}
		</div>
		</>
	)
}

export default TripCard
