import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import MtaxList from './components/mtaxList'
import MtaxForm from './components/mtaxForm'

const Mtax = () => {
    return (
        <Container>
            <Route path="/mtax/list" component={withRouter(MtaxList)} />
            <Route path="/mtax/edit/:id" component={MtaxForm} />
            <Route path="/mtax/create" component={MtaxForm} />
        </Container>
    )
}

export default Mtax