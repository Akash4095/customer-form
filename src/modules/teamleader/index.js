import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import TeamLeaderForm from './components/teamLeadForm'
import TeamLeaderList from './components/teamLeadList'

const TeamLeader = () => {
  return (
    <Container>
      <Route path="/teamleader/list" component={withRouter(TeamLeaderList)} />
      <Route path="/teamleader/edit/:id" component={TeamLeaderForm} />
      <Route path="/teamleader/create" component={TeamLeaderForm} />
    </Container>
  )
}

export default TeamLeader