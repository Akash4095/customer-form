import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import FormTypeList from './components/formTypeList'
import FormTypeForm from './components/formTypeForm'

const FormType = () => {
    return (
        <Container>
            <Route path='/form-type/list' component={withRouter(FormTypeList)} />
            <Route path='/form-type/edit/:id' component={FormTypeForm} />
            <Route path='/form-type/create' component={FormTypeForm} />
        </Container>
    )
}

export default FormType