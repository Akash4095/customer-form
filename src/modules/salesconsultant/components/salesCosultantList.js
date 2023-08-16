import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Table, TableHeader, TableBody, Header, Modal, Button, Grid } from 'semantic-ui-react'
import userACL from '../../../store/access'
import { deleteSalesConsultant, downloadSalesConsultantExcel, fetchSalesConsultant, setNotifyDone } from '../data/actions';
import { getNotification, getNotificationList, getIsSalesConsultantFetched } from '../data/selectors'
import Notification from '../../../utilities/notificationUtils'
import { selectSalesManager } from '../../salesmanager/data/selectors';
import { fetchSalesmanager } from '../../salesmanager/data/actions';

const SalesConsultantRow = props => {

  const dispatch = useDispatch();
  const isNegative = props.salesConsultant.status === 1 ? false : true;
  const salesmanager = useSelector(state => state.salesmanager.byId[props.salesConsultant.prnt_id])
  const data = useSelector(state => selectSalesManager(state, props))

  const [isModalOpen, setModalOpen] = useState({ status: false, id: 0 })

  const deleteSalesManFromList = () => {
    const getVlaue = { id: isModalOpen.id }
    userACL.atUpdate(getVlaue)
    if (getVlaue.cid !== 0) {
      dispatch(deleteSalesConsultant(getVlaue))
      props.setDeleteSalesConsultantId(getVlaue.id)
      setModalOpen({ status: false, id: 0 })
    }

  }

  const closeModal = () => {
    setModalOpen({ status: false, id: 0 })
  }
  if (props.salesConsultant.id !== 0 && props.salesConsultant.smType === 'Sales Consultant')
    return (
      <Table.Row >
        <Table.Cell>{props.salesConsultant.emp_name}</Table.Cell>
        <Table.Cell>{props.salesConsultant.emp_code}</Table.Cell>
        <Table.Cell>{salesmanager ? salesmanager.emp_name.concat(salesmanager.emp_code ? ` [ ${salesmanager.emp_code} ]` : "") : ''}</Table.Cell>
        {/* <Table.Cell>{props.salesConsultant.prnt_id}</Table.Cell> */}
        <Table.Cell>{props.salesConsultant.mobile}</Table.Cell>
        <Table.Cell>{props.salesConsultant.PAN_NO}</Table.Cell>
        <Table.Cell>
          {isNegative === false ?
            <>
              <Link to={"/salesconsultant/edit/" + props.salesConsultant.id}>Edit</Link><span>&nbsp;&nbsp;</span>
              <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => { setModalOpen({ status: true, id: props.salesConsultant.id }) }} >Delete</span>
            </>
            :
            <span>Deleted</span>
          }
          <Modal open={isModalOpen.status} size="mini">
            <Modal.Header>Sales Consultant List</Modal.Header>
            <Modal.Content>
              <h4>Do you want to delete this row</h4>
            </Modal.Content>
            <Modal.Actions>
              <Button type="button" negative onClick={() => closeModal()}>No</Button>
              <Button type="button" positive onClick={() => deleteSalesManFromList()}>Yes</Button>

            </Modal.Actions>
          </Modal>
        </Table.Cell>
      </Table.Row>
    )
  else
    return null

}

const SalesConsultantList = (props) => {

  const salesConsultant = useSelector(state => state.salesConsultant.byId)
  const salesConsultantFetched = useSelector(state => getIsSalesConsultantFetched(state, props))
  const dispatch = useDispatch();
  const notificationList = (state => getNotificationList(state))
  const [deleteSalesConsultantId, setDeleteSalesConsultantId] = useState(false);

  useEffect(() => {
    dispatch(fetchSalesConsultant());
    dispatch(fetchSalesmanager())
  }, []);

  useEffect(() => {
    if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
      if(document.getElementsByClassName("markedMenuOpt")[0].classList){
        document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
      }
    }
    let obj = document.getElementById("salesconsultant");
    obj.classList.add("markedMenuOpt");
  }, [])

  const downloadSalesConsultantExcelRpt = () => {
    dispatch(downloadSalesConsultantExcel())
  }

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Header as='h2' align='left'>Sales Consultant List</Header>
          </Grid.Column>
          <Grid.Column floated='right'>
            <Button type="button" size="small" basic color='green' outline='green' background='white' icon='download' onClick={() => downloadSalesConsultantExcelRpt()}  ></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table selectable basic='very'>
        <TableHeader>
          <Table.Row>
            <Table.HeaderCell>Sales Consultant Name</Table.HeaderCell>
            <Table.HeaderCell>Sales Consultant Code</Table.HeaderCell>
            <Table.HeaderCell>Team Leader</Table.HeaderCell>
            <Table.HeaderCell>Mobile No</Table.HeaderCell>
            <Table.HeaderCell>PAN No</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </TableHeader>
        <TableBody>
          {Object.keys(salesConsultant).map((key) =>
            <SalesConsultantRow salesConsultant={salesConsultant[key]} key={salesConsultant[key].id} setDeleteSalesConsultantId={setDeleteSalesConsultantId} />)}
        </TableBody>
      </Table>
      <>
        {
          deleteSalesConsultantId ?
            <Notification id={deleteSalesConsultantId} extra={getNotificationList} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='delete' />
            :
            null
        }
      </>
    </Container>
  )

}

export default SalesConsultantList