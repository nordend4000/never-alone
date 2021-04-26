import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TiThMenuOutline } from "react-icons/ti"
import { IoClose } from "react-icons/io5"
import { GiCompass } from "react-icons/gi"
import { RiArrowRightSLine } from "react-icons/ri"
import { GiMountainCave } from "react-icons/gi"
import { AiOutlineLogin } from "react-icons/ai"
import { RiProfileLine } from "react-icons/ri"
import { GiWindsock } from "react-icons/gi"
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"
import '../styles/navbar.css';

function Navbar() {
  const [click, setClick] = useState(false)
  const handleClick = () => setClick(!click)
  const closeMobileMenu = () => setClick(false)
  const [width, setWidth] = useState(false)

	const test = () => {
		if(window.innerWidth >= 960){
			setWidth(true)
      if(click){
        setClick(false)
      }
	
		} else {
			setWidth(false)
      if(click){
      setClick(false)
      }
		}
	};
	window.addEventListener('resize', test)
  
	useEffect(() => {
		if(window.innerWidth >= 960){
			setWidth(true);
	
		} else {
			setWidth(false);
		}
	}, []);
  
    return (
        <>
        <nav className="navbar">
        {!width &&
            <div className="d-flex justify-content-start w-100 mb-n5">
              <Link to="/" className="navbar-logo main-typo ml-n2 pt-3" onClick={closeMobileMenu}>
                <h5><GiCompass className="mr-3 "/> Never Alone   </h5>
              </Link>
            </div>
        }
          <div className="navbar-container">
          {width &&
          <Link to="/" className="navbar-logo main-typo ml-n2" onClick={closeMobileMenu}>
          <h4 className=""><GiCompass className="mr-3 mt-1"/> Never Alone   </h4>
            </Link>
          }
            <div className="menu-icon mr-n3" onClick={handleClick}>
              {!click ?  <TiThMenuOutline/> : <IoClose/>}
            </div>
            {click ?
            <ul className='nav-menu-not-connected active'>
              <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              <GiMountainCave className="ml-1 mr-4 mb-1"/>Home <RiArrowRightSLine className="ml-5 bluedark" style={{fontSize: "1.6em"}}/></Link>
              </li>
              <li className="nav-item">
              <Link to="/about" className="nav-links" onClick={closeMobileMenu}>
              <GiWindsock className="ml-1 mr-4 mb-1"/>About us<RiArrowRightSLine className="ml-5 bluedark" style={{fontSize: "1.6em"}}/></Link>
              </li>
              <li className="nav-item">
              <Link to="/contact" className="nav-links" onClick={closeMobileMenu}>
              <IoChatbubbleEllipsesOutline className="ml-1 mr-4 mb-1"/>Contact us <RiArrowRightSLine className="ml-5 bluedark" style={{fontSize: "1.6em"}}/></Link>
              </li>
              <li className="nav-item">
              <Link to="/signup" className="nav-links" onClick={closeMobileMenu}>
              <RiProfileLine className="ml-1 mr-4 mb-1"/>Create Account <RiArrowRightSLine className="ml-5 bluedark" style={{fontSize: "1.6em"}}/></Link>
              </li>
              <li className="nav-item">
              <Link to="/login" className="nav-links" onClick={closeMobileMenu}>
              <AiOutlineLogin className="ml-1 mr-4 mb-1"/>Connexion <RiArrowRightSLine className="ml-5 bluedark" style={{fontSize: "1.6em"}}/></Link>
              </li>
            </ul>
            :
            <ul className='nav-menu-not-connected'>
              <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>Home
              </Link>
              </li>
              <li className="nav-item">
              <Link to="/about" className="nav-links" onClick={closeMobileMenu}>About
              </Link>
              </li>
              <li className="nav-item">
              <Link to="/contact" className="nav-links" onClick={closeMobileMenu}>Contact
              </Link>
              </li>
              <li className="nav-item">
              <Link to="/signup" className="nav-links" onClick={closeMobileMenu}>Sign In
              </Link>
              </li>
              <li className="nav-item">
              <Link to="/login" className="nav-links" onClick={closeMobileMenu}>Log In
              </Link>
              </li>
            </ul>
            }
          </div>
        </nav>
        </>
    )
}

export default Navbar
