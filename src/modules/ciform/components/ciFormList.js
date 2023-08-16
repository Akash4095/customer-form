import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Formik, Field, Form as FormikForm } from 'formik';
import { Button, Container, Header, Modal, Table, TableBody, TableHeader, Icon, Grid, Form } from 'semantic-ui-react'
import userACL from '../../../store/access'
import Notification from '../../../utilities/notificationUtils'
import { deleteCiForm, downloadCiformExcel, fetchCiForm, setNotifyDone } from '../data/actions'
import { getCiformListSearch, getFilteredCiform, getIsCiFormFetched, getNotification } from '../data/selectors'
import { toLower } from 'lodash'
import { ciformSearchListSchema, searchColumns } from '../data/model';
import { heightSet, rowBodyHeightSet } from './heightSet'
import { StickyTable, Row, Cell } from 'react-sticky-table'
import { FormikDateComponent } from '../../../utilities/formUtils';
import { TableListDiv } from './tableListDiv'


const CiFormList = (props) => {

  const [ciformId, setCiformId] = useState('')
  const [searchClicked, setSearchedClicked] = useState(false)
  const [deleteCiformId, setDeleteCiformId] = useState(false);
  const [heights, setHeight] = useState('')
  const [getBodyHeight, setGetBodyHeight] = useState('')
  const ciform = useSelector(state => getFilteredCiform(state))
  const [isModalOpen, setModalOpen] = useState(false)
  const ciformListSearch = useSelector(state => getCiformListSearch(state, props))
  const dataFetched = useSelector(state => getIsCiFormFetched(state, props))
  const dispatch = useDispatch();
  const date = new Date()
  const todayDate = moment(date).format("YYYY-MM-DD")

  useEffect(() => {
    if (document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length) {
      if (document.getElementsByClassName("markedMenuOpt")[0].classList) {
        document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
      }
    }
    let obj = document.getElementById("ciform");
    obj.classList.add("markedMenuOpt");
  }, [])

  const fetchList = (values) => {
    if (values.fromDate && values.toDate) {
      dispatch(fetchCiForm(values))
      setSearchedClicked(true)
    }
  }
  const downloadCiformExcelRpt = (values) => {
    if (values.fromDate && values.toDate) {
      dispatch(downloadCiformExcel(values))
    }
  }
  useEffect(() => {
    callHeightFunc()
    window.addEventListener('resize', function () {
      callHeightFunc()
    }, false);

  }, [])


  const deleteCiFormFromList = (values) => {
    const getVlaue = { id: values }
    userACL.atUpdate(getVlaue)
    dispatch(deleteCiForm(getVlaue))
    setDeleteCiformId(values)
    setModalOpen(false)
  }
  const closeModal = () => {
    setModalOpen(false)
  }


  const ciformActions = ({ object: ciformobj }) => {
    const isNegative = ciformobj.status === 1 ? false : true
    let filteredObj = []
    let rlbSyncArray = ciformobj.rlbsyncf

    if (rlbSyncArray && rlbSyncArray !== undefined && rlbSyncArray.length > 0) {
      filteredObj = rlbSyncArray.filter((obj) => {
        return (toLower(obj.txnStatus) === toLower("posted"))
      })
    }

    return (
      <>
        {
          filteredObj.length > 0 ?
            <span>
              <Link to={"/ciform/summary/" + ciformobj.id} >
                <Icon className='eyeSymbol' name='eye' />
                <font color='#4183C4'>View</font>
              </Link><span>&nbsp;&nbsp;</span>
            </span>
            :
            isNegative === false ?
              <>
                <span>&nbsp;&nbsp;</span>
                <Link to={"/ciform/summary/" + ciformobj.id} ><Icon className='eyeSymbol' name='eye' />
                  <font color='#4183C4'>View</font></Link><span>&nbsp;&nbsp;</span>
                <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => {
                  setModalOpen(true)
                  setCiformId(ciformobj.id)
                }
                }>Delete</span>
              </>
              :
              <span>Deleted</span>
        }

      </>

    )
  }

  const callHeightFunc = () => {
    heightSet(setHeight)
    rowBodyHeightSet(setGetBodyHeight)
  }

  return (
    <Container>
      <Grid id='headContent' >
        <Grid.Row>
          <Grid.Column width={7}>
            <Header as='h2' align='left'>CI Form List</Header>
          </Grid.Column>
          <Grid.Column width={7} floated="right" style={{ right: '30px' }}>
            <Formik id="ciformSearch"
              initialValues={ciformListSearch}
              validationSchema={null}
              onSubmit={(values) => { fetchList(values) }}
              render={({ handleSubmit, errors, onChange, values, handleChange }) => (
                <Form as={FormikForm} size="small" className="ciformSearch" width={5} onSubmit={handleSubmit}>
                  <Form.Group >
                    <Field name="fromDate" component={FormikDateComponent} setFieldValueM={todayDate} isLabel='false' isTxn='true' placeholder='From Date' />
                    <Field name="toDate" component={FormikDateComponent} setFieldValueM={todayDate} isLabel='false' isTxn='true' placeholder='To Date' />
                    <Button type="submit" size="small" color='blue' style={{ height: "35px", marginTop: "4px" }} > Search </Button>
                    <Button type="button" size="small" basic color='green' outline='green' background='white' icon='download' onClick={() => downloadCiformExcelRpt(values)} style={{ height: "35px", marginTop: "4px" }} ></Button>
                  </Form.Group>
                </Form>
              )}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div className='' style={{ height: heights + 'px', width: "100%" }}>
        <StickyTable className='tableLayout' stickyHeaderCount={1} stickyColumnCount={0} style={{ width: '100%' }}>
          <TableListDiv columns={searchColumns} searchClicked={searchClicked} dataFetched={dataFetched} data={ciform} Actions={ciformActions} setHeight={parseFloat(heights) - 80} getIndex={6} filterBoxNone={''} rightBox={''} centerBox={''} callHeightFunc={callHeightFunc} paddingShort={2} getWidth={'100%'} actionClass={"actionTdDR"} />
        </StickyTable>
      </div>


      {
        deleteCiformId ?
          <Notification id={deleteCiformId} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='delete' />
          :
          null
      }

      <Modal open={isModalOpen} size="mini" onClose={() => closeModal()}>
        <Modal.Header>CI Form List</Modal.Header>
        <Modal.Content>
          <h4>Do you want to delete this row</h4>
        </Modal.Content>
        <Modal.Actions>
          <Button type="button" positive onClick={() => closeModal()}>No</Button>
          <Button type="button" color='red' onClick={() => deleteCiFormFromList(ciformId)}>Yes</Button>
        </Modal.Actions>
      </Modal>
    </Container>
  )

}

export default CiFormList;
