import React from "react";
import { Route,withRouter } from "react-router";
import { Container } from "semantic-ui-react"
import SaleTypeForm from "./components/saleTypeForm";
import SaleTypeList from './components/saleTypeList'

const SaleType = () =>{
    return (
        <Container>
            <Route path='/sale-type/list' component={withRouter(SaleTypeList)} />
            <Route path='/sale-type/edit/:id' component={SaleTypeForm} />
            <Route path='/sale-type/create' component={SaleTypeForm} />
        </Container>
    )
}

export default SaleType;