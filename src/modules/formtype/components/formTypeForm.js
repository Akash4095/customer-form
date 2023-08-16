import React, { useState, useEffect } from 'react'
import { Container, Form, Header, Button } from 'semantic-ui-react'
import { Formik, Field, FieldArray, Form as FormikForm } from 'formik'
import { FormikInputComponent, FormikAmountComponent } from '../../../utilities/formUtils';
import { duplicateCheckFormType, formTypeSchemaNumber, formTypeSchema } from '../data/model';
import { getNotification, getFormType, getFormTypeParams, getFormTypeNumbering } from '../data/selectors';
import { createFormType, editFormType, fetchFormType, setNotifyDone, } from '../data/actions'
import FormTypeArray from './formTypeArray';
import Notification from '../../../utilities/notificationUtils'
import { useDispatch, useSelector } from 'react-redux';
import userACL from '../../../store/access';
import v4 from 'uuid'
import NumberTypeSelect from './numberTypeSelect';




const FormTypeForm = (props) => {

  const formtype = useSelector(state => getFormType(state, props))

  const params = useSelector(state => getFormTypeParams(state, props))
  const dispatch = useDispatch()
  const formTypeNumbering = useSelector(state => getFormTypeNumbering(state, formtype ? formtype.id : 0))
  const [savedFormTypeId, setSavedFormTypeId] = useState(false)
  const [nature, setNature] = useState(formtype ? formtype.numbering : "")

  useEffect(() => {
    if (document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length) {
      if (document.getElementsByClassName("markedMenuOpt")[0].classList) {
        document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
      }
    }
    let obj = document.getElementById("formtype");
    obj.classList.add("markedMenuOpt");
  }, [])

  const saveFormType = (values, resetForm) => {
    if (props.match.path === "/form-type/create") {
      userACL.atCreate(values)
      values.segid = values.cid
      delete values.txnid
      values.numdetails.map((item) => {
        item.next_number = (item.next_number === null || item.next_number === "") ? null : parseFloat(item.next_number)
        item.number_count = (item.number_count === null || item.number_count === "") ? null : parseFloat(item.number_count)
      })
      if (values.cid !== 0) {
        dispatch(createFormType(values))
        setSavedFormTypeId(values.id)

      }


    }
    if (props.match.path === "/form-type/edit/:id") {
      userACL.atUpdate(values)
      delete values.txnid
      values.segid = values.cid
      if (values.cid !== 0) {
        dispatch(editFormType(values))
        setSavedFormTypeId(values.id)
        setTimeout(function () {
          props.history.push(`/form-type/list`);
          setTimeout(function () {
            dispatch(fetchFormType())
          }, 100)
        }, 2000)
      }

    }
  }

  useEffect(() => {
    if (props.match.path === '/form-type/create') {
      let formTypeNum = formTypeNumbering[0]
      userACL.atCreate(formTypeNum)
      formTypeNum.segid = ""
      formTypeNum.formt_id = formtype.id
      formtype.numdetails = formTypeNumbering
    }
  })


  return (
    <Container>
      <Header as='h2' >{params.title}</Header>

      <Formik id="formType" size="large" width={5}
        initialValues={formtype}
        validationSchema={nature === "auto" ? formTypeSchemaNumber : formTypeSchema}
        onSubmit={(values, { resetForm }) => saveFormType(values, resetForm)}
        render={({ handleSubmit, onChange, resetForm, errors, values, handleChange }) => (

          <Form as={FormikForm} size="small"  className="CustomeForm" width={12} onSubmit={handleSubmit}>
            <Form.Group widths={4}>
              {
                props.match.path === "/form-type/create" ?
                  <Field name="stype_name" label="Form Type Name" isMandatory={true} component={FormikInputComponent} validate={(val) => duplicateCheckFormType(val, values)} focus={true} maxlength={100}></Field>
                  : <Field name="stype_name" label="Form Type Name" isMandatory={true} component={FormikInputComponent} focus={true} maxlength={100}></Field>
              }

            </Form.Group>
            <Form.Group widths={4}>
              <NumberTypeSelect name="numbering" isSelection='true' label='Numbering' isTxn='true' setOnCall={setNature} />
            </Form.Group>
            <br />
            {
              nature === "auto" ?
                <Form.Group >
                  <FieldArray name='numdetails' component={FormTypeArray} />
                </Form.Group>
                : null
            }



            <Button type="submit" size="medium" color='blue' className="CustomeBTN"> {params.submitButtonText}</Button>
            {savedFormTypeId ?
              <Notification id={savedFormTypeId} resetForm={resetForm} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='save' />
              :
              null}
          </Form>

        )}
      />
    </Container>
  )
}

export default FormTypeForm