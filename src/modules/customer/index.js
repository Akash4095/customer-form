import React from 'react'
import { Route,withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import CustomerForm from './components/customerForm';

const Customer = () => {
  return (
    <Container>
        {/* <Route path='/customer/list' component={withRouter()}  /> */}
        <Route path='/customer/edit/:id' component={CustomerForm } />
        <Route path='/customer/create' component={CustomerForm } />
    </Container>
  )
}

export default Customer;