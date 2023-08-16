import React, { useEffect, useState } from 'react'
import { Formik, Field, Form as FormikForm } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form, Container } from 'semantic-ui-react'
import { FormikInputComponent, FormikTextAreaComponent } from '../../../utilities/formUtils'
import { v4 } from 'uuid';
import userACL from '../../../store/access';
import { filter, matches } from 'lodash';
import { duplicateCheckItem, financeBankSchema, saveFinBankNext, updateFinBankNext } from '../../financebank/data/model';
import { getFinanceBankForModel} from '../../financebank/data/selectors';

const FinanceBankForm = (props) => {
    const financebank = useSelector(state => getFinanceBankForModel(state, props))
    const dispatch = useDispatch()

    useEffect(() => {
        if (document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length) {
            if (document.getElementsByClassName("markedMenuOpt")[0].classList) {
                document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
            }
        }
        let obj = document.getElementById("ciform");
        obj.classList.add("markedMenuOpt");
    }, [])


    const saveFinanceBank = (values, resetForm) => {

        values.finbank_code = (values.finbank_code === "") ? null : values.finbank_code
        userACL.atCreate(values)
        values.segid = values.cid
        delete values.txnid
        if (props.id === "") {
            saveFinBankNext(values, props.setFinBankModalOpen, props.setErrorAlert, props.finBankPreantCallBack, resetForm, props.id)
            props.setBankId(values.id)
        } else {
            updateFinBankNext(values, props.setFinBankModalOpen, props.setErrorAlert, props.finBankPreantCallBack, resetForm, props.id)
        }

    }

    return (
        <Container>

            <Formik id="finbank" size="large" width={5}
                initialValues={financebank}
                validationSchema={financeBankSchema}
                onSubmit={(values, { resetForm }) => {
                    saveFinanceBank(values, resetForm)
                }}
                render={({ values, handleSubmit, onChange, handleChange, setFieldValue, errors, handleBlur }) => (

                    <Form as={FormikForm} size="small" className="popupCustomeForm" width={5} onSubmit={handleSubmit} onBlur={handleBlur} >
                        <Form.Group widths={2} className=''>
                            {
                                props.id === "" ? <Field name='finbank_name' label='Finance Bank Name' component={FormikInputComponent} isMandatory={true} validate={(val) => duplicateCheckItem(val, values)} />
                                    :
                                    <Field name='finbank_name' label='Finance Bank Name' component={FormikInputComponent} isMandatory={true} />
                            }

                        </Form.Group>
                        <Form.Group widths={2} className=''>
                            {
                                props.id === "" ? <Field name='finbank_code' label='Finance Bank Code' component={FormikInputComponent} validate={(val) => duplicateCheckItem(val, values)} />
                                    :
                                    <Field name='finbank_code' label='Finance Bank Code' component={FormikInputComponent} />
                            }

                        </Form.Group>
                        <Button type="submit" size="medium" color='blue' className="CustomeBTN">Submit</Button>
                    </Form>
                )}
            />
        </Container>

    )
}

export default FinanceBankForm