import React from 'react'
import { Route,withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import FinanceBankForm from './components/financeBankForm';
import FinanceBankList from './components/financeBankList';

const FinanceBank = () => {
  return (
    <Container>
        <Route path='/financebank/list' component={withRouter(FinanceBankList)}  />
        <Route path='/financebank/edit/:id' component={FinanceBankForm} />
        <Route path='/financebank/create' component={FinanceBankForm} />
    </Container>
  )
}

export default FinanceBank;