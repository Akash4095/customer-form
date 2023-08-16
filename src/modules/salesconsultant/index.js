import React, { useEffect } from "react";
import { Route,withRouter } from "react-router";
import { Container } from "semantic-ui-react"
import SalesConsultantForm from "./components/salesConsultantForm";
import SalesConsultantList from './components/salesCosultantList'

const SalesConsultant = (props) =>{
    return (
        <Container>
            <Route path='/salesconsultant/list' component={withRouter(SalesConsultantList)} />
            <Route path='/salesconsultant/edit/:id' component={SalesConsultantForm} />
            <Route path='/salesconsultant/create' component={SalesConsultantForm} />
        </Container>
    )
}

export default SalesConsultant;