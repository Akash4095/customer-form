import React, { useState, useEffect } from 'react'
import { Formik, Field, Form as FormikForm } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Container, Form, Header, Icon, Modal } from 'semantic-ui-react'
import { FormikCheckBoxComponent, FormikInputComponent } from '../../../utilities/formUtils'
import Notification from '../../../utilities/notificationUtils'
import { callSegmap, duplicateCheckSegmap, segmapSchema } from '../data/model'
import { createSegmap, editSegmap, fetchOthersList, setNotifyDone } from '../data/actions'
import { getNotification, getSegmapParams, getSegmap, getOthersSavedRes, getOthersList } from "../data/selectors"
import userACL from '../../../store/access'
import { merge } from 'lodash'
import { v4 } from 'uuid'
import moment from 'moment'
import OthersForm from './othersForm'



const SegmapForm = (props) => {

  const params = useSelector(state => getSegmapParams(state, props))
  const segmap = useSelector(state => getSegmap(state, props))
  const othersList = useSelector(state => getOthersList(state, props))
  const [company, setCompany] = useState("")
  const [listRes, setLIstRes] = useState([])
  const data = merge({}, userACL.atFetch())
  const dispatch = useDispatch()

  const [savedSegmapId, setSavedSegmapId] = useState(false)
  const [othersModal, setOthersModal] = useState(false)
  const [othersResponseModal, setOthersResponseModal] = useState({ open: false, msg: "", type: "", headerContent: "", icon: "", color: "", payload: {} })

  useEffect(() => {
    if (document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length) {
      if (document.getElementsByClassName("markedMenuOpt")[0].classList) {
        document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
      }
    }
    let obj = document.getElementById("segmap");
    obj.classList.add("markedMenuOpt");
  }, [])

  useEffect(() => {
    callSegmap(setCompany)
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.segid
    dispatch(fetchOthersList(obj))
  }, [])

  useEffect(() => {
    if (othersList) {
      setLIstRes(othersList)
    }
  }, [othersList])

  useEffect(() => {
    if (othersResponseModal && othersResponseModal !== null && othersResponseModal !== undefined) {
      if (othersResponseModal.type === "success") {
        setLIstRes(othersResponseModal.payload.data)
      }
    }

  }, [othersResponseModal])

  const savedSegmap = (values, resetForm) => {
    if (props.match.path === "/segmap/create") {
      values.cid = data.cid
      values.uid_create = data.uid
      values.uid_update = data.uid
      values.company_name = company
      delete values.txnid
      delete values.others
      if (values.cid !== 0) {
        dispatch(createSegmap(values))
        setSavedSegmapId(values.id)

      }
    }
    if (props.match.path === "/segmap/clone/:id") {
      let obj = {}
      userACL.atUpdate(obj)
      let currDate = new Date()
      values.dt_create = moment(currDate).format("YYYY-MM-DD hh:mm:ss")
      values.dt_update = moment(currDate).format("YYYY-MM-DD hh:mm:ss")
      values.uid_update = obj.uid_update
      values.id = v4()
      values.company_name = company
      delete values.txnid
      delete values.others
      if (values.cid !== 0) {
        dispatch(createSegmap(values))
        setSavedSegmapId(values.id)
        resetForm()
      }
    }

    if (props.match.path === "/segmap/edit/:id") {
      let updateObj = {}
      userACL.atUpdate(updateObj)
      let currDate = new Date()
      values.dt_update = moment(currDate).format("YYYY-MM-DD hh:mm:ss")
      values.uid_update = updateObj.uid_update
      delete values.txnid
      delete values.others
      if (values.cid !== 0) {
        dispatch(editSegmap(values))
        setSavedSegmapId(values.id)
        setTimeout(function () {
          props.history.push(`/segmap/list`)
        }, 2000)
      }

    }
  }

  return (
    <Container>
      <Header as='h2'>{params.title}</Header>
      <Formik
        initialValues={segmap}
        validationSchema={segmapSchema}
        onSubmit={(values, { resetForm }) => savedSegmap(values, resetForm)}
        render={({ values, handleSubmit, resetForm, errors, setFieldValue, onChange, handleChange }) => (

          <Form as={FormikForm} size='small' className="CustomeForm" onSubmit={handleSubmit}>
            <Form.Group widths={4}>


              {
                props.match.path === "/segmap/edit/:id" ?
                  <Field name='company_name' label='Company Name' component={FormikInputComponent} isMandatory={true} />
                  :
                  <Field name='company_name' label='Company Name' value={company} component={FormikInputComponent} isMandatory={true} readOnly={true} className="vnumGet" />
              }
              {
                props.match.path === "/segmap/create" ?
                  <Field name='name' label='Segment Name' component={FormikInputComponent} isMandatory={true} validate={(val) => duplicateCheckSegmap(val, values)} />
                  : <Field name='name' label='Segment Name' component={FormikInputComponent} isMandatory={true} />
              }
              <Field name='gstin' label='GSTIN' component={FormikInputComponent} />
              <Field name='account' label='Account (Domain)' component={FormikInputComponent} />


            </Form.Group>

            <Form.Group widths={4}>
              <Field name='cid' label='Company ID' component={FormikInputComponent} value={data.cid} readOnly={true} className="vnumGet" />
              <Field name='segid' label='Segment ID' component={FormikInputComponent} />
              <Field name='secretKey' label='Secret Key' component={FormikInputComponent} />
              <Field name='accessKey' label='Access Key' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4} className="paddingBottomSegmap">
              <Field name='emailid' label='Email ID' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4}>
              <Field name='car_sale_vtype' label='Car Sale Voucher Type' component={FormikInputComponent} />
              <Field name='car_sale_ledger' label='Car Sale Ledger' component={FormikInputComponent} />
              <Field name='car_sale_ledgerCd' label='Car Sale Ledger Code' component={FormikInputComponent} />
              <Field name='godown' label='Godown' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4} className="paddingBottomSegmap" >
              <Field name='tcs_ledger' label='TCS Ledger' component={FormikInputComponent} />
              <Field name='tcs_ledgerCd' label='TCS Ledger Code' component={FormikInputComponent} />
              <Field name='round_off' label='Round Off' component={FormikInputComponent} />
              <Field name='round_offCd' label='Round Off Code' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4} className="paddingBottom" >
              <Field name='rto_vtype' label='RTO Voucher Type' component={FormikInputComponent} />
              <Field name='rto_ledger' label='RTO Ledger' component={FormikInputComponent} />
              <Field name='rto_ledger_cd' label='RTO Ledger Code' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4} className="paddingBottom" >
              <Field name='insurance_vtype' label='Insurance Voucher Type' component={FormikInputComponent} />
              <Field name='insurance_ledger' label='Insurance Ledger' component={FormikInputComponent} />
              <Field name='insurance_ledger_cd' label='Insurance Ledger Code' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4} className="paddingBottom" >
              <Field name='m_tax_vtype' label='M-Tax Voucher Type' component={FormikInputComponent} />
              <Field name='m_tax_ledger' label='M-Tax Ledger' component={FormikInputComponent} />
              <Field name='m_tax_ledger_cd' label='M-Tax Ledger Code' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4} className="paddingBottom" >
              <Field name='rsa_vtype' label='RSA Voucher Type' component={FormikInputComponent} />
              <Field name='rsa_ledger' label='RSA Ledger' component={FormikInputComponent} />
              <Field name='rsa_ledger_cd' label='RSA Ledger Code' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4} className="paddingBottom" >
              <Field name='ex_warranty_vtype' label='Ex Warranty Voucher Type' component={FormikInputComponent} />
              <Field name='ex_warranty_ledger' label='Ex Warranty Ledger' component={FormikInputComponent} />
              <Field name='ex_warranty_ledger_cd' label='Ex Warranty Ledger Code' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4} className="paddingBottom" >
              <Field name='sot_vtype' label='SOT Voucher Type' component={FormikInputComponent} />
              <Field name='sot_ledger' label='SOT Ledger' component={FormikInputComponent} />
              <Field name='sot_ledger_cd' label='SOT Ledger Code' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4} className="paddingBottom" >
              <Field name='hsrp_vtype' label='HSRP Voucher Type' component={FormikInputComponent} />
              <Field name='hsrp_ledger' label='HSRP Ledger' component={FormikInputComponent} />
              <Field name='hsrp_ledger_cd' label='HSRP Ledger Code' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4} className="paddingBottom" >
              <Field name='fastag_vtype' label='Fastag Voucher Type' component={FormikInputComponent} />
              <Field name='fastag_ledger' label='Fastag Ledger' component={FormikInputComponent} />
              <Field name='fastag_ledger_cd' label='Fastag Ledger Code' component={FormikInputComponent} />
            </Form.Group>
            <Form.Group style={{ marginTop: "-15px", marginBottom: "15px" }}>
              {
                (listRes && listRes !== null && listRes !== undefined && listRes.length > 0) ?
                  <Button type="button" size="small" inverted color='green' onClick={() => setOthersModal(true)}>Update Others</Button>
                  :
                  <Button type="button" size="small" inverted color='green' onClick={() => setOthersModal(true)}>Add Others</Button>

              }

            </Form.Group>

            {
              (listRes && listRes !== null && listRes !== undefined && listRes.length) ?
                <Form.Group widths={4} className="paddingBottom" >
                  <Field name='others_1_vtype' label={listRes[0].value + ' Voucher Type'} component={FormikInputComponent} />
                  <Field name='others_1_ledger' label={listRes[0].value + ' Ledger'} component={FormikInputComponent} />
                  <Field name='others_1_ledger_cd' label={listRes[0].value + ' Ledger Code'} component={FormikInputComponent} />
                </Form.Group>
                : null
            }

            {
              (listRes && listRes !== null && listRes !== undefined && listRes.length > 1) ?
                <Form.Group widths={4} className="paddingBottom" >
                  <Field name='others_2_vtype' label={listRes[1].value + ' Voucher Type'} component={FormikInputComponent} />
                  <Field name='others_2_ledger' label={listRes[1].value + ' Ledger'} component={FormikInputComponent} />
                  <Field name='others_2_ledger_cd' label={listRes[1].value + ' Ledger Code'} component={FormikInputComponent} />
                </Form.Group>
                : null
            }
            {
              (listRes && listRes !== null && listRes !== undefined && listRes.length > 2) ?
                <Form.Group widths={4} className="paddingBottom" >
                  <Field name='others_3_vtype' label={listRes[2].value + ' Voucher Type'} component={FormikInputComponent} />
                  <Field name='others_3_ledger' label={listRes[2].value + ' Ledger'} component={FormikInputComponent} />
                  <Field name='others_3_ledger_cd' label={listRes[2].value + ' Ledger Code'} component={FormikInputComponent} />
                </Form.Group>
                : null
            }


            {
              (listRes && listRes !== null && listRes !== undefined && listRes.length > 3) ?
                <Form.Group widths={4} className="paddingBottom" >
                  <Field name='others_4_vtype' label={listRes[3].value + ' Voucher Type'} component={FormikInputComponent} />
                  <Field name='others_4_ledger' label={listRes[3].value + ' Ledger'} component={FormikInputComponent} />
                  <Field name='others_4_ledger_cd' label={listRes[3].value + ' Ledger Code'} component={FormikInputComponent} />
                </Form.Group>
                : null
            }


            <Form.Group widths={4} className="paddingBottom">
              <Field name='passing_charges_vtype' label='Passing Charges Vtype' component={FormikInputComponent} />
              <Field name='passing_charges_ledger' label='Passing Charges Ledger' component={FormikInputComponent} />
              <Field name='passing_charges_ledger_cd' label='Passing Charges Ledger Code' component={FormikInputComponent} />
            </Form.Group>


            <Form.Group widths={4} className="paddingBottom">
              <Field name='hypothecation_charges_vtype' label='Hypothecation Charges Vtype' component={FormikInputComponent} />
              <Field name='hypothecation_charges_ledger' label='Hypothecation Charges Ledger' component={FormikInputComponent} />
              <Field name='hypothecation_charges_ledger_cd' label='Hypothecation Charges Ledger Code' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4} className="paddingBottom">
              <Field name='used_car_vtype' label='Used Car Vtype' component={FormikInputComponent} />
              <Field name='used_car_ledger' label='Used Car Ledger' component={FormikInputComponent} />
              <Field name='used_car_ledger_cd' label='Used Car Ledger Code' component={FormikInputComponent} />
            </Form.Group>
            <Form.Group widths={4} >
              <Field name='disc_vtype' label='Discount Voucher Type' component={FormikInputComponent} />
            </Form.Group>

            <Button type="submit" size="medium" color="blue" className="CustomeBTN" >{params.submitButtonText}</Button>

            {savedSegmapId ?
              <Notification id={savedSegmapId} resetForm={resetForm} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='save' />
              :
              null}
            <Modal open={othersModal} size="small" onClose={() => setOthersModal(false)}>
              <Modal.Header>
                {(othersList && othersList !== null && othersList !== undefined && othersList && othersList.length > 0) ?
                  "Update Others Header" : "Add Others Header"
                }
              </Modal.Header>
              <Modal.Content>
                <OthersForm
                  othersList={othersList}
                  listRes={listRes}
                  setOthersModal={setOthersModal}
                  setOthersResponseModal={setOthersResponseModal}
                />
              </Modal.Content>
              <Modal.Actions>
                <Button type="button" inverted color='red' onClick={() => setOthersModal(false)}>Close</Button>
              </Modal.Actions>
            </Modal>
            <Modal open={othersResponseModal.open} size="mini">
              <Modal.Header>
                <Icon name={othersResponseModal.icon} color={othersResponseModal.color} />
                <span
                  style={{
                    marginLeft: "3px",
                  }}
                >
                  {othersResponseModal.headerContent}
                </span>
              </Modal.Header>
              <Modal.Content>
                {othersResponseModal.msg}
              </Modal.Content>
              <Modal.Actions>
                <Button type="button" inverted color='red' onClick={() => setOthersResponseModal({ open: false, msg: "", type: "", headerContent: "", icon: "", color: "", payload: {} })}>Close</Button>
              </Modal.Actions>
            </Modal>
          </Form>
        )}
      />
    </Container>
  )
}

export default SegmapForm