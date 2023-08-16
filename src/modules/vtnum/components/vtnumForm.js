import React, { useEffect, useState } from 'react'
import { Formik, Field, FieldArray, Form as FormikForm } from 'formik'
import { Container, Header, Form, Button } from 'semantic-ui-react'
import { getNotification, getVtNum, getVtNumParams } from '../data/selectors'
import { createVtNum, editVtNum, setNotifyDone } from '../data/actions'
import { FormikAmountComponent, FormikDateComponent, FormikInputComponent } from '../../../utilities/formUtils'
import { duplicateCheckVtNum, vtnumSchema } from '../data/model'
import { useDispatch, useSelector } from 'react-redux'
import Notification from '../../../utilities/notificationUtils'
import userACL from '../../../store/access'
import VoucherTypeArray from './voucherTypeArray'
import { v4 } from 'uuid'

const VTNumForm = (props) => {

  const vtnum = useSelector(state => getVtNum(state, props))
  const params = useSelector(state => getVtNumParams(state, props))
  const dispatch = useDispatch()

  const [savedVtNumId, setSavedVtNumId] = useState(false)

  useEffect(() => {
    if (document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length) {
      if (document.getElementsByClassName("markedMenuOpt")[0].classList) {
        document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
      }
    }
    let obj = document.getElementById("vtnum");
    obj.classList.add("markedMenuOpt");
  }, [])

  const saveVtNum = (values, resetForm) => {
    if (props.match.path === "/vt-num/create") {
      userACL.atCreate(values)
      delete values.txnid
      values.vnumdetails.map((item) => {
        item.num = (item.num === null || item.num === "") ? null : parseFloat(item.num)
        item.num_count = (item.num_count === null || item.num_count === "") ? null : parseFloat(item.num_count)
      })
      if (values.cid !== 0) {
        dispatch(createVtNum(values))
        setSavedVtNumId(values.id)

      }

    }
    if (props.match.path === "/vt-num/edit/:id") {
      userACL.atUpdate(values)
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(editVtNum(values))
        setSavedVtNumId(values.id)
        setTimeout(function () {
          props.history.push(`/vt-num/list`)
        }, 4000)
      }

    }
  }


  return (
    <Container>
      <Header as='h2'>{params.title}</Header>
      <Formik
        initialValues={vtnum}
        validationSchema={vtnumSchema}
        onSubmit={(values, { resetForm }) => saveVtNum(values, resetForm)}
        render={({ values, handleSubmit, resetForm, errors, setFieldValue, onChange, handleChange }) => (

          <Form as={FormikForm} size='small' className="CustomeForm" onSubmit={handleSubmit} >
            <Form.Group widths={4}>
              {
                props.match.path === "/vt-num/create" ?
                  <Field name='vth_name' label='Voucher Type Name' component={FormikInputComponent} isMandatory={true} validate={(val) => duplicateCheckVtNum(val, values)} />
                  : <Field name='vth_name' label='Voucher Type Name' component={FormikInputComponent} isMandatory={true} />
              }
            </Form.Group>
            <br />
            <Form.Group widths={4}>
              <FieldArray name='vnumdetails' component={VoucherTypeArray} />
            </Form.Group>

            <Button type="submit" size="medium" color="blue" className="CustomeBTN" >{params.submitButtonText}</Button>

            {savedVtNumId ?
              <Notification id={savedVtNumId} resetForm={resetForm} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='save' />
              :
              null}
          </Form>

        )}
      />
    </Container>
  )
}

export default VTNumForm