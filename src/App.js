import React, { Component } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';




const particleOptions = {
      "particles": {
          "number": {
              "value": 60
          },
          "size": {
              "value": 1
          }
      },
      "interactivity": {
          "events": {
              "onhover": {
                  "enable": true,
                  "mode": "repulse"
              }
          }
      }
  }

  const intialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };

class App extends Component {
  constructor() {
    super();
    this.state= intialState;
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
      }
  }
  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://fierce-plains-32211.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch('https://fierce-plains-32211.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
          console.log(this.state.user);
          })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(`The error is ${err}`));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(intialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  updateUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }});
      console.log(this.state.user);
  }

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
                <Particles className='particles'
                params={particleOptions}
                />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      {
        route === 'home' 
      ? <div>
      <Logo />
      <Rank  name={this.state.user.name} entries={this.state.user.entries}/>
      <ImageLinkForm 
      onInputChange={this.onInputChange}
      onButtonSubmit={this.onButtonSubmit}
       />
       <FaceRecognition box={box} imageUrl={imageUrl}/>
       </div>
       : ( route === 'signin'
      ? <SignIn onRouteChange={this.onRouteChange} updateUser={this.updateUser}/>
      : <Register onRouteChange={this.onRouteChange} updateUser={this.updateUser}/>
      )
     }
    </div>
  );
}
}

export default App;
