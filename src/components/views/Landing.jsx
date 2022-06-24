import React, { useState, useContext } from 'react';
import { Grid, Box, TextField, Button } from '@mui/material';

import ApiContext from '../ApiContext';

const LandingPage = () => {
  const { color, joinRoom } = useContext(ApiContext);

  const [roomCode, setRoomCode] = useState('');
  const [venmoId, setVenmoId] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleJoinRoom = () => {
    joinRoom({ roomCode, venmoId, displayName });
  }

  return (
    <div style={{
      height: '100%',
      width: '100%'
    }}>
      <Grid container sx={{
        height: '100%',
        width: '100%',
      }}>
        <Grid item xs={4}
          sx={{
            backgroundColor: 'lightblue',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '80%'
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <TextField
                required
                id="outlined-required"
                label='Room Code'
                value={roomCode}
                onChange={e => setRoomCode(e.target.value)}
              />
              <br />
              <br />
              <TextField
                required
                id="outlined-required"
                label='Venmo ID'
                value={venmoId}
                onChange={e => setVenmoId(e.target.value)}
              />
              <br />
              <TextField
                required
                id="outlined-required"
                label='Display Name'
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />
              <br />
              <div style={{
                display: 'flex',
                justifyContent: 'space-evenly'
              }}>
                <Button variant="contained"
                  sx={{
                    height: '55px'
                  }}
                  onClick={handleJoinRoom}
                >Join Room</Button>
                <Button variant="outlined"
                  sx={{
                    height: '50px'
                  }}
                >Re-join Room</Button>
              </div>
            </div>
          </Box>
        </Grid>
        <Grid item xs={8}
          sx={{
            backgroundColor: 'gray'
          }}
        />

      </Grid>
    </div>
  );
}

export default LandingPage;
