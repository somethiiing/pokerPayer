import React from 'react';
import LandingPage from './components/views/Landing';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className='App'>
        <LandingPage />
      </div>
    );
  }
}

export default App;
