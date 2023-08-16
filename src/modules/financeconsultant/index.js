import React from "react";
import { Route, withRouter } from "react-router-dom";
import { Container } from "semantic-ui-react";
import FinanceConsultantForm from "./components/financeConsultantForm";
import FinanceConsultantList from "./components/financeConsultantList";



const FinanceConsultant = () => {
    return (
        <Container>
            <Route path='/financeconsultant/list' component={withRouter(FinanceConsultantList)} />
            <Route path='/financeconsultant/edit/:id' component={FinanceConsultantForm} />
            <Route path='/financeconsultant/create' component={FinanceConsultantForm} />
        </Container>
    )
}

export default FinanceConsultant