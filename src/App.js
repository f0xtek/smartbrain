import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
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

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
    }
  }

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
      .then(response => this.renderFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.error(err));
}

  render() {
    return (
      <div className="App">
        <Particles
          className='particles'
          params={particleParams}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition
          imageUrl={this.state.imageUrl}
          box={this.state.box}
        />
      </div>
    );
  }
}

export default App;
