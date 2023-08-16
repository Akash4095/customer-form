import React from 'react'
import { Route, withRouter } from 'react-router';
import { Container } from 'semantic-ui-react';
import CiForm from './components/ciForm'
import CiFormView from './components/ciFormView'
import CiFormList from './components/ciFormList'
import CiFormSummaryD from './components/ciFormSummaryD'

const CiFormIndex = () => {
  return (
    <Container>
        <Route path='/ciform/list' component={withRouter(CiFormList)} />
        <Route path='/ciform/edit/:id' component={CiForm} />
        <Route path='/ciform/view/:id' component={CiFormView} />
        <Route path='/ciform/summary/:id' component={CiFormSummaryD} />
        <Route path='/ciform/create' component={CiForm} />
    </Container>
  )
}

export default CiFormIndex;