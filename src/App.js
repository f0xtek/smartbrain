import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Particles from 'react-particles-js';
import './App.css';
import Clarifai from 'clarifai';

const CLARIFAI_API_KEY = 'CLARIFAI API KEY';
const app = new Clarifai.App({apiKey: CLARIFAI_API_KEY});

const particleParams = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}

const initialState = {
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
    joined: '',
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = data => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }})};

  calculateFaceLocation = data => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height),
    }
  }

  renderFaceBox = box => {
    this.setState({box: box});
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
  }

  onButtonSubmit = async () => {
    // imageUrl used for displaying the image on the page, NOT for sending to the API
    this.setState({imageUrl: this.state.input})

    // we have to use the input state here, not the imageUrl. setState() is asynchronous, React bundles calls to
    // setState() together and updates the state in batches for performance reasons, so it will not have finished
    // updating the imageUrl state when we call the predict API.
    // https://reactjs.org/docs/react-component.html#setstate
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
        .then(response => {
          if (response) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(resp => resp.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, {
                  entries: count
                }))
              })
              .catch(console.error);
          }
          this.renderFaceBox(this.calculateFaceLocation(response))
        })
      .catch(err => console.error(err));
  }

  onRouteChange = route => {
    if (route === 'signin') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, route, imageUrl, box } = this.state;
    return (
      <div className="App">
        <Particles
          className='particles'
          params={particleParams}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition
                imageUrl={imageUrl}
                box={box}
              />
            </div>
          : (
              route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;
