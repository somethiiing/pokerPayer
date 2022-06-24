import React from 'react';

import ApiContext from './components/ApiContext';
import AdminPage from './components/views/Admin';
import LandingPage from './components/views/Landing';
import RoomPage from './components/views/Room';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 'admin',
    };
  }
  static contextType = ApiContext;

  changePage = (page) => {
    // landing, admin, game
    this.setState({currentPage: page});
  }

  // logColor = () => console.log(this.state.color);
  // changeColor = (color) => {this.setState({color})}

  render() {
    window.changePage = (page) => this.changePage(page);
    const { currentPage } = this.state;
    const { color, testContext } = this.context;

    return (
      <div className='App'>
        { currentPage === 'admin' && <AdminPage />}
        { currentPage === 'landing' && <LandingPage /> }
        { currentPage === 'room' && <RoomPage />}
      </div>
    );
  }
}

export default App;
