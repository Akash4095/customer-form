import React, { useEffect, useState } from 'react'
import { Formik, Field, Form as FormikForm } from 'formik';
import { Button, Container, Form, Header } from 'semantic-ui-react'
import { FormikInputComponent } from '../../../utilities/formUtils';
import { getLeadSource, getLeadSourceParams, getNotification } from '../data/selectors'
import { useSelector, useDispatch } from 'react-redux';
import { duplicateCheckItemCode, duplicateCheckItemName, leadsourceSchema } from '../data/model';
import Notification from '../../../utilities/notificationUtils';
import { setNotifyDone, createLeadSource, editLeadSource } from '../data/actions';
import { v4 } from 'uuid';
import userACL from '../../../store/access';

const LeadSourceForm = (props) => {

  const leadSource = useSelector(state => getLeadSource(state, props))
  const params = useSelector(state => getLeadSourceParams(state, props))
  const dispatch = useDispatch()

  const [savedLeadSourceId, setSavedLeadSourceId] = useState(false)
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("leadsource");
      obj.classList.add("markedMenuOpt");
  }, [])

  const saveLeadSource = (values, resetForm) => {
    if (props.match.path === "/leadsource/create") {
      values.emp_code = (values.emp_code === "") ? null : values.emp_code
      values.id = v4()
      userACL.atCreate(values)
      values.segid = values.cid
      values.smType = 'Lead Source'
      delete values.pin
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(createLeadSource(values))
        setSavedLeadSourceId(values.id)
      
      }

    }
    if (props.match.path === "/leadsource/edit/:id") {
      userACL.atUpdate(values)
      values.segid = values.cid
      values.smType = 'Lead Source'
      delete values.pin
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(editLeadSource(values))
        setSavedLeadSourceId(values.id)
        setTimeout(function(){
          props.history.push(`/leadsource/list`)
        }, 2000)
      }

    }
  }

  return (
    <Container>
      <Header as='h2'>{params.title}</Header>

      <Formik size="large" width={5}
        initialValues={leadSource}
        validationSchema={leadsourceSchema}
        onSubmit={(values, { resetForm }) => saveLeadSource(values, resetForm)}
        render={({ values, handleSubmit, errors, resetForm, setFieldValue, onChange, handleChange, handleBlur }) => (

          <Form as={FormikForm} size='small' className="CustomeForm" onSubmit={handleSubmit} >
            <Form.Group widths={3}>
              {
                props.match.path === "/leadsource/create" ?
                  <Field name='emp_name' label='Lead Source Name' component={FormikInputComponent} isMandatory={true} validate={(val) => duplicateCheckItemName(val, values)} />
                  : <Field name='emp_name' label='Lead Source Name' component={FormikInputComponent} isMandatory={true} />
              }
            </Form.Group>

            <Form.Group widths={3}>
              {
                props.match.path === "/leadsource/create" ?
                  <Field name='emp_code' label='Lead Source Code' component={FormikInputComponent} validate={(val) => duplicateCheckItemCode(val, values)} />
                  : <Field name='emp_code' label='Lead Source Code' component={FormikInputComponent} />
              }
            </Form.Group>

            <Form.Group widths={3}>
              <Field name='PAN_NO' label='PAN No' component={FormikInputComponent} />
            </Form.Group>

            <Button type="submit" size="medium" color="blue" className="CustomeBTN" >{params.submitButtonText}</Button>

            {savedLeadSourceId ?
              <Notification id={savedLeadSourceId} resetForm={resetForm} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='save' />
              :
              null}
          </Form>
        )}
      />
    </Container>

  )
}

export default LeadSourceForm;