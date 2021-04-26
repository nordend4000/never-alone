import React, {useContext, useState, useEffect} from 'react'
import { auth } from '../Firebase'
import "firebase/auth"
import firebase from 'firebase/app'

const AuthContext = React.createContext()

export function useAuth() {
	return useContext(AuthContext)
}

export function AuthProvider({children}) {
	const [currentUser, setCurrentUser] = useState()
	const [loading, setLoading] = useState(true)

	function signup(email, password) {
		return auth.createUserWithEmailAndPassword(email, password)
	}

	function login(email, password) {
		return auth.signInWithEmailAndPassword(email, password)
	}

	function logout() {
		return auth.signOut()
	}

	function resetPassword(email){
		return auth.sendPasswordResetEmail(email)
	}

	function updateEmail(email){
		return currentUser.updateEmail(email)
	}

	function updatePassword(password){
		return currentUser.updatePassword(password)
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			
			setCurrentUser(user)
			setLoading(false)
		})
		return unsubscribe
	}, [])

	async function socialSignIn(social) {
		let provider
		if(social === "facebook"){
			provider = new firebase.auth.FacebookAuthProvider()
			console.log("fb ok")
			console.log(provider)
		}else if(social === "google"){
			provider = new firebase.auth.GoogleAuthProvider()
			console.log("goog ok")
		}else{console.log("failed")}
		
		return auth.signInWithPopup(provider).then(result => {
			console.log(result)
			console.log('success')
		}).catch(function(err){
			console.log(err)
			console.log('failed')
		})
	}

	

	const value = { 
		currentUser,
		signup,
		login,
		logout,
		resetPassword,
		updateEmail,
		updatePassword,
		socialSignIn
	}

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	)
}

export default AuthContext
