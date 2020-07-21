import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import 'tachyons';
import './App.css';


const app = new Clarifai.App({
 apiKey: '95617e823f3a4e12b0ee494952938ddb'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
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
      box: {}
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // return clarifaiFace
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
      // rightCol: clarifaiFace.right_col * width,
      // bottomRow: clarifaiFace.bottom_row * height
    }
    //  return {
    //   leftCol: clarifaiFace.left_col,
    //   topRow: clarifaiFace.top_row,
    //   // rightCol: width - (clarifaiFace.right_col * width),
    //   // bottomRow: height - (clarifaiFace.bottom_row * height)
    //   rightCol: clarifaiFace.right_col,
    //   bottomRow: clarifaiFace.bottom_row,
    // }
  }




  onInputChange = (event) => {
    // console.log(event.target.value);
    // console.log(app.models.initModel);
    // console.log(app.models.initModel.predict);
    this.setState({input:event.target.value});
  }


displayFaceBox = (box) => {
  console.log(box);
  this.setState({box: box});
}

/*  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.initModel(Clarifai.FACE_DETECT_MODEL)
          .then(resp => {
            // const data = resp.predict(this.state.input)
            // return console.log(data._55.rawData.outputs[0].data.regions[0].region_info.bounding_box);
            return console.log(resp.predict(this.state.input));
          })
          // .then(response => {
          //   var concepts = response['outputs'][0]['data']['concepts']
          //   return console.log(concepts);
          // })
          .catch((err)=>console.log('errorrrr',err))
  }*/


  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(resp => this.displayFaceBox(this.calculateFaceLocation(resp)))
      // .then(resp => console.log(this.calculateFaceLocation(resp)))
      .catch((err)=>console.log('errorrrr',err))
  }



  render() {
      return (
        <div className="App">
          <header className="App-header">
            <Particles className='particles'
              params={particlesOptions}
            />
            <Navigation />
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </header>
        </div>
      );
    }
}

export default App;
