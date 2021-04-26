import React from 'react'
import NavbarConnected from '../components/NavbarConnected'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'
import CardSports from '../components/CardSports'
import useResize from '../contexts/useResize'


function Dashboard(props) {

  const resize = useResize()
	let large = resize.large
	let medium = resize.medium
	let small = resize.small
  let feedback
  if (typeof(props.history.location.state) != "undefined"){
    feedback = props.history.location.state.feedback
  }
  

  return (
    <>
      <NavbarConnected/>
      <HeroSection btn1="Browse Trips" btn1path="/trips" feedback={feedback}
      btn2="Create Trip" btn2path="/new" medium={medium} large={large} small={small}/>
      <CardSports link="/trips" medium={medium} large={large} small={small}/>
      <Footer />
    </>
  )
}

export default Dashboard