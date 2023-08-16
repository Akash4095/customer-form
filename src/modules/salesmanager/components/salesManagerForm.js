import React, { useEffect, useState } from 'react'
import { Formik, Field, Form as FormikForm } from 'formik'
import { Form, Header, Container, Button } from 'semantic-ui-react'
import { FormikInputComponent } from '../../../utilities/formUtils'
import { useSelector, useDispatch } from 'react-redux'
import { getSalesmanager, getSalesmanagerParams, getNotification } from '../data/selectors'
import { createSalesmanager, editSalesmanager, setNotifyDone } from '../data/actions'
import Notification from '../../../utilities/notificationUtils'
import { duplicateCheckItem, salesmanagerSchema } from '../data/model'
import v4 from 'uuid'
import userACL from '../../../store/access';

const SalesManagerForm = (props) => {

  const salesmanager = useSelector(state => getSalesmanager(state, props))
  const params = useSelector(state => getSalesmanagerParams(state, props))
  const dispatch = useDispatch()

  const [savedSalesManagerId, setsavedSalesManagerId] = useState(false)
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("salesmanager");
      obj.classList.add("markedMenuOpt");
  }, [])

  const saveSalesManager = (values, resetForm) => {
    if (props.match.path === "/salesmanager/create") {
      values.emp_code = (values.emp_code === "") ? null : values.emp_code
      values.id = v4();
      userACL.atCreate(values);
      values.segid = values.cid;
      values.smType = 'Sales Manager'
      delete values.pin
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(createSalesmanager(values));
        setsavedSalesManagerId(values.id)
        
      }
    }

    if (props.match.path === "/salesmanager/edit/:id") {
      userACL.atUpdate(values);
      values.segid = values.cid;
      values.smType = 'Sales Manager'
      delete values.pin
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(editSalesmanager(values));
        setsavedSalesManagerId(values.id)
        setTimeout(function(){
          props.history.push(`/salesmanager/list`);
        }, 2000)          
      }
    }
  }

  return (
    <Container>
      <Header as='h2'>  {params.title}</Header>
      <Formik
        initialValues={salesmanager}
        validationSchema={salesmanagerSchema}
        onSubmit={(values, { resetForm }) => saveSalesManager(values, resetForm)}
        render={({ values, handleSubmit, resetForm, errors, handleChange, onChange, setFieldValue }) => (

          <Form as={FormikForm} onSubmit={handleSubmit} size='small' className="CustomeForm">
            <Form.Group widths={3}>
              {
                props.match.path === "/salesmanager/create" ?
                  <Field name='emp_name' label='Sales Manager Name' isMandatory={true} component={FormikInputComponent} validate={(val) => duplicateCheckItem(val, values)} />
                  : <Field name='emp_name' label='Sales Manager Name' isMandatory={true} component={FormikInputComponent} />
              }
            </Form.Group>

            <Form.Group widths={3}>
              {
                props.match.path === "/salesmanager/create" ?
                  <Field name='emp_code' label='Sales Manager Code' component={FormikInputComponent} validate={(val) => duplicateCheckItem(val, values)} />
                  : <Field name='emp_code' label='Sales Manager Code' component={FormikInputComponent} />
              }

            </Form.Group>

            <Form.Group widths={3}>
              <Field name='mobile' label='Mobile No' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={3}>
              <Field name='PAN_NO' label='PAN No' component={FormikInputComponent} />
            </Form.Group>

            <Button type="submit" size="medium" color="blue" className="CustomeBTN">
              {params.submitButtonText}

            </Button>

            {savedSalesManagerId ?

              <Notification id={savedSalesManagerId} resetForm={resetForm} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='save' />
              :
              null}
          </Form>
        )}
      />
    </Container>

  )
}

export default SalesManagerForm