import React, { useState, useEffect } from 'react'
import { Container, Form, Header, Button } from 'semantic-ui-react'
import { Formik, Field, FieldArray, Form as FormikForm } from 'formik'
import { FormikInputComponent } from '../../../utilities/formUtils';
import { mtaxSchema, duplicateCheckMtax, } from '../data/model';
import { getMtax, getMtaxNumbering, getMtaxParams, getNotification, } from '../data/selectors';
import { createMtax, editMtax, fetchMtax, setNotifyDone, } from '../data/actions'
import Notification from '../../../utilities/notificationUtils'
import { useDispatch, useSelector } from 'react-redux';
import MtaxArray from './mtaxArray'
import userACL from '../../../store/access';
import v4 from 'uuid'


const MtaxForm = (props) => {

  const mtax = useSelector(state => getMtax(state, props))

  const params = useSelector(state => getMtaxParams(state, props))
  const dispatch = useDispatch()
  const [savedMtaxId, setSavedMtaxId] = useState(false)

  useEffect(() => {
    if (document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length) {
      if (document.getElementsByClassName("markedMenuOpt")[0].classList) {
        document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
      }
    }
    let obj = document.getElementById("mtax");
    obj.classList.add("markedMenuOpt");
  }, [])


  const saveMtax = (values, resetForm) => {
    if (props.match.path === "/mtax/create") {
      userACL.atCreate(values)
      delete values.txnid
      delete values.modelOpenEdit
      values.taxetails.map((item) => {
        item.from_amount = (item.from_amount === null || item.from_amount === "") ? null : parseFloat(item.from_amount)
        item.to_amount = (item.to_amount === null || item.to_amount === "") ? null : parseFloat(item.to_amount)
        item.add_amount = (item.add_amount === null || item.add_amount === "") ? null : parseFloat(item.add_amount)
        item.app_rate = (item.app_rate === null || item.app_rate === "") ? null : parseFloat(item.app_rate)
      })
      if (values.cid !== 0) {
        dispatch(createMtax(values))
        setSavedMtaxId(values.id)

      }


    }
    if (props.match.path === "/mtax/edit/:id") {
      let segid = values.segid
      userACL.atUpdate(values)
      delete values.txnid
      delete values.modelOpenEdit
      values.segid = segid
      if (values.cid !== 0) {
        dispatch(editMtax(values))
        setSavedMtaxId(values.id)
        setTimeout(function () {
          props.history.push(`/mtax/list`);
          setTimeout(function () {
            dispatch(fetchMtax())
          }, 100)
        }, 2000)
      }

    }
  }

  return (
    <Container>
      <Header as='h2' >{params.title}</Header>

      <Formik
        initialValues={mtax}
        validationSchema={mtaxSchema}
        onSubmit={(values, { resetForm }) => saveMtax(values, resetForm)}
        render={({ values, handleSubmit, resetForm, errors, onChange, handleChange, setFieldValue }) => (

          <Form as={FormikForm} onSubmit={handleSubmit} size='small' className="CustomeForm">
            <Form.Group widths={4}>
              {
                props.match.path === "/mtax/create" ?
                  <Field name="city" label="City Name" isMandatory={true} component={FormikInputComponent} validate={(val) => duplicateCheckMtax(val, values)} focus={true} maxlength={100}></Field>
                  : <Field name="city" label="City Name" isMandatory={true} component={FormikInputComponent} focus={true} maxlength={100}></Field>
              }

            </Form.Group>

            <br />
            <Form.Group >
              <FieldArray name='taxetails' component={MtaxArray} />
            </Form.Group>

            <Button type="submit" size="medium" color="blue" className="CustomeBTN">
              {params.submitButtonText}
            </Button>
            {savedMtaxId ?
              <Notification id={savedMtaxId} resetForm={resetForm} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='save' />
              :
              null}
          </Form>
        )}
      />
    </Container>
  )
}

export default MtaxForm