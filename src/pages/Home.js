import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'
import CardSports from '../components/CardSports'
import useResize from '../contexts/useResize'

function Home() {

  const resize = useResize()
	let large = resize.large
	let medium = resize.medium
	let small = resize.small

  return (
    <>
      <Navbar />
      <HeroSection btn1="Log In" btn1path="/login"
      btn2="Sign Up" btn2path="/signup" medium={medium} large={large} small={small}/>
      <CardSports link="/login" medium={medium} large={large} small={small} notConnected/>
      <Footer notConnected/>
      
    </>
  )
}

export default Home;