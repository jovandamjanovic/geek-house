import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import ghLarge from '../public/gh_large.png';
import Image from 'next/image';

const TopMenu = () => {
  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <IconButton edge='start' color='inherit' aria-label='menu'>
            <Image src={ghLarge} alt='main logo' style={{width: '48px', height: 'auto'}}/>
          </IconButton>
          <Typography variant='h6'>Geek House</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopMenu;
