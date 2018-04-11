import React, { Component } from 'react';
import './App.css';
 
import InputForm from './containers/InputForm/InputForm';


class App extends Component {
  render() {
    return (
      <div className="App">        
		<h1>Web Page Analyzer</h1>
		<InputForm />		
      </div>
    );
  }
}

export default App;
