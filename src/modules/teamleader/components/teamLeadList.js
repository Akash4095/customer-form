import React, { useState, useEffect } from 'react'
import { fetchSalesmanager } from '../../salesmanager/data/actions';
import { getNotification, getNotificationList } from '../data/selectors'
import { deleteTeamleader, downloadTeamleaderExcel, fetchTeamleader, setNotifyDone, } from '../data/actions'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Notification from '../../../utilities/notificationUtils'
import { Container, Table, TableHeader, TableBody, Header, Modal, Button, Grid } from 'semantic-ui-react'
import userACL from '../../../store/access'
import { selectSalesManager } from '../../salesmanager/data/selectors';


const TeamleaderRow = props => {

  const dispatch = useDispatch();
  const isNegative = props.teamleader.status === 1 ? false : true;
  const salesmanager = useSelector(state => state.salesmanager.byId[props.teamleader.prnt_id])
  const data = useSelector(state => selectSalesManager(state, props))

  const [isModalOpen, setModalOpen] = useState({ status: false, id: 0 })

  const deleteTeamleaderFromList = () => {
    const getVlaue = { id: isModalOpen.id }
    userACL.atUpdate(getVlaue)
    if (getVlaue.cid !== 0) {
      dispatch(deleteTeamleader(getVlaue))
      props.setDeleteTeamleaderId(getVlaue.id)
      setModalOpen({ status: false, id: 0 })
    }

  }

  const closeModal = () => {
    setModalOpen({ status: false, id: 0 })
  }
  if (props.teamleader.id !== 0 && props.teamleader.smType === 'Team Leader')
    return (
      <Table.Row >
        <Table.Cell>{props.teamleader.emp_name}</Table.Cell>
        <Table.Cell>{props.teamleader.emp_code}</Table.Cell>
        <Table.Cell>{salesmanager ? salesmanager.emp_name.concat(salesmanager.emp_code ? ` [ ${salesmanager.emp_code} ]` : "") : ''}</Table.Cell>
        {/* <Table.Cell>{props.teamleader.prnt_id}</Table.Cell> */}
        <Table.Cell>{props.teamleader.mobile}</Table.Cell>
        <Table.Cell>{props.teamleader.PAN_NO}</Table.Cell>
        <Table.Cell>
          {isNegative === false ?
            <>
              <Link to={"/teamleader/edit/" + props.teamleader.id}>Edit</Link><span>&nbsp;&nbsp;</span>
              <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => { setModalOpen({ status: true, id: props.teamleader.id }) }} >Delete</span>
            </>
            :
            <span>Deleted</span>
          }
          <Modal open={isModalOpen.status} size="mini">
            <Modal.Header>Team Leader List</Modal.Header>
            <Modal.Content>
              <h4>Do you want to delete this row</h4>
            </Modal.Content>
            <Modal.Actions>
              <Button type="button" negative onClick={() => closeModal()}>No</Button>
              <Button type="button" positive onClick={() => deleteTeamleaderFromList()}>Yes</Button>

            </Modal.Actions>
          </Modal>
        </Table.Cell>
      </Table.Row>
    )
  else
    return null

}

const TeamLeaderList = () => {
  const teamleader = useSelector(state => state.teamleader.byId)
  const dispatch = useDispatch();
  // const notificationList = (state => getNotificationList(state))
  const [deleteTeamleaderId, setDeleteTeamleaderId] = useState(false);

  useEffect(() => {
    dispatch(fetchTeamleader());
    dispatch(fetchSalesmanager())
  }, []);
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("teamleader");
      obj.classList.add("markedMenuOpt");
  }, [])

  const downloadTeamleaderExcelRpt = () => {
    dispatch(downloadTeamleaderExcel())
  }

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Header as='h2' align='left'>Team Leader List</Header>
          </Grid.Column>
          <Grid.Column floated='right'>
            <Button type="button" size="small" basic color='green' outline='green' background='white' icon='download' onClick={() => downloadTeamleaderExcelRpt()}  ></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table selectable basic='very'>
        <TableHeader>
          <Table.Row>
            <Table.HeaderCell>Team Leader Name</Table.HeaderCell>
            <Table.HeaderCell>Team Leader Code</Table.HeaderCell>
            <Table.HeaderCell>Manager</Table.HeaderCell>
            <Table.HeaderCell>Mobile No</Table.HeaderCell>
            <Table.HeaderCell>PAN No</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </TableHeader>
        <TableBody>
          {Object.keys(teamleader).map((key) =>
            <TeamleaderRow teamleader={teamleader[key]} key={teamleader[key].id} setDeleteTeamleaderId={setDeleteTeamleaderId} />)}
        </TableBody>
      </Table>
      <>
        {
          deleteTeamleaderId ?
            <Notification id={deleteTeamleaderId} extra={getNotificationList} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='delete' />
            :
            null
        }
      </>
    </Container>
  )
}

export default TeamLeaderList