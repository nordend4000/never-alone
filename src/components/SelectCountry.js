import React, {useState} from 'react'
import { Form } from 'react-bootstrap'
import { v4 as uuidV4 } from 'uuid'
import LIST_COUNTRY_STATE from '../ressources/countries.json'

function SelectCountry(props) {

	const [temp, setTemp] = useState();
	const setCountrySelected = props.setCountrySelected
	const setRegionSelected = props.setRegionSelected
	const regionSelected = props.regionSelected
	const countrySelected = props.countrySelected
	const readyCountry = props.readyCountry
	const readyCountrySearch = props.readyCountrySearch

	function handleSelectCountry(e){
		e.preventDefault()
		const x = LIST_COUNTRY_STATE.filter((country => country.name === e.target.value))
		setTemp(x[0].states)
		setCountrySelected(e.target.value)
	}
	function handleSelectState(e){
		e.preventDefault()
		setRegionSelected(e.target.value)
	}

	return (
		<>
		{readyCountry &&
		<Form.Group id ="country">
			<Form.Label className="light-blue"><h5>Country</h5></Form.Label>
			<Form.Control as="select" value={countrySelected} onChange={e => handleSelectCountry(e)}>
				<option default>Select your Country...</option>
				{LIST_COUNTRY_STATE.map(country =>(
					<option key={uuidV4()} value={country.name}>{country.name}</option>
				))
				}
			</Form.Control>
			{typeof(temp) != "undefined" &&
			<>
			<Form.Label className="light-blue mt-2"><h5>State / Region</h5></Form.Label>
			<Form.Control as="select" value={regionSelected}  onChange={e => handleSelectState(e)}>
				<option default>Select your Region / State...</option>
				{temp.map(state =>(
					<option key={uuidV4()} value={state.name}>{state.name}</option>
				))
				}
			</Form.Control>
			</>
			}
		</Form.Group>
		}
		{readyCountrySearch &&
		<Form.Group  id ="country">
			<div>
				<div className="d-flex justify-content-center pt-3">
					<Form.Label  className="bgtrans rounded p-2 text-info mr-3"><b>Search by Country : </b></Form.Label>
				</div>
				<div className="d-flex justify-content-center">
					<Form.Control className="p-1 w-50" as="select" value={countrySelected} 
									onChange={e => handleSelectCountry(e)}>
						<option default>Select your Country...</option>
						{LIST_COUNTRY_STATE.map(country =>(
							<option key={uuidV4()} value={country.name}>{country.name}</option>
						))
						}
					</Form.Control>
				</div>
			</div>
			{typeof(temp) != "undefined" &&
			<div >
				<div className="d-flex justify-content-center pt-3">
					<Form.Label className="bgtrans rounded p-2 text-info mr-3"><b>Search By State / Region : </b></Form.Label>
				</div>
				<div className="d-flex justify-content-center">
					<Form.Control className="p-1 w-50" as="select" value={regionSelected}  
									onChange={e => handleSelectState(e)}>
						<option default>Select your Region / State...</option>
						{temp.map(state =>(
							<option key={uuidV4()} value={state.name}>{state.name}</option>
						))
						}
					</Form.Control>
				</div>
			</div>
			}	
		</Form.Group>
		}
		</>
	)
}

export default SelectCountry
