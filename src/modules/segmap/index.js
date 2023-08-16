import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import SegmapForm from './components/segmapForm'
import SegmapList from './components/segmapList'

const Segmap = () => {
    return (
        <Container>
            <Route path="/segmap/list" component={withRouter(SegmapList)} />
            <Route path="/segmap/edit/:id" component={SegmapForm} />
            <Route path="/segmap/clone/:id" component={SegmapForm} />
            <Route path="/segmap/create" component={SegmapForm} />
        </Container>
    )
}

export default Segmap