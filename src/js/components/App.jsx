import React, { Component } from 'react';
import BoxesComponent from '../components/boxes/BoxesComponent.jsx';
import WorldComponent from './world/WorldComponent.jsx';
import CountryPickerComponent from './world/CountryPickerComponent.jsx';

class App extends Component {
    render() {
        //return (<BoxesComponent width={500} height={500} />);
        return (<WorldComponent width={500} height={500} />);
        //return (<CountryPickerComponent width={500} height={500} />)
    }
}

export default App;