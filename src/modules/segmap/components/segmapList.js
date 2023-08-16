import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSegmap, downloadSegmapExcel, fetchSegmap, setNotifyDone } from "../data/actions"
import { getNotification } from '../data/selectors'
import { Button, Container, Grid, Header, Modal, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import userACL from '../../../store/access'
import Notification from '../../../utilities/notificationUtils'



const SegmapRow = (props) => {

  const dispatch = useDispatch()
  const isNegative = props.segmap.status === 1 ? false : true

  const [isModalOpen, setModalOpen] = useState({ status: false, id: 0 })

  const deleteSegmapFromList = () => {
    const getVlaue = { id: isModalOpen.id }
    userACL.atUpdate(getVlaue)
    if (getVlaue.cid !== 0) {
      dispatch(deleteSegmap(getVlaue))
      props.setDeleteId(getVlaue.id)
      setModalOpen({ status: false, id: 0 })
    }

  }

  const closeModal = () => {
    setModalOpen({ status: false, id: 0 })
  }
  if (props.segmap.id !== 0)
    return (
      <Table.Row>
        <Table.Cell>{props.segmap.name}</Table.Cell>
        <Table.Cell>{props.segmap.account}</Table.Cell>
        <Table.Cell>{props.segmap.godown}</Table.Cell>
        <Table.Cell>{props.segmap.gstin}</Table.Cell>
        <Table.Cell>{props.segmap.cid}</Table.Cell>
        <Table.Cell>{props.segmap.segid}</Table.Cell>
        <Table.Cell>
          {
            isNegative === false ?
              <>
                <Link to={"/segmap/clone/" + props.segmap.id} >Clone</Link><span>&nbsp;&nbsp;</span>
                <Link to={"/segmap/edit/" + props.segmap.id} >Edit</Link><span>&nbsp;&nbsp;</span>
                <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => { setModalOpen({ status: true, id: props.segmap.id }) }} >Delete</span>
              </>
              :
              <span>Deleted</span>
          }
          <Modal open={isModalOpen.status} size="mini">
            <Modal.Header>Voucher Mapping List</Modal.Header>
            <Modal.Content>
              <h4>Do you want to delete this row</h4>
            </Modal.Content>
            <Modal.Actions>
              <Button type="button" negative onClick={() => closeModal()}>No</Button>
              <Button type="button" positive onClick={() => deleteSegmapFromList()}>Yes</Button>

            </Modal.Actions>
          </Modal>
        </Table.Cell>
      </Table.Row>
    )
  else {
    return null
  }
}


const SegmapList = () => {

  const segmap = useSelector(state => state.segmap.byId)
  const [deleteId, setDeleteId] = useState(false);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchSegmap())
  }, [])
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("segmap");
      obj.classList.add("markedMenuOpt");
  }, [])

  const downloadVoucherMappingExcelRpt = () => {
    dispatch(downloadSegmapExcel())
  }

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Header as='h2' align='left'>Voucher Mapping List</Header>
          </Grid.Column>
          <Grid.Column floated='right'>
            <Button type="button" size="small" basic color='green' outline='green' background='white' icon='download' onClick={() => downloadVoucherMappingExcelRpt()}  ></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table selectable basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={3}>Name</Table.HeaderCell>
            <Table.HeaderCell>Account</Table.HeaderCell>
            <Table.HeaderCell>Godown</Table.HeaderCell>
            <Table.HeaderCell>GSTIN</Table.HeaderCell>
            <Table.HeaderCell>Cid</Table.HeaderCell>
            <Table.HeaderCell>Segid</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(segmap).map((key) =>
            <SegmapRow segmap={segmap[key]} key={segmap[key].id} setDeleteId={setDeleteId} />)}
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

export default SegmapList