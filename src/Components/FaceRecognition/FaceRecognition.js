import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
	return (
		<div className='center ma'>
		<div className='absolute mt2'>
	
			<img src={imageUrl}
			id = 'inputimage'
			alt="" 
			width='500px'
			height='auto'/>
			<div id='boundingBox' style= {{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}></div>

		</div>
		</div>
		);
}

export default FaceRecognition;