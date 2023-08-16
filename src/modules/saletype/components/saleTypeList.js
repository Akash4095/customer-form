import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Header, Table, Container, TableRow, Modal, Button, Grid } from 'semantic-ui-react'
import userACL from '../../../store/access';
import Notification from '../../../utilities/notificationUtils';
import { getNotification } from '../data/selectors';
import { deleteSaleType, downloadSaleTypeExcel, fetchSaleType, setNotifyDone } from '../data/actions';

const SaleTypeRow = (props) => {

  const dispatch = useDispatch();
  const isNagative = props.saletype.status === 1 ? false : true
  const [isModalOpen, setModalOpen] = useState({ status: false, id: 0 })

  const deleteSaleTypeFromList = () => {
    const getVlaue = { id: isModalOpen.id }
    userACL.atUpdate(getVlaue)
    if (getVlaue.cid !== 0) {
      dispatch(deleteSaleType(getVlaue))
      props.setDeleteSaleTypeId(getVlaue.id)
      setModalOpen({ status: false, id: 0 })
    }


  }
  const closeModal = () => {
    setModalOpen({ status: false, id: 0 })
  }

  if (props.saletype.id !== 0)
    return (
      <TableRow>
        <Table.Cell width={4}>{props.saletype.saletype_name}</Table.Cell>
        <Table.Cell width={10}>{props.saletype.price_list}</Table.Cell>
        <Table.Cell>
          {
            isNagative === false ?
              <>
                <Link to={"/sale-type/edit/" + props.saletype.id} >Edit</Link><span>&nbsp;&nbsp;</span>
                <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => { setModalOpen({ status: true, id: props.saletype.id }) }} >Delete</span>
              </>
              : <span>Deleted</span>
          }
          <Modal open={isModalOpen.status} size="mini">
            <Modal.Header>SaleType List</Modal.Header>
            <Modal.Content>
              <h4>Do you want to delete this row</h4>
            </Modal.Content>
            <Modal.Actions>
              <Button type="button" negative onClick={() => closeModal()}>No</Button>
              <Button type="button" positive onClick={() => deleteSaleTypeFromList()}>Yes</Button>

            </Modal.Actions>
          </Modal>
        </Table.Cell>
      </TableRow>
    )
  else {
    return null
  }
}

const SaleTypeList = () => {

  const saletype = useSelector(state => state.saletype.byId)
  const dispatch = useDispatch()
  const [deleteSaleTypeId, setDeleteSaleTypeId] = useState(false);

  useEffect(() => {
    dispatch(fetchSaleType());
  }, []);
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("saletype");
      obj.classList.add("markedMenuOpt");
  }, [])

  
  const downloadSaleTypeExcelRpt = () => {
    dispatch(downloadSaleTypeExcel())
  }

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Header as='h2' align='left'>Sale Type List</Header>
          </Grid.Column>
          <Grid.Column floated='right'>
            <Button type="button" size="small" basic color='green' outline='green' background='white' icon='download' onClick={() => downloadSaleTypeExcelRpt()}  ></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table selectable basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={4}>Sale Type Name</Table.HeaderCell>
            <Table.HeaderCell width={10}>Price List Name</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(saletype).map((key) =>
            <SaleTypeRow saletype={saletype[key]} key={saletype[key].id} setDeleteSaleTypeId={setDeleteSaleTypeId} />)
          }
        </Table.Body>
      </Table>
      <>
        {

          deleteSaleTypeId ?
            <Notification id={deleteSaleTypeId} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='delete' />
            :
            null
        }
      </>
    </Container>
  )
}

export default SaleTypeList