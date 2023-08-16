import React, { useEffect, useState } from 'react'
import { Formik, Field, Form as FormikForm } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form, Container, Checkbox } from 'semantic-ui-react'
import { customerSchema, duplicateCheckCustomer, saveCustomerNext } from '../data/model';
import { FormikCheckBoxComponent, FormikInputComponent, FormikTextAreaComponent } from '../../../utilities/formUtils'
import { getCustomer, getCustomerParams, selectCountry, getStateNames } from '../data/selectors';
import { createCustomer, fetchCustomer, setNotifyDone } from '../data/actions'
import Notification from '../../../utilities/notificationUtils';
import { v4 } from 'uuid';
import userACL from '../../../store/access';
import GSTRegTypeSelect from './gstRegistrationType';
import StateSelect from './stateSelect';
import CountrySelect from './countrySelect'
import { filter, matches } from 'lodash';
import PAStateSelect from './paStateSelect';

const CustomerForm = (props) => {
    const customer = useSelector(state => getCustomer(state, props))
    const params = useSelector(state => getCustomerParams(state, params))
    const countryObj = useSelector(state => selectCountry(state, props))
    const stateNames = useSelector(state => getStateNames(state, props))
    const dispatch = useDispatch()

    // useEffect(() => {
    //     if (document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length) {
    //         if (document.getElementsByClassName("markedMenuOpt")[0].classList) {
    //             document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
    //         }
    //     }
    //     let obj = document.getElementById("customer");
    //     obj.classList.add("markedMenuOpt");
    // }, [])

    const [country, setCountry] = useState("")
    const [paCountry, setPaCountry] = useState("")
    const [checkGstType, setCheckGstType] = useState("")

    useEffect(() => {
        let getObjCountry = filter(countryObj, matches({ 'value': 'India' }))
        setCountry(getObjCountry[0].countryId)
        setPaCountry(getObjCountry[0].countryId)
    }, [])

    const saveCustomer = (values, resetForm) => {
        values.id = v4()
        userACL.atCreate(values)
        // values.segid = values.cid
        values.gst_no = values.gst_no ? (values.gst_no !== null ? values.gst_no : '') : ''
        delete values.txnid
        values.customerCd = (values.customerCd === "") ? null : values.customerCd
        saveCustomerNext(values, props.setCustomerModal, props.setErrorAlert, props.preantCallBack, resetForm)
    }

    const setRegCountryAddId = (value, setFieldValue, values) => {
        if (value === "") {
            setFieldValue("state", "")
        } else {
            let getObjCountry = filter(countryObj, matches({ 'value': value ? (value).toString().trim() : '' }))

            if (getObjCountry.length > 0) {
                setCountry(getObjCountry[0].countryId)
                if (getObjCountry[0].countryId !== "I2") {
                    setFieldValue("state", "")
                    setFieldValue("gst_no", "")
                    setFieldValue("gst_reg_type", "")
                    setFieldValue("pan_no", "")
                }
            }
        }
        setFieldValue("state", "")

    }

    const setPerCountryAddId = (value, setFieldValue, values) => {
        if (value === "") {
            setFieldValue("pa_state", "")
        } else {
            let getObjCountry = filter(countryObj, matches({ 'value': value ? (value).toString().trim() : '' }))
            if (getObjCountry.length > 0) {
                setPaCountry(getObjCountry[0].countryId)
            }
        }
        setFieldValue("pa_state", "")

    }
    const gstRegTypeOnChangeFunc = (value, setFieldValue, values) => {
        console.log('value', value)
        if (value === "") {
            setFieldValue("gst_no", "");
            setFieldValue("pan_no", "")
        }
        setCheckGstType(value)
    }

    const gstOnChangeFunction = (values, value, setFieldValue) => {
        let getValue = value.length >= 2 ? value.slice(0, 2) : ''
        if (values.country !== "") {
            let segMatchObj = stateNames.filter((obj) => {
                let stateId = obj.stateId ? obj.stateId.split("_") : [];
                return ((stateId[0] === "I2") && (getValue === stateId[1]))
            })
            if (segMatchObj.length > 0) {
                setFieldValue("state", segMatchObj[0].value)
                setCountry("I2")
                setFieldValue("country", "India");
            }
        } else {
            setFieldValue("state", "");
        }
        if (value && value.length && value.length == 15) {
            let getPan = value.length >= 2 ? value.slice(2, 12) : ''
            setFieldValue("pan_no", getPan)
        }
    }

    const copyRegAddress = (checked, setFieldValue, values) => {
        if (checked === true) {
            let getPaObjCountry = filter(countryObj, matches({ value: values.country }));
            console.log('getPaObjCountry', getPaObjCountry)
            setPaCountry(
                (getPaObjCountry && getPaObjCountry !== undefined && getPaObjCountry !== null && getPaObjCountry.length > 0) ?
                    getPaObjCountry[0].countryId : "I2"
            );
            setFieldValue("permanent_address", values.registration_address)
            setFieldValue("pa_city", values.city)
            setFieldValue("pa_pin", values.pin)
            setFieldValue("pa_state", values.state)
            setFieldValue("pa_country", values.country)
        } else {
            setFieldValue("permanent_address", "")
            setFieldValue("pa_city", "")
            setFieldValue("pa_pin", "")
            setFieldValue("pa_state", "")
            setFieldValue("pa_country", "")
        }
    }

    return (
        <Container>

            <Formik id="customer" size="large" width={5}
                initialValues={customer}
                validationSchema={customerSchema}
                onSubmit={(values, { resetForm }) => {
                    saveCustomer(values, resetForm)
                }}
                render={({ values, handleSubmit, onChange, handleChange, errors, setFieldValue, handleBlur }) => (

                    <Form as={FormikForm} size="small" className="popupCustomeForm" width={5} onSubmit={handleSubmit} onBlur={handleBlur} >
                        <Form.Group widths={4} className=''>
                            <Field name="customerName" label='Customer Name' component={FormikInputComponent} isMandatory={true}  ></Field>
                            <Field name='customerCd' component={FormikInputComponent} label='Customer Id' />
                            <Field name='contact_person' component={FormikInputComponent} label='Contact Person' />
                            <Field name='email_id' component={FormikInputComponent} label='Email Id' />
                        </Form.Group>
                        <Form.Group widths={4}>
                            <Field name='mobile' component={FormikInputComponent} label='Mobile No' />
                            <GSTRegTypeSelect name='gst_reg_type' isSelection={true} label="GST Registration Type" setOnCall={gstRegTypeOnChangeFunc} isMandatory={true} />
                            {
                                checkGstType === "registered" ?
                                    <Field name='gst_no' component={FormikInputComponent} label='GST No' onChangeFunc={gstOnChangeFunction} />
                                    :
                                    <Field name='gst_no' component={FormikInputComponent} label='GST No' readOnly={true} className='cust_gst' />
                            }
                            <Field name='pan_no' component={FormikInputComponent} label='PAN No' />
                        </Form.Group>

                        <Form.Group widths={4} style={{ paddingBottom: "10px", paddingTop: "10px" }}>
                            <Field name="government_agency" label="Government Agency" component={FormikCheckBoxComponent} ></Field>
                            <Field name='first_vehicle' component={FormikCheckBoxComponent} label='First Vehicle' />
                            <Field name='address_verification' component={FormikCheckBoxComponent} label='Address Verification' />
                            <Field name='permit_required' component={FormikCheckBoxComponent} label='Permit Required' />
                        </Form.Group>
                        <Form.Group widths={4} className=''>
                            <Field name="registration_address" component={FormikTextAreaComponent} userProps={{ maxLength: 150, displayCount: true, height: 2 }} label='Registration Address (Hosue-No/Area/Road)' focus={true} />
                        </Form.Group>
                        <Form.Group widths={4}>
                            <Field name='city' component={FormikInputComponent} label='Registration City' />
                            <Field name='pin' component={FormikInputComponent} label='Registration Pin Code' />
                            <CountrySelect name='country' isSelection={true} label="Registration Country" placeholder='India' setOnCall={setRegCountryAddId} isMandatory={true} />
                            <StateSelect name='state' isSelection={true} label="Registration State" placeholder='Select State' country={country} isMandatory={true} />
                        </Form.Group>
                        <Form.Group widths={2} style={{ paddingBottom: "12px", paddingTop: "12px", marginLeft: "0px" }}>
                            <Field name='res_permanent' component={FormikCheckBoxComponent} checkBoxClicked={copyRegAddress} label='The Permanent Address is same as Registration Address' />
                            {/* <Checkbox onClick={(e, { checked }) => copyRegAddress(checked, setFieldValue, values)} label="The Permanent Address is same as Registration Address" /> */}
                        </Form.Group>
                        <Form.Group widths={4} className=''>
                            <Field name='permanent_address' component={FormikTextAreaComponent} userProps={{ maxLength: 150, displayCount: true, height: 2 }} label='Permanant Address (Hosue-No/Area/Road)' focus={true} />
                        </Form.Group>
                        <Form.Group widths={4}>
                            <Field name='pa_city' component={FormikInputComponent} label='Permanent City' />
                            <Field name='pa_pin' component={FormikInputComponent} label='Permanent Pin Code' />
                            <CountrySelect name='pa_country' isSelection={true} label="Permanent Country" placeholder='India' setOnCall={setPerCountryAddId} isMandatory={true} />
                            <PAStateSelect name='pa_state' isSelection={true} label="Permanent State" placeholder='Select State' country={paCountry} isMandatory={true} />
                        </Form.Group>

                        <Button type="submit" size="medium" color='blue' className="CustomeBTN">Submit</Button>
                    </Form>
                )}
            />
        </Container>

    )
}

export default CustomerForm