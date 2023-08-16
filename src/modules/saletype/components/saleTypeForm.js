import React, { useEffect, useState } from 'react'
import { Container, Form, Header, Button } from 'semantic-ui-react'
import { Formik, Field, Form as FormikForm } from 'formik'
import { FormikInputComponent, FormikAmountComponent } from '../../../utilities/formUtils';
import { useDispatch, useSelector } from 'react-redux';
import { duplicateCheckSaleType, saleTypeSchemaNumber, saleTypeSchema } from '../data/model';
import { getNotification, getSaleType, getSaleTypeParams } from '../data/selectors';
import { setNotifyDone, } from '../data/actions'
import NumberTypeSelect from '../components/numberTypeSelect'
import Notification from '../../../utilities/notificationUtils'
import v4 from 'uuid'
import userACL from '../../../store/access';
import { values } from 'lodash';
import { createSaleType, editSaleType } from '../data/actions';

const SaleTypeForm = (props) => {

  const saletype = useSelector(state => getSaleType(state, props))
  const params = useSelector(state => getSaleTypeParams(state, props))
  const dispatch = useDispatch()

  const [savedSaleTypeId, setSavedSaleTypeId] = useState(false)
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("saletype");
      obj.classList.add("markedMenuOpt");
  }, [])


  const saveSaleType = (values, resetForm) => {
    if (props.match.path === "/sale-type/create") {
      values.id = v4()
      userACL.atCreate(values)
      values.segid = values.cid
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(createSaleType(values))
        setSavedSaleTypeId(values.id)
        
      }


    }
    if (props.match.path === "/sale-type/edit/:id") {
      userACL.atUpdate(values)
      values.segid = values.cid;
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(editSaleType(values))
        setSavedSaleTypeId(values.id)
        setTimeout(function(){
          props.history.push(`/sale-type/list`);
        }, 2000)  
      }

    }
  }

  return (
    <Container>
      <Header as='h2' id="headerHeight">{params.title}</Header>
      <Formik id="saleType" size="large" width={5}
        initialValues={saletype}
        validationSchema={saleTypeSchema}
        onSubmit={(values, { resetForm }) => saveSaleType(values, resetForm)}
        render={({ handleSubmit, onChange, resetForm, values, handleChange }) => (
          // <div style={{ width: '100%' }}>
          <Form as={FormikForm} size="small" width={12} onSubmit={handleSubmit} className="CustomeForm">
            <Form.Group widths={4}>
              {
                props.match.path === "/sale-type/create" ?
                  <Field name="saletype_name" label="Sale Type Name" isMandatory={true} component={FormikInputComponent} validate={(val) => duplicateCheckSaleType(val, values)} focus={true} maxlength={100}></Field>
                  : <Field name="saletype_name" label="Sale Type Name" isMandatory={true} component={FormikInputComponent} focus={true} maxlength={100}></Field>
              }
            </Form.Group>
            <Form.Group widths={4}>
              <Field name="price_list" label="Price List Name" isMandatory={true} component={FormikInputComponent} focus={true} maxlength={100}></Field>
            </Form.Group>
            <Button type="submit" size="medium" color='blue' className="CustomeBTN"> {params.submitButtonText} </Button>
            {savedSaleTypeId ?
              <Notification id={savedSaleTypeId} resetForm={resetForm} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='save' />
              :
              null}
          </Form>
          // </div>
        )}
      />
    </Container>
  )
}

export default SaleTypeForm;