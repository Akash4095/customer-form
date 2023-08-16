import React, { useEffect, useState } from 'react'
import { Formik, Field, Form as FormikForm } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form, Container } from 'semantic-ui-react'
import { FormikCheckBoxComponent, FormikInputComponent, FormikTextAreaComponent } from '../../../utilities/formUtils'
import { v4 } from 'uuid';
import userACL from '../../../store/access';
import { filter, matches, merge } from 'lodash';
import { createItemNext, itemSchema } from '../data/model';
import { getItems } from '../data/selectors';



const CreateItemForm = (props) => {

  const items = useSelector(state => getItems(state, props))
  const data = merge({}, userACL.atFetch())
  const dispatch = useDispatch()

  const saveItem = (values, resetForm) => {
    values.cid = data.cid
    delete values.txnid
    // console.log('values', values)
    createItemNext(values, props.setCreateItemModalOpen, props.setErrorAlert, props.createItemPreantCallBack, resetForm)
  }

  return (
    <Container>

      <Formik id="finbank" size="large" width={5}
        initialValues={items}
        validationSchema={itemSchema}
        onSubmit={(values, { resetForm }) => {
          saveItem(values, resetForm)
        }}
        render={({ values, handleSubmit, onChange, handleChange, setFieldValue, errors, handleBlur }) => (

          <Form as={FormikForm} size="small" className="popupCustomeForm" width={5} onSubmit={handleSubmit} onBlur={handleBlur} >
            <Form.Group widths={2} className=''>
              <Field name='itemName' label='Item Name' component={FormikInputComponent} isMandatory={true} />
              <Field name='itemGrpName' label='Item Group Name' component={FormikInputComponent} isMandatory={true} />
            </Form.Group>

            <Form.Group widths={2} className=''>
              <Field name='itemCode' label='Item Code' component={FormikInputComponent} />
              <Field name='hsnCode' label='HSN Code' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={2} className=''>
              <Field name='baseUnitName' label='Base Unit Name' component={FormikInputComponent} isMandatory={true} />
              <Field name='isBatchEnable' label='Is Batch Enable' defaultChecked={true} component={FormikCheckBoxComponent} className="itemCheckbox" />
            </Form.Group>
            <Button type="submit" size="medium" color='blue' className="CustomeBTN">Submit</Button>
          </Form>
        )}
      />
    </Container>

  )
}

export default CreateItemForm



