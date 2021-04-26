import React from 'react'
import { Col } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GiCompass } from "react-icons/gi"
import { IoLogoFacebook } from "react-icons/io5"
import { AiFillTwitterCircle } from "react-icons/ai"
import { AiFillInstagram } from "react-icons/ai"
import { AiFillLinkedin } from "react-icons/ai"
import { AiFillYoutube } from "react-icons/ai"
import useResize from '../contexts/useResize'

function Footer(props) {

  const history = useHistory()
  const {logout } = useAuth()  
  const resize = useResize()
	let small = resize.small
  const notConnected = props.notConnected

  async function handleLogout() {

        try {
			await logout()
			history.push("/")
		} catch {
			console.log('Failed to log out')
		}
	}
  
  return (
    <div className='' style={{backgroundColor: "rgb(34, 40, 39)"}}>
    <h5 className="pt-5 mx-auto text-center main-typo mb-5 px-2 blue-text-link spacing">KEEN ON OUTDOOR SPORTS BUT NOT ALONE ...</h5>
        <div className="d-flex justify-content-around text-center border-bottom border-top border-info py-5">
            <Col>
            {small ?
              <Link to='/about' className="blue-text-link"><small>About Us</small></Link>
            :  <Link to='/about' className="blue-text-link">About Us</Link>
            }
            </Col>
            <Col>
            {small ?
              <Link to='/contact' className="blue-text-link"><small>Contact Us</small></Link>
            :   <Link to='/contact' className="blue-text-link">Contact Us</Link>
            }
            </Col>
            <Col>
            {notConnected 
            ?
              (small ?
              <Link to='/signup' className="blue-text-link"><small>Create Account</small></Link>
              :   <Link to='/signup' className="blue-text-link">Create Account</Link>
              )
            :
              (small ?
              <Link to='/blog' className="blue-text-link"><small>Blog's post</small></Link>
              :   <Link to='/blog' className="blue-text-link">Blog's post</Link>
              )
            }
            </Col>
            <Col>
            {notConnected 
            ?
              (small ?
              <Link to='/login' className="blue-text-link"><small>Connexion</small></Link>
              :   <Link to='/login' className="blue-text-link">Connexion</Link>
              )
            :
              (small ?
              <Link to='/profile' className="blue-text-link"><small>My Profile</small></Link>
              :   <Link to='/profile' className="blue-text-link">My Profile</Link>
              )
            }
            </Col>
        </div>
        <div className="text-center border-top border-info py-5 ">
            <h5 className="text-info text-center spacing-small px-2">
              The bigger the community, the better chance we have to create connexion...
            </h5>
        </div>
        <div className="pb-3 border border-info rounded-pill pt-3 m-3">
        {small ? 
            <small className="light-blue text-center pt-1 d-flex justify-content-center">
              Share the project on social media
            </small>
            :
            <h6 className="light-blue text-center pt-1 spacing-small">
              Share the project on social media
            </h6>
        }
          <div className="d-flex justify-content-center py-3"> 
              <Link className='mx-2 social-icon' to='/'>
                <AiFillInstagram  style={{fontSize: '2.1em'}}/>
              </Link>
              <Link className='mx-2 social-icon' to='/'>
                <IoLogoFacebook  style={{fontSize: '2.1em'}}/>
              </Link>
              <Link className='mx-2 social-icon' to='/'>
                <AiFillYoutube style={{fontSize: '2.1em'}}/>
              </Link>
              <Link className='mx-2 social-icon' to='/'>
                <AiFillLinkedin  style={{fontSize: '2.1em'}}/>
              </Link>
              <Link className='mx-2 social-icon' to='/'>
                <AiFillTwitterCircle style={{fontSize: '2.1em'}}/>
              </Link>
          </div>
        </div>
        <div className='text-center  pb-4'>
            <h4 className='main-typo-light-blue mt-5'><GiCompass className='red-text mr-3 mb-2'/>  
              NEVER ALONE
            </h4>
          <small className='red-text'>Made with love in Switzerland © 2021</small>
        </div>
        <div className='text-right d-flex justify-content-end pb-3'>
        {!notConnected &&
          <small className='mx-3 social-icon cursor-hover' onClick={handleLogout}>
              Log Out
          </small>
        }
          <small><Link className='mx-2 social-icon' to='/terms-and-conditions'>
            Terms & Conditions
          </Link></small>
          <small><Link className='mx-2 social-icon' to='/privacy-policy'>
            Privacy Policy
          </Link></small>
        </div>
    </div>
  );
}

export default Footer;