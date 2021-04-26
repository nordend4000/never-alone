import React, { useState, useMemo } from 'react'
import { Modal, Button, Form, ProgressBar } from 'react-bootstrap'
import { db } from '../Firebase'
import { storage } from "../Firebase"
import {useDropzone} from 'react-dropzone'
import { GiCompass } from "react-icons/gi"
import { IoCloudUploadOutline } from 'react-icons/io5'
import {baseStyle, activeStyle, acceptStyle, rejectStyle} from '../ressources/dropImage.js'


function ModalUpload(props) {

	const setError = props.setError
	const setMessage = props.setMessage
	const email = props.email
	const setModalShow = props.setModalShow
	const setCount = props.setCount
	const[progress, setProgress] = useState(0)
		
	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
		fileRejections,
		acceptedFiles
		} = useDropzone({
			accept: 'image/jpeg, image/png',
			maxFiles: 1
		});

	const style = useMemo(() => ({
		...baseStyle,
		...(isDragActive ? activeStyle : {}),
		...(isDragAccept ? acceptStyle : {}),
		...(isDragReject ? rejectStyle : {})
	}), [
		isDragActive,
		isDragReject,
		isDragAccept
	])

	const acceptedFileItems = acceptedFiles.map(file => (
		<li key={file.path}>
		{file.path} - {file.size} bytes
		</li>
	));
	const fileRejectionItems = fileRejections.map(({ file, errors  }) => { 
		return (
			<li key={file.path}>
				{file.name} - {file.size} bytes
				<ul>
					{errors.map(e => <li key={e.code}>{e.message}</li>)}
				</ul>
		
			</li>
		) 
	});

	function handleSubmitUpload(e){
		e.preventDefault()
		setMessage("")
		setError("")

		const uploadImage = storage.ref(`users-profile/${email}`).put(acceptedFiles[0])
		uploadImage.on(
			'state_changed',
			//current progress of the upload
			snapshot =>{
				const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)* 100)
				setProgress(progress)
			},
			error =>{
				console.log(error)
			},
			//if successful
			() => {
				storage
				.ref('users-profile')
				.child(email)
				.getDownloadURL()
				.then(url =>{
					db.collection('users').doc(email).update({
						photoUrl: url
					})
					.then(() => {
						setMessage("Your Profile Picture has been saved successfully !")
						console.log("photo profile done")
					})
					.catch((error) => {
						// The document probably doesn't exist.
						console.error("Error uploading Profile picture: ", error)
						setError("Ouups something wrong happened, Try again to upload your file... ")
					});
				})
			})
			setCount(prevCount => prevCount + 1)
			setModalShow(false)
	}

	return (
		<Modal
		{...props}
		size="lg"
		aria-labelledby="contained-modal-title-vcenter"
		centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter" className="blue-icon ml-5 main-typo">
					Change your Profile Picture
				</Modal.Title>
			</Modal.Header>
				<Modal.Body>
				<Form onSubmit={handleSubmitUpload}>
					<Form.Group id ="profile-image">
						<Form.Label className="light-blue ml-3">
							<h5><GiCompass className="blue-icon ml-2 mr-2" style={{fontSize: "1.3em"}}/>
							Select your file :</h5>
						</Form.Label>
						<div className="container mt-3">
						
						<div {...getRootProps({style})}>
							<input {...getInputProps()} />
							<p>Drag 'n' drop your image here, or click to select your file</p>
							<em>Only one image file .jpeg or .png will be accepted</em>
						</div>
						<aside>
							{fileRejectionItems.length > 0 && <p className="text-danger">Rejected files : {fileRejectionItems}</p>}
							{acceptedFileItems.length > 0 && <p className="text-success">Accepted files : {acceptedFileItems}</p>}
							{(progress > 0 && progress < 99) && <ProgressBar striped variant="info" value={progress} max="100" className="mt-1"/>}
						</aside>
						</div>
					</Form.Group>
					<div className="w-100 d-flex justify-content-center">
					{acceptedFileItems.length > 0 ?
						<Button variant="info" className="w-50 my-3 mt-4" type="submit">
							<IoCloudUploadOutline className="mr-3" style={{fontSize: "1.2em"}}/> Upload your image
						</Button>
						:
						<Button variant="info" className="w-50 my-3 mt-4" type="submit" disabled>
							<IoCloudUploadOutline className="mr-3" style={{fontSize: "1.2em"}}/> Select a file to upload
						</Button>
					}
					</div>
				</Form>
				</Modal.Body>
			<Modal.Footer>
				<Button variant="info" onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

function ModalPhotoProfile(props) {

	const [modalShow, setModalShow] = useState(false)

	return (
		<div className="my-4 mx-auto">
			<div className=" d-flex justify-content-center mt-5">
				<p className="link-comment w-50 text-center" onClick={() => setModalShow(true)}>
					<small><b>Change My Profile Picture</b></small>
				</p>
			</div>
			<ModalUpload
				show={modalShow}
				onHide={() => setModalShow(false)}
				email={props.email}
				setError={props.setError}
				setMessage={props.setMessage}
				setModalShow={setModalShow}
				setCount={props.setCount}
			/>
		</div>
	);
}

export default ModalPhotoProfile