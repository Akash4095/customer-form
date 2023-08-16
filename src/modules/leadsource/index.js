import React from "react";
import { Route, withRouter } from "react-router-dom";
import { Container } from "semantic-ui-react";
import LeadSourceForm from './components/leadSourceForm'
import LeadSourceList from './components/leadSourceList'


const LeadSource = () => {
    return (
        <Container>
            <Route path='/leadsource/list' component={withRouter(LeadSourceList)} />
            <Route path='/leadsource/edit/:id' component={LeadSourceForm} />
            <Route path='/leadsource/create' component={LeadSourceForm} />
        </Container>
    )
}

export default LeadSource;