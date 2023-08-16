import React from "react";
import { Route, withRouter } from "react-router-dom";
import { Container } from "semantic-ui-react";
import SalesManagerForm from './components/salesManagerForm'
import SalesManagerList from './components/salesManagerList'


const SalesManager = () => {
    return (
        <Container>
            <Route path='/salesmanager/list' component={withRouter(SalesManagerList)} />
            <Route path='/salesmanager/edit/:id' component={SalesManagerForm} />
            <Route path='/salesmanager/create' component={SalesManagerForm} />
        </Container>
    )
}

export default SalesManager;