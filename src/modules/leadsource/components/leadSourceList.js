import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header, Table, TableBody, Container, TableHeader, Button, Modal, Grid } from 'semantic-ui-react';
import userACL from '../../../store/access';
import Notification from '../../../utilities/notificationUtils';
import { deleteLeadSource, downloadLeadSourceExcel, fetchLeadSource, setNotifyDone } from '../data/actions'
import { getIsLeadSourceFetched, getNotification } from '../data/selectors'

const LeadSourceRow = (props) => {

  const dispatch = useDispatch()
  const isNegative = props.leadsource.status === 1 ? false : true

  const [isModalOpen, setModalOpen] = useState({ status: false, id: 0 })

  const deleteLeadSourceFromList = () => {
    const getVlaue = { id: isModalOpen.id }
    userACL.atUpdate(getVlaue)
    if (getVlaue.cid !== 0) {
      dispatch(deleteLeadSource(getVlaue))
      props.setDeleteId(getVlaue.id)
      setModalOpen({ status: false, id: 0 })
    }

  }

  const closeModal = () => {
    setModalOpen({ status: false, id: 0 })
  }
  if (props.leadsource.id !== 0 && props.leadsource.smType === 'Lead Source')
    return (
      <Table.Row>
        <Table.Cell>{props.leadsource.emp_name}</Table.Cell>
        <Table.Cell>{props.leadsource.emp_code}</Table.Cell>
        <Table.Cell>{props.leadsource.PAN_NO}</Table.Cell>
        <Table.Cell>
          {
            isNegative === false ?
              <>
                <Link to={"/leadsource/edit/" + props.leadsource.id} >Edit</Link><span>&nbsp;&nbsp;</span>
                <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => { setModalOpen({ status: true, id: props.leadsource.id }) }} >Delete</span>
              </>
              :
              <span>Deleted</span>
          }
          <Modal open={isModalOpen.status} size="mini">
            <Modal.Header>Lead Source List</Modal.Header>
            <Modal.Content>
              <h4>Do you want to delete this row</h4>
            </Modal.Content>
            <Modal.Actions>
              <Button type="button" negative onClick={() => closeModal()}>No</Button>
              <Button type="button" positive onClick={() => deleteLeadSourceFromList()}>Yes</Button>

            </Modal.Actions>
          </Modal>
        </Table.Cell>
      </Table.Row>
    )
  else {
    return null
  }
}

const LeadSourceList = (props) => {

  const leadsource = useSelector(state => state.leadsource.byId)
  const leadsourceFetched = useSelector(state => getIsLeadSourceFetched(state, props))
  const [deleteId, setDeleteId] = useState(false);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchLeadSource())
  }, [])
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("leadsource");
      obj.classList.add("markedMenuOpt");
  }, [])

  const downloadLeadSrcExcelRpt = () => {
    dispatch(downloadLeadSourceExcel())
  }

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Header as='h2' align='left'>Lead Source List</Header>
          </Grid.Column>
          <Grid.Column floated='right'>
            <Button type="button" size="small" basic color='green' outline='green' background='white' icon='download' onClick={() => downloadLeadSrcExcelRpt()}  ></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table selectable basic='very'>
        <TableHeader>
          <Table.Row>
            <Table.HeaderCell>Lead Source Name</Table.HeaderCell>
            <Table.HeaderCell>Lead Source Code</Table.HeaderCell>
            <Table.HeaderCell>PAN No</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </TableHeader>
        <TableBody>
          {Object.keys(leadsource).map((key) =>
            <LeadSourceRow leadsource={leadsource[key]} key={leadsource[key].id} setDeleteId={setDeleteId} />)}
        </TableBody>
      </Table>
      <>
        {
          deleteId ?
            <Notification id={deleteId} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='delete' />
            :
            null
        }
      </>
    </Container>
  )
}

export default LeadSourceList