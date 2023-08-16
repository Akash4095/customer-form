import moment from 'moment';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Header, Modal, Table } from 'semantic-ui-react';
import userACL from '../../../store/access';
import Notification from '../../../utilities/notificationUtils';
import { deleteVtNum, downloadVtNumExcel, fetchVtNum, setNotifyDone } from '../data/actions';
import { getNotification } from '../data/selectors';



const VtNumRow = (props) => {

  const dispatch = useDispatch()
  const isNegative = props.vtnum.status === 1 ? false : true

  const [isModalOpen, setModalOpen] = useState({ status: false, id: 0 })

  const deleteVtNumFromList = () => {
    const getVlaue = { id: isModalOpen.id }
    userACL.atUpdate(getVlaue)
    if (getVlaue.cid !== 0) {
      dispatch(deleteVtNum(getVlaue))
      props.setDeleteId(getVlaue.id)
      setModalOpen({ status: false, id: 0 })
    }
  }


  const closeModal = () => {
    setModalOpen({ status: false, id: 0 })
  }

  return (
    <Table.Row>
      <Table.Cell>{props.vtnum.vth_name}</Table.Cell>
      <Table.Cell>
        {
          isNegative === false ?
            <>
              <Link to={"/vt-num/edit/" + props.vtnum.id} >Edit</Link><span>&nbsp;&nbsp;</span>
              <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => { setModalOpen({ status: true, id: props.vtnum.id }) }} >Delete</span>
            </>
            : <span>Deleted</span>
        }
        <Modal open={isModalOpen.status} size="mini">
          <Modal.Header>Voucher Type List</Modal.Header>
          <Modal.Content>
            <h4>Do you want to delete this row</h4>
          </Modal.Content>
          <Modal.Actions>
            <Button type="button" negative onClick={() => closeModal()}>No</Button>
            <Button type="button" positive onClick={() => deleteVtNumFromList()}>Yes</Button>

          </Modal.Actions>
        </Modal>
      </Table.Cell>
    </Table.Row>
  )

}

const VTNumList = () => {

  const vtnum = useSelector(state => state.vtnum.byId)
  const [deleteId, setDeleteId] = useState(false);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchVtNum())
  }, [])
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("vtnum");
      obj.classList.add("markedMenuOpt");
  }, [])

  const downloadVoucherTypeExcelRpt = () => {
    dispatch(downloadVtNumExcel())
  }

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Header as='h2' align='left'>Voucher Type List</Header>
          </Grid.Column>
          <Grid.Column floated='right'>
            <Button type="button" size="small" basic color='green' outline='green' background='white' icon='download' onClick={() => downloadVoucherTypeExcelRpt()}  ></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table selectable basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={14}>Voucher Type Name</Table.HeaderCell>
            <Table.HeaderCell width={2}>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(vtnum).map((key) =>
            <VtNumRow vtnum={vtnum[key]} key={vtnum[key].id} setDeleteId={setDeleteId} />)}
        </Table.Body>
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

export default VTNumList