import React from 'react';
// import { CircularProgress } from '@material-ui/core';
import './css/Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-overlay" />
      {/* <CircularProgress size={48} color="primary" /> */}
    </div>
  );
};

export default Loader;