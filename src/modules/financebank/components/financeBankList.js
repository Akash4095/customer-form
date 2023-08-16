import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Header, Table, TableBody, Container, TableHeader, Button, Modal, Grid } from 'semantic-ui-react';
import { getIsFinanceBankFetched, getNotification } from '../data/selectors'
import { deleteFinanceBank, downloadFinanceBankExcel, fetchFinanceBank, setNotifyDone } from '../data/actions'
import { Link } from 'react-router-dom';
import Notification from '../../../utilities/notificationUtils';
import userACL from '../../../store/access';


const FinanceBankRow = (props) => {

  const dispatch = useDispatch()
  const isNegative = props.financeBank.status === 1 ? false : true

  const [isModalOpen, setModalOpen] = useState({ status: false, id: 0 })

  const deleteFinanceBankFromList = () => {
    const getVlaue = { id: isModalOpen.id }
    userACL.atUpdate(getVlaue)
    if (getVlaue.cid !== 0) {
      dispatch(deleteFinanceBank(getVlaue))
      props.setDeleteId(getVlaue.id)
      setModalOpen({ status: false, id: 0 })
    }
  }


  const closeModal = () => {
    setModalOpen({ status: false, id: 0 })
  }
  if (props.financeBank.id !== 0)
    return (
      <Table.Row>
        <Table.Cell>{props.financeBank.finbank_name}</Table.Cell>
        <Table.Cell>{props.financeBank.finbank_code}</Table.Cell>
        <Table.Cell>
          {
            isNegative === false ?
              <>
                <Link to={"/financebank/edit/" + props.financeBank.id} >Edit</Link><span>&nbsp;&nbsp;</span>
                <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => { setModalOpen({ status: true, id: props.financeBank.id }) }} >Delete</span>
              </>
              :
              <span>Deleted</span>
          }
          <Modal open={isModalOpen.status} size="mini">
            <Modal.Header>Finance Bank List</Modal.Header>
            <Modal.Content>
              <h4>Do you want to delete this row</h4>
            </Modal.Content>
            <Modal.Actions>
              <Button type="button" negative onClick={() => closeModal()}>No</Button>
              <Button type="button" positive onClick={() => deleteFinanceBankFromList()}>Yes</Button>

            </Modal.Actions>
          </Modal>
        </Table.Cell>
      </Table.Row>
    )
  else {
    return null
  }
}

const FinanceBankList = (props) => {

  const financeBank = useSelector(state => state.financebank.byId)
  const financeFetched = useSelector(state => getIsFinanceBankFetched(state, props))
  const [deleteId, setDeleteId] = useState(false);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchFinanceBank())
  }, [])
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("financebank");
      obj.classList.add("markedMenuOpt");
  }, [])

  const downloadFinBankExcelRpt = () => {
    dispatch(downloadFinanceBankExcel())
  }

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Header as='h2' align='left'>Finance Bank List</Header>
          </Grid.Column>
          <Grid.Column floated='right'>
            <Button type="button" size="small" basic color='green' outline='green' background='white' icon='download' onClick={() => downloadFinBankExcelRpt()}  ></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table selectable basic='very'>
        <TableHeader>
          <Table.Row>
            <Table.HeaderCell>Finance Bank Name</Table.HeaderCell>
            <Table.HeaderCell>Finance Bank Code</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </TableHeader>
        <TableBody>
          {Object.keys(financeBank).map((key) =>
            <FinanceBankRow financeBank={financeBank[key]} key={financeBank[key].id} setDeleteId={setDeleteId} />)}
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

export default FinanceBankList;