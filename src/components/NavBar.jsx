import React, { useState } from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  // MenuIcon,
  Modal,
} from '@mui/material';

import { PokerChipIcon } from './assets/PokerChipIconButton';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => { setOpen(true) };
  const handleClose = () => { setOpen(false) };

  return (
    <AppBar position="static">
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <PokerChipIcon />
          </IconButton>
          <Typography variant="h6" sx={{
            marginLeft: '12px'
          }}>
            PokerPayer
          </Typography>
        </div>
        <Button color="inherit" onClick={handleOpen}>
          Signup
        </Button>
      </Toolbar>
      {/* <Modal open={open} handleClose={handleClose} /> */}
    </AppBar>
  );
};

export default Navbar;