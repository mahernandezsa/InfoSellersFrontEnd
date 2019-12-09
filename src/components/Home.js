import React from 'react';
import { connect } from 'react-redux';

const Home = props => (
  <div>
    <h1>Hello!</h1>
    <p>Welcome to InfoSeller Solution</p>    
  </div>
);

export default connect()(Home);
