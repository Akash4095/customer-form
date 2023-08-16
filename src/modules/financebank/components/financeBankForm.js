import React, { useEffect, useState } from 'react'
import { Formik, Field, Form as FormikForm } from 'formik';
import { Button, Container, Form, Header } from 'semantic-ui-react'
import { FormikInputComponent } from '../../../utilities/formUtils';
import { useSelector, useDispatch } from 'react-redux';
import { getFinanceBank, getFinanceBankParams, getNotification } from '../data/selectors';
import { duplicateCheckItem, financeBankSchema } from '../data/model';
import { createFinanceBank, editFinanceBank, savedFinanceBank, setNotifyDone } from '../data/actions'
import Notification from '../../../utilities/notificationUtils';
import { v4 } from 'uuid';
import userACL from '../../../store/access';


const FinanceBankForm = (props) => {

  const financebank = useSelector(state => getFinanceBank(state, props))
  const params = useSelector(state => getFinanceBankParams(state, props))
  const dispatch = useDispatch()

  const [savedFinanceBankId, setSavedFinanceBankId] = useState(false)
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("financebank");
      obj.classList.add("markedMenuOpt");
  }, [])

  const savedFinanceBank = (values, resetForm) => {
    if (props.match.path === "/financebank/create") {
      values.finbank_code = (values.finbank_code === "") ? null : values.finbank_code
      values.id = v4()
      userACL.atCreate(values)
      values.segid = values.cid
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(createFinanceBank(values))
        setSavedFinanceBankId(values.id)
  
      }

    }
    if (props.match.path === "/financebank/edit/:id") {
      userACL.atUpdate(values)
      values.segid = values.cid;
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(editFinanceBank(values))
        setSavedFinanceBankId(values.id)
        setTimeout(function () {
          props.history.push(`/financebank/list`)
        }, 2000)
      }

    }

  }


  return (
    <Container>
      <Header as='h2'>{params.title}</Header>

      <Formik size="large" width={5}
        initialValues={financebank}
        validationSchema={financeBankSchema}
        onSubmit={(values, { resetForm }) => savedFinanceBank(values, resetForm)}
        render={({ values, handleSubmit, resetForm, errors, setFieldValue, onChange, handleChange }) => (

          <Form as={FormikForm} size='small' className="CustomeForm" onSubmit={handleSubmit} >
            <Form.Group widths={3}>
              {
                props.match.path === "/financebank/create" ?
                  <Field name='finbank_name' label='Finance Bank Name' component={FormikInputComponent} isMandatory={true} validate={(val) => duplicateCheckItem(val, values)} />
                  : <Field name='finbank_name' label='Finance Bank Name' component={FormikInputComponent} isMandatory={true} />
              }
            </Form.Group>

            <Form.Group widths={3}>
              {
                props.match.path === "/financebank/create" ?
                  <Field name='finbank_code' label='Finance Bank Code' component={FormikInputComponent} validate={(val) => duplicateCheckItem(val, values)} />
                  : <Field name='finbank_code' label='Finance Bank Code' component={FormikInputComponent} />
              }
            </Form.Group>

            <Button type="submit" size="medium" color="blue" className="CustomeBTN" >{params.submitButtonText}</Button>

            {savedFinanceBankId ?
              <Notification id={savedFinanceBankId} resetForm={resetForm} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='save' />
              :
              null}
          </Form>
        )}
      />
    </Container>

  )
}

export default FinanceBankForm;