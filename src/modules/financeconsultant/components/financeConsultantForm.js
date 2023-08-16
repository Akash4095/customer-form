import React, { useEffect, useState } from 'react'
import { Formik, Field, Form as FormikForm } from 'formik';
import { Button, Container, Form, Header } from 'semantic-ui-react'
import { FormikInputComponent } from '../../../utilities/formUtils';
import { getFinanceConsultant, getFinanceConsultantParams, getNotification } from '../data/selectors'
import { createFinanceConsultant, editFinanceConsultant, savedFinanceConsultant, setNotifyDone } from '../data/actions'
import { useSelector, useDispatch } from 'react-redux';
import Notification from '../../../utilities/notificationUtils';
import { duplicateCheckItem, financeConsultantSchema } from '../data/model';
import { v4 } from 'uuid';
import userACL from '../../../store/access';



const FinanceConsultantForm = (props) => {

  const financeConsultant = useSelector(state => getFinanceConsultant(state, props))
  const params = useSelector(state => getFinanceConsultantParams(state, props))
  const dispatch = useDispatch()

  const [savedFCId, setSavedFCId] = useState(false)
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("financeconsultant");
      obj.classList.add("markedMenuOpt");
  }, [])

  const savedFinanceConsultant = (values, resetForm) => {

    if (props.match.path === "/financeconsultant/create") {
      values.emp_code = (values.emp_code === "") ? null : values.emp_code
      values.id = v4();
      userACL.atCreate(values)
      values.segid = values.cid
      values.smType = 'Finance Consultant'
      delete values.pin
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(createFinanceConsultant(values))
        setSavedFCId(values.id)

      }

    }
    if (props.match.path === "/financeconsultant/edit/:id") {
      userACL.atUpdate(values)
      values.segid = values.cid
      values.smType = 'Finance Consultant'
      delete values.pin
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(editFinanceConsultant(values))
        setSavedFCId(values.id)
        setTimeout(function(){
          props.history.push(`/financeconsultant/list`)
        }, 2000)
      }
    }

  }


  return (
    <Container>
      <Header as='h2'>{params.title}</Header>

      <Formik size="large" width={5}
        initialValues={financeConsultant}
        validationSchema={financeConsultantSchema}
        onSubmit={(values, { resetForm }) => savedFinanceConsultant(values, resetForm)}
        render={({ values, handleSubmit, resetForm, errors, setFieldValue, onChange, handleChange }) => (

          <Form as={FormikForm} size='small' className="CustomeForm" onSubmit={handleSubmit} >

            <Form.Group widths={3}>
              {
                props.match.path === "/financeconsultant/create" ?
                  <Field name='emp_name' label='Finance Consultant Name' component={FormikInputComponent} isMandatory={true} validate={(val) => duplicateCheckItem(val, values)} />
                  : <Field name='emp_name' label='Finance Consultant Name' component={FormikInputComponent} isMandatory={true} />
              }
            </Form.Group>

            <Form.Group widths={3}>
              {
                props.match.path === "/financeconsultant/create" ?
                  <Field name='emp_code' label='Finance Consultant Code' component={FormikInputComponent} validate={(val) => duplicateCheckItem(val, values)} />
                  : <Field name='emp_code' label='Finance Consultant Code' component={FormikInputComponent} />
              }
            </Form.Group>

            <Button type="submit" size="medium" color="blue" className="CustomeBTN" >{params.submitButtonText}</Button>

            {savedFCId ?
              <Notification id={savedFCId} resetForm={resetForm} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='save' />
              :
              null}

          </Form>
        )}
      />
    </Container>

  )
}

export default FinanceConsultantForm