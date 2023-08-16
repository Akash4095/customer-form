import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchFinanceConsultant, setNotifyDone, deleteFinanceConsultant, downloadFinanceConsultantExcel } from '../data/actions'
import { getIsFinanceConsultantFetched, getNotification } from '../data/selectors'
import { Header, Table, TableBody, Container, TableHeader, Modal, Button, Grid } from 'semantic-ui-react';
import Notification from '../../../utilities/notificationUtils';
import { Link } from 'react-router-dom';
import userACL from '../../../store/access';

const FinanceConsultantRow = (props) => {

  const dispatch = useDispatch()
  const isNegative = props.financeConsultant.status === 1 ? false : true

  const [isModalOpen, setModalOpen] = useState({ status: false, id: 0 })

  const deleteFinanceConsultantFromList = () => {
    const getVlaue = { id: isModalOpen.id }
    userACL.atUpdate(getVlaue)
    if (getVlaue.cid !== 0) {
      dispatch(deleteFinanceConsultant(getVlaue))
      props.setDeleteId(getVlaue.id)
      setModalOpen({ status: false, id: 0 })
    }


  }

  const closeModal = () => {
    setModalOpen({ status: false, id: 0 })
  }

  if (props.financeConsultant.id !== 0 && props.financeConsultant.smType === 'Finance Consultant')
    return (
      <Table.Row>
        <Table.Cell>{props.financeConsultant.emp_name}</Table.Cell>
        <Table.Cell>{props.financeConsultant.emp_code}</Table.Cell>
        <Table.Cell>
          {
            isNegative === false ?
              <>
                <Link to={"/financeconsultant/edit/" + props.financeConsultant.id} >Edit</Link><span>&nbsp;&nbsp;</span>
                <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => { setModalOpen({ status: true, id: props.financeConsultant.id }) }} >Delete</span>
              </>
              :
              <span>Deleted</span>
          }
          <Modal open={isModalOpen.status} size="mini">
            <Modal.Header>Finance Consultant List</Modal.Header>
            <Modal.Content>
              <h4>Do you want to delete this row</h4>
            </Modal.Content>
            <Modal.Actions>
              <Button type="button" negative onClick={() => closeModal()}>No</Button>
              <Button type="button" positive onClick={() => deleteFinanceConsultantFromList()}>Yes</Button>

            </Modal.Actions>
          </Modal>
        </Table.Cell>
      </Table.Row>
    )
  else {
    return null
  }
}

const FinanceConsultantList = (props) => {

  const financeConsultant = useSelector(state => state.financeConsultant.byId)
  const financeConsultantFetched = useSelector(state => getIsFinanceConsultantFetched(state, props))
  const [deleteId, setDeleteId] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchFinanceConsultant())
  })
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("financeconsultant");
      obj.classList.add("markedMenuOpt");
  }, [])

  const downloadFinConsltExcelRpt = () => {
    dispatch(downloadFinanceConsultantExcel())
  }

  return (
    <Container>

      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Header as='h2' align='left'>Finance Consultant List</Header>
          </Grid.Column>
          <Grid.Column floated='right'>
            <Button type="button" size="small" basic color='green' outline='green' background='white' icon='download' onClick={() => downloadFinConsltExcelRpt()}  ></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Table selectable basic='very'>
        <TableHeader>
          <Table.Row>
            <Table.HeaderCell>Finance Consultant Name</Table.HeaderCell>
            <Table.HeaderCell>Finance Consultant Code</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </TableHeader>

        <TableBody>
          {Object.keys(financeConsultant).map((key) =>
            <FinanceConsultantRow financeConsultant={financeConsultant[key]} key={financeConsultant[key].id} setDeleteId={setDeleteId} />)}
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

export default FinanceConsultantList