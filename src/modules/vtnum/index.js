import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import VtNumForm from "./components/vtnumForm"
import VtNumList from "./components/vtnumList"

const VtNum = () => {
    return (
        <Container>
            <Route path="/vt-num/list" component={withRouter(VtNumList)} />
            <Route path="/vt-num/edit/:id" component={VtNumForm} />
            <Route path="/vt-num/create" component={VtNumForm} />
        </Container>
    )
}

export default VtNum