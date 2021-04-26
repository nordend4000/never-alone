import { useState, useEffect} from 'react'

function useResize() {

	const [large, setLarge] = useState(false)
	const [medium, setMedium] = useState(false)
	const [small, setSmall] = useState(false)

	const test = () => {
		if(window.innerWidth >= 994){
			setLarge(true)
			setSmall(false)
	
		} else if (window.innerWidth <= 993 && window.innerWidth >= 760) {
			setMedium(true)
			setLarge(false)
			setSmall(false)
		} else if (window.innerWidth <= 759 && window.innerWidth >= 325) {
			setMedium(false)
			setLarge(false)
			setSmall(true)
		}
		else{
			setMedium(false)
			setLarge(false)
			setSmall(true)
		}
	};

	window.addEventListener('resize', test);
			
	useEffect(() => {
		if(window.innerWidth >= 994){
			setLarge(true)
			setMedium(true)
			setSmall(false)
		} else if (window.innerWidth <= 993 && window.innerWidth >= 760) {
			setMedium(true)
			setLarge(false)
			setSmall(false)
		}else if (window.innerWidth <= 759 && window.innerWidth >= 325) {
			setMedium(false)
			setLarge(false)
			setSmall(true)
		}else{
			setMedium(false)
			setLarge(false)
			setSmall(true)
		}
	}, []); 

	return {large, medium, small}
}

export default useResize