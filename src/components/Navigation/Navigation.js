import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
        <p onClick={() => onRouteChange('signin')} className='pa1 mr3 f3 link black underline pointer'> Sign Out </p>
      </nav>
    );
  } else {
    return (
      <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
        <p onClick={() => onRouteChange('signin')} className='pa1 mr3 f3 link black underline pointer'> Sign In </p>
        <p onClick={() => onRouteChange('register')} className='pa1 mr3 f3 link black underline pointer'> Register </p>
      </nav>
    );
  }
}

export default Navigation;