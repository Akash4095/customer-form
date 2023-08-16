import React, { useState, useEffect } from 'react'
import { Container, Form, Header, Button } from 'semantic-ui-react'
import { Formik, Field, FieldArray, Form as FormikForm } from 'formik'
import { useDispatch, useSelector } from 'react-redux';
import userACL from '../../../store/access';
import OthersArray from './othersArray';
import { getOthers, getOthersList } from '../data/selectors';
import { merge } from 'lodash';
import { othersSchema, saveOthersNext, updateOthersNext } from '../data/model';


const OthersForm = (props) => {

    const othersList = useSelector(state => getOthersList(state, props))
    const segmap = useSelector(state => getOthers(state, props, props.listRes))
    const data = merge({}, userACL.atFetch())
    const dispatch = useDispatch()

    const saveOthersArray = (values, resetForm) => {
        let obj = {}

        if (values.others && values.others.length) {
            values.others.map((item, index) => {
                item.cid = data.cid
                item.segid = data.segid
                item.uid_create = data.uid
                item.uid_update = data.uid
                item.key = `Others${parseInt(index) + 1}`
            })
        }
        obj.data = values.others
        if (props.listRes && props.listRes !== null && props.listRes !== undefined && props.listRes.length > 0) {
            updateOthersNext(obj, props.setOthersModal, props.setOthersResponseModal, resetForm, dispatch)
        } else {
            saveOthersNext(obj, props.setOthersModal, props.setOthersResponseModal, resetForm)
        }


    }




    return (
        <Container>

            <Formik id="formType" size="large" width={5}
                initialValues={segmap}
                validationSchema={othersSchema}
                onSubmit={(values, { resetForm }) => saveOthersArray(values, resetForm)}
                render={({ handleSubmit, onChange, resetForm, errors, values, handleChange }) => (

                    <Form as={FormikForm} size="small" width={12} onSubmit={handleSubmit}>
                        <Form.Group >
                            <FieldArray name='others' component={OthersArray} />
                        </Form.Group>

                        <Button type="submit" size="medium" color='blue' className="CustomeBTN">Submit</Button>

                    </Form>

                )}
            />
        </Container>
    )
}

export default OthersForm