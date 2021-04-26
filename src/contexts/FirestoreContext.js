import React, {useContext, useState, useEffect} from 'react'
import { auth } from '../Firebase'
import { db } from '../Firebase'
import { useAuth } from '../contexts/AuthContext'
import "firebase/auth"
import firebase from 'firebase/app'

const SORT_OPTIONS = {
	'TIME_ASC' : {column: 'time_sec', direction: 'asc'},
	'TIME_DESC' : {column: 'time_sec', direction: 'desc'},
	'TITLE_ASC' : {column: 'title', direction: 'asc'},
	'TITLE_DESC' : {column: 'title', direction: 'desc'}
}

const FirestoreContext = React.createContext()

export function useFirestore() {
	return useContext(FirestoreContext)
}

export function FirestoreProvider({children}) {
	const { currentUser} = useAuth()
	const [displayProfile, setDisplayProfile] = useState({})
	const loading = false

	const fetchProfile = () => {
		var docRef = db.collection("users").doc(currentUser.email);
		
		docRef.get().then((doc) => {
			if (doc.exists) {
				setDisplayProfile(doc.data())
			} else {
				console.log("No such document!");
			}
		}).catch((error) => {
			console.log("Error getting document:", error);
		});
		
	}
	const value = { 
		displayProfile,
		fetchProfile
	}

	return (
		<FirestoreContext.Provider value={value}>
			{!loading && children}
		</FirestoreContext.Provider>
	)
}

export default FirestoreContext
