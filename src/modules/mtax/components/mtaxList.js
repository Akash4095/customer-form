import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Header, Table, Container, TableRow, Modal, Button, Icon, Grid } from 'semantic-ui-react'
import userACL from '../../../store/access';
import Notification from '../../../utilities/notificationUtils';
import { getNotification } from '../data/selectors';
import { deleteMtax, downloadMtaxExcel, fetchMtax, setNotifyDone } from '../data/actions';
import moment from 'moment';

const MtaxRow = (props) => {

  const dispatch = useDispatch();

  const [view, setView] = useState(false)
  const isNagative = parseInt(props.mtax.status, 10) === 1 ? false : true
  const [isModalOpen, setModalOpen] = useState({ status: false, id: 0 })

  const deleteMtaxFromList = () => {
    const getVlaue = { id: isModalOpen.id }
    userACL.atUpdate(getVlaue)
    if (getVlaue.cid !== 0) {
      dispatch(deleteMtax(getVlaue))
      props.setDeleteMtaxId(getVlaue.id)
      setModalOpen({ status: false, id: 0 })
    }

  }
  const closeModal = () => {
    setModalOpen({ status: false, id: 0 })
  }

  let arr = props.mtax.taxetails.sort((a, b) => {
    return (parseInt(a.sr_no, 10) - parseInt(b.sr_no, 10))
  })

  if (props.mtax.id !== 0)
    return (
      <>
        <TableRow>
          <Table.Cell>{props.mtax.city}</Table.Cell>

          <Table.Cell>
            {
              isNagative === false ?

                <>
                  <Link to={"/mtax/edit/" + props.mtax.id} >Edit</Link><span>&nbsp;&nbsp;</span>
                  <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => { setModalOpen({ status: true, id: props.mtax.id }) }} >Delete</span>
                  <span>
                    <span>&nbsp;&nbsp;</span>
                    <span onClick={() => setView(!view)} >
                      <Icon className='eyeSymbol mtax' name='eye' />
                      <font color='#4183C4' className="mtax">View</font>
                    </span>
                  </span>
                </>
                : <span>Deleted</span>
            }
            <Modal open={isModalOpen.status} size="mini">
              <Modal.Header>M-Tax List</Modal.Header>
              <Modal.Content>
                <h4>Do you want to delete this row</h4>
              </Modal.Content>
              <Modal.Actions>
                <Button type="button" negative onClick={() => closeModal()}>No</Button>
                <Button type="button" positive onClick={() => deleteMtaxFromList()}>Yes</Button>

              </Modal.Actions>
            </Modal>
          </Table.Cell>
        </TableRow>
        {
          view ?
            <TableRow style={{ width: "200px", fontSize: "12px" }}>
              <TableRow width={9} style={{ color: "#505050" }}>
                <Table.HeaderCell width={1} >Sl</Table.HeaderCell>
                <Table.HeaderCell width={2} style={{ paddingLeft: "7px" }}>Valid From</Table.HeaderCell>
                <Table.HeaderCell width={2} style={{ paddingLeft: "7px" }}>Valid To</Table.HeaderCell>
                <Table.HeaderCell width={2} style={{ paddingLeft: "7px" }}>From Amount</Table.HeaderCell>
                <Table.HeaderCell width={2} style={{ paddingLeft: "7px" }}>To Amount</Table.HeaderCell>
                <Table.HeaderCell width={2} style={{ paddingLeft: "7px" }}>M-tax Rate</Table.HeaderCell>
                <Table.HeaderCell width={2} style={{ paddingLeft: "7px" }}>Additional Amount</Table.HeaderCell>
              </TableRow>
              {
                arr.map((item, index) => {
                  return (
                    <TableRow width={9} >
                      <Table.Cell width={1}>{parseInt(index) + 1}</Table.Cell>
                      <Table.Cell width={2}>{moment(item.valid_from).format("DD-MM-YYYY")} </Table.Cell>
                      <Table.Cell width={2}>{moment(item.valid_to).format("DD-MM-YYYY")}</Table.Cell>
                      <Table.Cell width={2}>{item.from_amount}</Table.Cell>
                      <Table.Cell width={2}>{item.to_amount}</Table.Cell>
                      <Table.Cell width={2}>{item.app_rate}</Table.Cell>
                      <Table.Cell width={2}>{item.add_amount}</Table.Cell>
                    </TableRow>
                  )
                })
              }
            </TableRow>
            : null
        }
      </>
    )
  else {
    return null
  }
}

const MtaxList = () => {

  const mtax = useSelector(state => state.mtax.byId)
  const dispatch = useDispatch()
  const [deleteMtaxId, setDeleteMtaxId] = useState(false);

  // useEffect(() => {
  //   dispatch(fetchMtax());
  // }, []);
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("mtax");
      obj.classList.add("markedMenuOpt");
  }, [])

  const downloadMTaxExcelRpt = () => {
    dispatch(downloadMtaxExcel())
  }

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={9}>
            <Header as='h2' align='left'>M-Tax List</Header>
          </Grid.Column>
          <Grid.Column floated='right'>
            <Button type="button" size="small" basic color='green' outline='green' background='white' icon='download' onClick={() => downloadMTaxExcelRpt()}  ></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table selectable basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={12}>City Name</Table.HeaderCell>
            <Table.HeaderCell width={2}>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(mtax).map((key) =>
            <MtaxRow mtax={mtax[key]} key={mtax[key].id} setDeleteMtaxId={setDeleteMtaxId} />)
          }
        </Table.Body>
      </Table>
      <>
        {

          deleteMtaxId ?
            <Notification id={deleteMtaxId} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='delete' />
            :
            null
        }
      </>
    </Container>
  )
}

export default MtaxList