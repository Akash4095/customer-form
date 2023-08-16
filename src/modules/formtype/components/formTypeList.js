import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Header, Table, Container, TableRow, Modal, Button, Grid } from 'semantic-ui-react'
import userACL from '../../../store/access';
import Notification from '../../../utilities/notificationUtils';
import { getNotification } from '../data/selectors';
import { deleteFormType, downloadFormtypeExcel, fetchFormType, setNotifyDone } from '../data/actions';

const FormTypeRow = (props) => {

  const dispatch = useDispatch();

  const isNagative = parseInt(props.formtype.status, 10) === 1 ? false : true
  const [isModalOpen, setModalOpen] = useState({ status: false, id: 0 })

  const deleteFormTypeFromList = () => {
    const getVlaue = { id: isModalOpen.id }
    userACL.atUpdate(getVlaue)
    if (getVlaue.cid !== 0) {
      dispatch(deleteFormType(getVlaue))
      props.setDeleteFormTypeId(getVlaue.id)
      setModalOpen({ status: false, id: 0 })
    }

  }
  const closeModal = () => {
    setModalOpen({ status: false, id: 0 })
  }

  if (props.formtype.id !== 0)
    return (
      <TableRow>
        <Table.Cell>{props.formtype.stype_name}</Table.Cell>
        <Table.Cell>{props.formtype.numbering}</Table.Cell>
        <Table.Cell>
          {
            isNagative === false ?

              <>
                <Link to={"/form-type/edit/" + props.formtype.id} >Edit</Link><span>&nbsp;&nbsp;</span>
                <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => { setModalOpen({ status: true, id: props.formtype.id }) }} >Delete</span>
              </>
              : <span>Deleted</span>
          }
          <Modal open={isModalOpen.status} size="mini">
            <Modal.Header>FormType List</Modal.Header>
            <Modal.Content>
              <h4>Do you want to delete this row</h4>
            </Modal.Content>
            <Modal.Actions>
              <Button type="button" negative onClick={() => closeModal()}>No</Button>
              <Button type="button" positive onClick={() => deleteFormTypeFromList()}>Yes</Button>

            </Modal.Actions>
          </Modal>
        </Table.Cell>
      </TableRow>
    )
  else {
    return null
  }
}

const FormTypeList = () => {

  const formtype = useSelector(state => state.formtype.byId)
  const dispatch = useDispatch()
  const [deleteFormTypeId, setDeleteFormTypeId] = useState(false);

  useEffect(() => {
    dispatch(fetchFormType());
  }, []);
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("formtype");
      obj.classList.add("markedMenuOpt");
  }, [])

  const downloadFormTypeExcelRpt = () => {
    dispatch(downloadFormtypeExcel())
  }
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Header as='h2' align='left'>Form Type List</Header>
          </Grid.Column>
          <Grid.Column floated='right'>
            <Button type="button" size="small" basic color='green' outline='green' background='white' icon='download' onClick={() => downloadFormTypeExcelRpt()}  ></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table selectable basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={7}>FormType Name</Table.HeaderCell>
            <Table.HeaderCell width={6} >Numbering</Table.HeaderCell>
            <Table.HeaderCell width={4}>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(formtype).map((key) =>
            <FormTypeRow formtype={formtype[key]} key={formtype[key].id} setDeleteFormTypeId={setDeleteFormTypeId} />)
          }
        </Table.Body>
      </Table>
      <>
        {

          deleteFormTypeId ?
            <Notification id={deleteFormTypeId} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='delete' />
            :
            null
        }
      </>
    </Container>
  )
}

export default FormTypeList