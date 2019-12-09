import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import BikeSellerList from './components/BikeSellerList';

export default () => (
  <Layout>
    <Route exact path='/' component={Home} />   
    <Route exact path='/bikeSeller' component={BikeSellerList} />
  </Layout>
);
