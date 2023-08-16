import React, { useEffect, useState } from "react";
import { Formik, Field, Form as FormikForm } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form, Container, Checkbox } from "semantic-ui-react";
import {
    customerSchema,
    duplicateCheckCustomer,
    updateCustomerNext,
} from "../data/model";
import {
    FormikCheckBoxComponent,
    FormikInputComponent,
    FormikTextAreaComponent,
} from "../../../utilities/formUtils";
import {
    getCustomer,
    getCustomerParams,
    selectCountry,
    getStateNames,
    getCustomerList,
} from "../data/selectors";
import { createCustomer, setNotifyDone } from "../data/actions";
import Notification from "../../../utilities/notificationUtils";
import { v4 } from "uuid";
import userACL from "../../../store/access";
import GSTRegTypeSelect from "./gstRegistrationType";
import StateSelect from "./stateSelect";
import CountrySelect from "./countrySelect";
import { cloneDeep, filter, matches } from "lodash";

const CustomerEditForm = (props) => {

    const customer = useSelector((state) => getCustomer(state, props));
    const countryObj = useSelector((state) => selectCountry(state, props));
    const stateNames = useSelector((state) => getStateNames(state, props));
    const custList = useSelector((state) => getCustomerList(state, props))

    const dispatch = useDispatch();
    let customerObj = props.customerEditObj ? props.customerEditObj : {};
    let party = props.customerEditObj
        ? props.customerEditObj.party
            ? props.customerEditObj.party
            : {}
        : {};
    // console.log('party', party)
    let alt_party = props.customerEditObj
        ? props.customerEditObj.alt_party_address
            ? props.customerEditObj.alt_party_address[0]
                ? props.customerEditObj.alt_party_address[0]
                : {}
            : {}
        : {};
    let pa_address = `${alt_party.address &&
        alt_party.address !== "None" &&
        alt_party.address !== undefined
        ? alt_party.address
        : ""
        }`;

    const [country, setCountry] = useState("");
    const [paCountry, setPaCountry] = useState("");
    const [checkGstType, setCheckGstType] = useState("");
    const [govtAgency, setGovtAgency] = useState(false);
    const [firstVehicle, setFirstVehicle] = useState(false);
    const [addressVerify, setAddressVerify] = useState(false);
    const [permitRequired, setPermitRequired] = useState(false);
    const [custRes, setCustRes] = useState({});

    useEffect(() => {
        let getObjCountry = filter(countryObj, matches({ value: party.gst_reg_type === "registered" ? "India" : party.country_name }));
        let getPaObjCountry = filter(countryObj, matches({ value: alt_party.country_name }));
        setCountry(getObjCountry[0].countryId);
        setPaCountry(
            (getPaObjCountry && getPaObjCountry !== undefined && getPaObjCountry !== null && getPaObjCountry.length > 0) ?
                getPaObjCountry[0].countryId : "I2"
        );
        setCheckGstType(party.gst_reg_type)
    }, [alt_party]);

    const updateCustomer = (values, resetForm) => {
        userACL.atCreate(values);
        // values.segid = values.cid
        values.gst_no = values.gst_no
            ? values.gst_no !== null
                ? values.gst_no
                : ""
            : "";
        delete values.txnid;
        delete values.id;
        values.customerCd = values.customerCd === "" ? null : values.customerCd;
        values.rlb_lid = customerObj ? customerObj.id : "";
        if (values.gst_reg_type === "foreign_goods_custom") {
            values.gst_reg_type = "Foreign Goods Custom"
        }
        if (values.gst_reg_type === "remind_me_later") {
            values.gst_reg_type = "Remind me later"
        }
        if (govtAgency) {
            values.government_agency = "y"
        } else {
            values.government_agency = custRes.government_agency
        }
        if (firstVehicle) {
            values.first_vehicle = "y"
        } else {
            values.first_vehicle = custRes.first_vehicle
        }
        if (addressVerify) {
            values.address_verification = "y"
        } else {
            values.address_verification = custRes.address_verification
        }
        if (permitRequired) {
            values.permit_required = "y"
        } else {
            values.permit_required = custRes.permit_required
        }
        updateCustomerNext(
            values,
            props.setCustomerEditModal,
            props.setErrorAlert,
            props.preantCallBack,
            resetForm
        );
    };

    const setRegCountryAddId = (value, setFieldValue, values) => {
        if (value === "") {
            setFieldValue("state", "")
        } else {
            let getObjCountry = filter(
                countryObj,
                matches({ value: value ? value.toString().trim() : "" })
            );
            if (getObjCountry.length > 0) {
                setCountry(getObjCountry[0].countryId)
                if (getObjCountry[0].countryId !== "I2") {
                    if (checkGstType === "registered") {
                        setFieldValue("state", "")
                        setFieldValue("gst_no", "")
                        setFieldValue("gst_reg_type", "")
                        setFieldValue("pan_no", "")
                    }
                }
            }
        }
        setFieldValue("state", "")

    };

    const setPerCountryAddId = (value, setFieldValue, values) => {
        if (value === "") {
            setFieldValue("pa_state", "")
        } else {
            let getObjCountry = filter(
                countryObj,
                matches({ value: value ? value.toString().trim() : "" })
            );
            if (getObjCountry.length > 0) {
                setPaCountry(getObjCountry[0].countryId);
            }
        }
        setFieldValue("pa_state", "")

    };
    const gstRegTypeOnChangeFunc = (value, setFieldValue, values) => {
        if (value === "") {
            setFieldValue("gst_no", "");
            setFieldValue("pan_no", "")
        }
        setCheckGstType(value);
    };

    const gstOnChangeFunction = (values, value, setFieldValue) => {
        let getValue = value.length >= 2 ? value.slice(0, 2) : "";
        if (values.country !== "") {
            let segMatchObj = stateNames.filter((obj) => {
                let stateId = obj.stateId ? obj.stateId.split("_") : [];
                return stateId[0] === "I2" && getValue === stateId[1];
            });
            if (segMatchObj.length > 0) {
                setFieldValue("state", segMatchObj[0].value);
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
    };

    const copyRegAddress = (checked, setFieldValue, values) => {
        if (checked === true) {
            let getPaObjCountry = filter(countryObj, matches({ value: values.country }));
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
    useEffect(() => {
        if (custList !== null && custList !== undefined && custList.length > 0) {
            if (customerObj && customerObj !== null && customerObj !== undefined) {
                custList.filter((item) => {
                    if (item.rlb_lid == customerObj.id) {
                        setCustRes(item)
                        return item
                    }
                })
            }
        }

    }, [customerObj])

    const govtAgencyClicked = (checked, setFieldValue, values) => {
        console.log('values', values)
        if (checked === true) {
            setGovtAgency(true)
            setFieldValue('government_agency', "y")
            custRes.government_agency = "y"
        } else {
            setGovtAgency(false)
            setFieldValue('government_agency', "n")
            custRes.government_agency = "n"
        }

    }
    const firstVehicleClicked = (checked, setFieldValue) => {
        if (checked === true) {
            setFieldValue('first_vehicle', "y")
            setFirstVehicle(true)
            custRes.first_vehicle = "y"
        } else {
            setFieldValue('first_vehicle', "n")
            setFirstVehicle(false)
            custRes.first_vehicle = "n"
        }
    }
    const addressVerificationClicked = (checked, setFieldValue) => {
        if (checked === true) {
            setFieldValue('address_verification', "y")
            setAddressVerify(true)
            custRes.address_verification = "y"
        } else {
            setFieldValue('address_verification', "n")
            setAddressVerify(false)
            custRes.address_verification = "n"
        }
    }
    const permitRequiredClicked = (checked, setFieldValue) => {
        if (checked === true) {
            setFieldValue('permit_required', "y")
            setPermitRequired(true)
            custRes.permit_required = "y"
        } else {
            setFieldValue('permit_required', "n")
            setPermitRequired(false)
            custRes.permit_required = "n"
        }
    }
    return (
        <Container>
            <Formik
                id="customer"
                size="large"
                width={5}
                initialValues={customer}
                validationSchema={customerSchema}
                onSubmit={(values, { resetForm }) => {
                    updateCustomer(values, resetForm);
                }}
                render={({
                    values,
                    handleSubmit,
                    onChange,
                    handleChange,
                    errors,
                    handleBlur,
                    setFieldValue,
                }) => (
                    <Form
                        as={FormikForm}
                        size="small"
                        className="popupCustomeForm"
                        width={5}
                        onSubmit={handleSubmit}
                        onBlur={handleBlur}
                    >
                        <Form.Group widths={4} className="">
                            <Field
                                name="customerName"
                                label="Customer Name"
                                component={FormikInputComponent}
                                isMandatory={true}
                                setFieldValueM={
                                    (customerObj.ledger_name === "None" ||
                                        customerObj === null ||
                                        customerObj === undefined ||
                                        customerObj === ""
                                    )
                                        ? ""
                                        : customerObj.ledger_name
                                }
                            ></Field>
                            <Field
                                name="customerCd"
                                component={FormikInputComponent}
                                label="Customer Id"
                                setFieldValueM={
                                    (customerObj.ledger_code === "None" ||
                                        customerObj === null ||
                                        customerObj === undefined ||
                                        customerObj === "")
                                        ? ""
                                        : customerObj.ledger_code
                                }
                            />
                            <Field
                                name="contact_person"
                                component={FormikInputComponent}
                                label="Contact Person"
                                setFieldValueM={
                                    (party.contact_person === "None" ||
                                        party === null ||
                                        party === undefined ||
                                        party === "") ? "" : party.contact_person
                                }
                            />
                            <Field
                                name="email_id"
                                component={FormikInputComponent}
                                label="Email Id"
                                setFieldValueM={(party.email === "None" ||
                                    party === null ||
                                    party === undefined ||
                                    party === "") ? "" : party.email}
                            />
                        </Form.Group>
                        <Form.Group widths={4}>
                            <Field
                                name="mobile"
                                component={FormikInputComponent}
                                label="Mobile No"
                                setFieldValueM={(party.phone === "None" ||
                                    party === null ||
                                    party === undefined ||
                                    party === "") ? "" : party.phone}
                            />

                            <GSTRegTypeSelect
                                name="gst_reg_type"
                                isSelection={true}
                                label="GST Registration Type"
                                isMandatory={true}
                                setOnCall={gstRegTypeOnChangeFunc}
                                setFieldValueM={
                                    (party.gst_reg_type === "None" ||
                                        party === null ||
                                        party === undefined ||
                                        party === "") ? "" : party.gst_reg_type
                                }
                            />
                            {checkGstType === "registered" ? (
                                <Field
                                    name="gst_no"
                                    component={FormikInputComponent}
                                    label="GST No"
                                    onChangeFunc={gstOnChangeFunction}
                                    setFieldValueM={
                                        (party.gstin_no === "None" ||
                                            party === null ||
                                            party === undefined ||
                                            party === "") ? "" : party.gstin_no
                                    }
                                />
                            ) : (
                                <Field
                                    name="gst_no"
                                    component={FormikInputComponent}
                                    label="GST No"
                                    readOnly={true}
                                    className="cust_gst"
                                    setFieldValueM={
                                        (party.gstin_no === "None" ||
                                            party === null ||
                                            party === undefined ||
                                            party === ""
                                        ) ? "" : party.gstin_no
                                    }
                                />
                            )}
                            <Field
                                name="pan_no"
                                component={FormikInputComponent}
                                label="PAN No"
                                setFieldValueM={(party.pan_no === "None" ||
                                    party === null ||
                                    party === undefined ||
                                    party === "") ? "" : party.pan_no}
                            />
                        </Form.Group>
                        <Form.Group widths={4} style={{ paddingBottom: "12px", paddingTop: "12px", marginLeft: "0px", display: "flex" }}>
                            {
                                custRes.government_agency === "y" ?
                                    <div style={{ marginRight: "13%" }}>
                                        <Checkbox name="government_agency" checked={true} onClick={(e, { checked }) => govtAgencyClicked(checked, setFieldValue, values)} label="Government Agency" />
                                    </div>
                                    :
                                    <div style={{ marginRight: "13%" }}>
                                        <Checkbox name="government_agency" onClick={(e, { checked }) => govtAgencyClicked(checked, setFieldValue, values)} label="Government Agency" />
                                    </div>
                            }
                            {
                                custRes.first_vehicle === "y" ?
                                    <div style={{ marginRight: "17%" }}>
                                        <Checkbox name="first_vehicle" checked={true} onClick={(e, { checked }) => firstVehicleClicked(checked, setFieldValue, values)} label="First Vehicle" />
                                    </div>
                                    :
                                    <div style={{ marginRight: "17%" }}>
                                        <Checkbox name="first_vehicle" onClick={(e, { checked }) => firstVehicleClicked(checked, setFieldValue, values)} label="First Vehicle" />
                                    </div>
                            }
                            {
                                custRes.address_verification === "y" ?
                                    <div style={{ marginRight: "13%" }}>
                                        <Checkbox name="address_verification" checked={true} onClick={(e, { checked }) => addressVerificationClicked(checked, setFieldValue, values)} label="Address Verification" />
                                    </div>
                                    :
                                    <div style={{ marginRight: "13%" }}>
                                        <Checkbox name="address_verification" onClick={(e, { checked }) => addressVerificationClicked(checked, setFieldValue, values)} label="Address Verification" />
                                    </div>
                            }
                            {
                                custRes.permit_required === "y" ?
                                    <Checkbox name="permit_required" checked={true} onClick={(e, { checked }) => permitRequiredClicked(checked, setFieldValue, values)} label="Permit Required" />
                                    :
                                    <Checkbox name="permit_required" onClick={(e, { checked }) => permitRequiredClicked(checked, setFieldValue, values)} label="Permit Required" />
                            }

                        </Form.Group>

                        <Form.Group widths={4} className="">
                            <Field
                                name="registration_address"
                                component={FormikTextAreaComponent}
                                userProps={{ maxLength: 150, displayCount: true, height: 2 }}
                                label="Registration Address (Hosue-No/Area/Road)"
                                focus={true}
                                setFieldValueM={(party.address === "None" ||
                                    party === null ||
                                    party === undefined ||
                                    party === "") ? "" : party.address}
                            />
                        </Form.Group>
                        <Form.Group widths={4}>
                            <Field
                                name="city"
                                component={FormikInputComponent}
                                label="Registration City"
                                setFieldValueM={(party.city === "None" ||
                                    party === null ||
                                    party === undefined ||
                                    party === "") ? "" : party.city}
                            />
                            <Field
                                name="pin"
                                component={FormikInputComponent}
                                label="Registration Pin Code"
                                setFieldValueM={(party.pin === "None" ||
                                    party === null ||
                                    party === undefined ||
                                    party === "") ? "" : party.pin}
                            />
                            <CountrySelect
                                name="country"
                                isSelection={true}
                                label="Registration Country"
                                placeholder="India"
                                setOnCall={setRegCountryAddId}
                                isMandatory={true}
                                setFieldValueM={
                                    (party.country_name === "None" ||
                                        party === null ||
                                        party === undefined ||
                                        party === "") ? "" : party.country_name
                                }
                            />
                            <StateSelect
                                name="state"
                                isSelection={true}
                                label="Registration State"
                                placeholder="Select State"
                                country={country}
                                isMandatory={true}
                                setFieldValueM={(party.st === "None" ||
                                    party === null ||
                                    party === undefined ||
                                    party === "") ? "" : party.st}
                            />
                        </Form.Group>
                        <Form.Group widths={2} style={{ paddingBottom: "12px", paddingTop: "12px", marginLeft: "0px" }}>
                            {
                                props.sameAddCheck == true ?
                                    <Field name='res_permanent' component={FormikCheckBoxComponent} defaultChecked={true} checkBoxClicked={copyRegAddress} label='The Permanent Address is same as Registration Address' />
                                    :
                                    <Field name='res_permanent' component={FormikCheckBoxComponent} checkBoxClicked={copyRegAddress} label='The Permanent Address is same as Registration Address' />
                            }

                            {/* <Checkbox onClick={(e, { checked }) => copyRegAddress(checked, setFieldValue, values)} label="The Permanent Address is same as Registration Address" /> */}
                        </Form.Group>
                        <Form.Group widths={4} className="">
                            <Field
                                name="permanent_address"
                                component={FormikTextAreaComponent}
                                userProps={{ maxLength: 150, displayCount: true, height: 2 }}
                                label="Permanant Address (Hosue-No/Area/Road)"
                                focus={true}
                                setFieldValueM={(pa_address === "None") ? "" : pa_address}
                            />
                        </Form.Group>
                        <Form.Group widths={4}>
                            <Field
                                name="pa_city"
                                component={FormikInputComponent}
                                label="Permanent City"
                                setFieldValueM={(alt_party.city === "None" ||
                                    alt_party === null ||
                                    alt_party === undefined ||
                                    alt_party === "") ? "" : alt_party.city}
                            />
                            <Field
                                name="pa_pin"
                                component={FormikInputComponent}
                                label="Permanent Pin Code"
                                setFieldValueM={(alt_party.pin === "None" ||
                                    alt_party === null ||
                                    alt_party === undefined ||
                                    alt_party === "") ? "" : alt_party.pin}
                            />
                            <CountrySelect
                                name="pa_country"
                                isSelection={true}
                                label="Permanent Country"
                                placeholder="India"
                                setOnCall={setPerCountryAddId}
                                isMandatory={true}
                                setFieldValueM={
                                    (alt_party.country_name === "None" ||
                                        alt_party === null ||
                                        alt_party === undefined ||
                                        alt_party === "")
                                        ? ""
                                        : alt_party.country_name
                                }
                            />
                            <StateSelect
                                name="pa_state"
                                isSelection={true}
                                label="Permanent State"
                                placeholder="Select State"
                                country={paCountry}
                                isMandatory={true}
                                setFieldValueM={(alt_party.st === "None" ||
                                    alt_party === null ||
                                    alt_party === undefined ||
                                    alt_party === "") ? "" : alt_party.st}
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            size="medium"
                            color="blue"
                            className="CustomeBTN"
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            />
        </Container>
    );
};

export default CustomerEditForm;
