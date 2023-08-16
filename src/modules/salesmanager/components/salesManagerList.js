import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Header, Modal, Table, Button, Grid } from 'semantic-ui-react'
import { deleteSalesmanager, downloadSalesmanagerExcel, fetchSalesmanager, setNotifyDone } from '../data/actions'
import { getIsSalesmanagerFetched, getNotification } from '../data/selectors'
import Notification from '../../../utilities/notificationUtils'
import userACL from '../../../store/access'
import { useEffect } from 'react'


const SalesmanagerRow = (props) => {

  const dispatch = useDispatch()
  const isNagative = parseInt(props.salesmanager.status, 10) === 1 ? false : true;
  const [isModalOpen, setModalOpen] = useState({ status: false, id: 0 })

  const deleteSalesmanagerFromList = () => {
    const getVlaue = { id: isModalOpen.id }
    userACL.atUpdate(getVlaue)
    if (getVlaue.cid !== 0) {
      dispatch(deleteSalesmanager(getVlaue))
      props.setDeleteSalesmanagerId(getVlaue.id)
      setModalOpen({ status: false, id: 0 })
    }

  }

  const closeModal = () => {
    setModalOpen({ status: false, id: 0 })
  }

  if (props.salesmanager.id !== 0 && props.salesmanager.smType === 'Sales Manager')
    return (
      <Table.Row>
        <Table.Cell>{props.salesmanager.emp_name}</Table.Cell>
        <Table.Cell>{props.salesmanager.emp_code}</Table.Cell>
        <Table.Cell>{props.salesmanager.mobile}</Table.Cell>
        <Table.Cell>{props.salesmanager.PAN_NO}</Table.Cell>
        <Table.Cell>
          {
            isNagative === false ?
              <>
                <Link to={"/salesmanager/edit/" + props.salesmanager.id} >Edit</Link><span>&nbsp;&nbsp;</span>
                <span style={{ cursor: "pointer", color: "red" }} onClick={() => { setModalOpen({ status: true, id: props.salesmanager.id }) }} >Delete</span>
              </>
              :
              <span>Deleted</span>
          }
          <Modal open={isModalOpen.status} size="mini">
            <Modal.Header>
              Sales Manager List
            </Modal.Header>
            <Modal.Content>
              <h4>Do you want to delete this row</h4>
            </Modal.Content>
            <Modal.Actions>
              <Button type="button" negative onClick={() => closeModal()}>No</Button>
              <Button type="button" positive onClick={() => deleteSalesmanagerFromList()}>Yes</Button>
            </Modal.Actions>
          </Modal>
        </Table.Cell>
      </Table.Row>
    )
  else
    return null

}



const SalesManagerList = (props) => {

  const salesmanager = useSelector(state => state.salesmanager.byId)
  const salesmanagerFetched = useSelector(state => getIsSalesmanagerFetched(state, props))
  const [deleteSalesmanagerId, setDeleteSalesmanagerId] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchSalesmanager());
  }, [])
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("salesmanager");
      obj.classList.add("markedMenuOpt");
  }, [])

  const downloadSalesmanagerExcelRpt = () => {
    dispatch(downloadSalesmanagerExcel())
  }
  
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Header as='h2'>Sales Manager List</Header>
          </Grid.Column>
          <Grid.Column floated='right'>
            <Button type="button" size="small" basic color='green' outline='green' background='white' icon='download' onClick={() => downloadSalesmanagerExcelRpt()}  ></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table selectable basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Sales Manager Name</Table.HeaderCell>
            <Table.HeaderCell>Sales Manager Code</Table.HeaderCell>
            <Table.HeaderCell>Mobile No</Table.HeaderCell>
            <Table.HeaderCell>PAN No</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            Object.keys(salesmanager).map((key) =>
              <SalesmanagerRow salesmanager={salesmanager[key]} key={salesmanager[key].id} setDeleteSalesmanagerId={setDeleteSalesmanagerId} />)
          }
        </Table.Body>
      </Table>
      <>
        {
          deleteSalesmanagerId ?
            <Notification id={deleteSalesmanagerId} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='delete' />
            :
            null
        }
      </>
    </Container>

  )
}

export default SalesManagerList