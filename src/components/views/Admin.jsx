import React from 'react';
import { Grid } from '@mui/material';

import NavBar from '../NavBar';

const AdminPage = () => {
  return (
    <>
      <NavBar />
      <Grid container sx={{
        width: '100%',
        height: '100%'
      }}>
        <Grid item xs={4} sx={{
          borderRight: '1px solid black'
        }}>

        </Grid>
        <Grid item xs={4} sx={{
          borderRight: '1px solid black'
        }}>

        </Grid>
        <Grid item xs={4}>

        </Grid>
      </Grid>
    </>
  );
}

export default AdminPage