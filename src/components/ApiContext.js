import React from 'react';
import axios from 'axios';

const ApiContext = React.createContext();

class ApiContextProvider extends React.Component {
  state = {
    room: '',
    player: {}
  }

  testContext = () => {
    console.log(this.state.color)
  }

  createRoom = () => {
    axios.get('/api/joinRoom')
    .then(res => {
      console.log(res)
      this.setState({})
    })
  }

  joinRoom = ({roomCode, venmoId, displayName}) => {
    axios.get('/api/joinRoom',{
      roomCode, venmoId, displayName
    })
    .then(res => {
      console.log(res)
    })
  }

  render() {
    const { children } = this.props;
    const value = {
      color: this.state.color,
      testContext: this.testContext,
    }
    return (
      <ApiContext.Provider
        value={value}
      >
        {children}
      </ApiContext.Provider>
    );
  }
}

export default ApiContext;

export { ApiContextProvider };
