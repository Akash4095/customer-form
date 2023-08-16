import React, { useEffect, useRef, useState } from 'react'
import { Formik, Field, FieldArray, Form as FormikForm } from 'formik'
import { Button, Container, Form, Grid, Header, Table, Modal, Icon } from 'semantic-ui-react'
import { FormikDisplayLabelComponent } from '../../../utilities/formUtils'
import { useSelector, useDispatch } from 'react-redux'
import { getAccessories, getCiForm, getCiFormParams, getSearchVinResults, getStoreSegmapResults, selectSegment } from '../data/selectors'
import { getSegmap, searchVin } from '../data/actions'
import userACL from '../../../store/access'
import AccessoriesArrayView from './accessoriesArrayView'
import CustomerForm from '../../customer/components/customerForm'
import { callPriceList, callPriceListView, callPurchasePrice, callSegmap, ciformSchema } from '../data/model'
import { filter, matches, merge } from 'lodash'
import { displayAmtInLakh, displayDate } from '../../../utilities/listUtils'
import { searchCustomer } from '../../customer/data/actions'
import { selectCountry, selectCustomerName } from '../../customer/data/selectors'
import { changeBackgroundFunction, setSalesManagerOnEdit } from './commonFunctions'



const CiFormView = (props) => {

    const data = merge({}, userACL.atFetch())
    const ciform = useSelector(state => getCiForm(state, props))
    const ciAcce = useSelector(state => getAccessories(state, ciform ? ciform.id : 0))
    const vinObj = useSelector(state => getSearchVinResults(state, props))
    const segmapObj = useSelector(state => selectSegment(state, props))
    const segmapResult = useSelector(state => getStoreSegmapResults(state, props))
    const params = useSelector(state => getCiFormParams(state, props))
    const custObj = useSelector(state => selectCustomerName(state, props))
    const countryObj = useSelector(state => selectCountry(state, props))
    const formTypeObj = useSelector(state => state.formtype.byListId)
    const saleTypeObj = useSelector(state => state.saletype.byListId)
    const salesManagerObj = useSelector(state => state.salesmanager.byId)
    const teamLeaderObj = useSelector(state => state.teamleader.byId)
    const scNameObj = useSelector(state => state.salesConsultant.byId)
    const leadSourceObj = useSelector(state => state.leadsource.byId)
    const bankObj = useSelector(state => state.financebank.byId)
    const finScObj = useSelector(state => state.financeConsultant.byId)


    const [displayStatus, setDisplayStatus] = useState(false);
    const [throughUs, setThroughUs] = useState(ciform ? ciform.through_us : "")
    const [typeOfSale, setTypeOfSale] = useState(ciform ? ciform.sale_type_id : "")
    const [leadSrc, setLeadSrcId] = useState(ciform ? ciform.lead_source_id : "")
    const [summaryInflow, setSummaryInflow] = useState(ciform ? ciform.on_road : 0)
    const [summaryoutflow, setSummaryOutflow] = useState(0)
    const [summaryInvoice, setSummaryInvoice] = useState(ciform ? (parseFloat(ciform.ex_showroom) + parseFloat(ciform.tcs)) : 0)
    const [summaryOtherSpt, setSummaryOtherSpt] = useState(0)
    const [summaryExBasic, setSummaryExBasic] = useState(ciform ? ciform.purchase_basic : 0)
    const [summaryHmilSpt, setSummaryHmilSpt] = useState(0)
    const [summaryRecivable, setSummaryRecivable] = useState(0)
    const [isIntra, setIsIntra] = useState(true)
    const [showSegName, setShowSegName] = useState('')
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, type: "", msg: "" });
    const [custObjSave, setCustObjSave] = useState(null)

    const [priceListAmt, setPriceListAmt] = useState(0)

    useEffect(() => {
        if (document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length) {
            if (document.getElementsByClassName("markedMenuOpt")[0].classList) {
                document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
            }
        }
        let obj = document.getElementById("ciform");
        obj.classList.add("markedMenuOpt");
    }, [])


    /// setting  hight in variable

    const [form, setForm] = useState(false)
    const [formScroll, setFormScroll] = useState(false)
    const [custScroll, setCustScroll] = useState(false)
    const [vehicalScroll, setVehicalScroll] = useState(false)
    const [dealScroll, setDealScroll] = useState(false)
    const [inflowScroll, setInflowScroll] = useState(false)
    const [outflowScroll, setOutflowScroll] = useState(false)
    const [usedCarAdditionalScroll, setUsedCarAdditionalScroll] = useState(false)
    const [supportScroll, setSupportScroll] = useState(false)
    const [summaryScroll, setSummaryScroll] = useState(false)
    const [nomineeScroll, setNomineeScroll] = useState(false)
    const [financeScroll, setFinanceScroll] = useState(false)
    const [accessoriesScroll, setAccessoriesScroll] = useState(false)


    const [customer_id, setcustomer_id] = useState('')
    const [customer_cd, setcustomer_cd] = useState('')
    const [customer_name, setCustomer_name] = useState(0)
    const [cust_email_id, setCust_email_id] = useState('')
    const [cust_mobele_no, setCust_mobele_no] = useState('')
    const [cust_pan_no, setCust_pan_no] = useState('')
    const [cust_gst_no, setCust_gst_no] = useState('')
    const [city, setCity] = useState('')
    const [pin, setPin] = useState('')
    const [state, setState] = useState('')
    const [contact_person, setContactPerson] = useState('')
    const [gstRegtype, setGstRegtype] = useState('')
    const [country, setCountry] = useState('')
    const [cust_registration_address, setCust_registration_address] = useState('')
    const [cust_permanent_address, setCust_permanent_address] = useState("")



    const [formType, setFormType] = useState('')
    const [saleType, setSaleType] = useState('')
    const [salesManager, setSalesManager] = useState('')
    const [teamLeader, setTeamLeader] = useState('')
    const [scName, setScName] = useState('')
    const [leadSource, setLeadSource] = useState('')
    const [bankName, setBankName] = useState('')
    const [finSCName, setFinSCName] = useState('')


    useEffect(() => {
        if (formTypeObj && formTypeObj !== undefined && formTypeObj !== null) {
            let fType = formTypeObj[ciform.form_type_id]
            if (fType) {
                setFormType(fType.stype_name)
            }
        }
    }, [formTypeObj])

    useEffect(() => {
        if (saleTypeObj && saleTypeObj !== undefined && saleTypeObj !== null) {
            let fType = saleTypeObj[ciform.sale_type_id]
            if (fType) {
                setSaleType(fType.saletype_name)
            }
        }
    }, [saleTypeObj])


    // useEffect(() => {
    //     if (salesManagerObj && salesManagerObj !== undefined && salesManagerObj !== null) {
    //         let fType = salesManagerObj[ciform.sales_manager_id]
    //         if (fType) {
    //             setSalesManager(fType.emp_name)
    //         }
    //     }
    // }, [salesManagerObj])

    useEffect(() => {
        if (teamLeaderObj && teamLeaderObj !== undefined && teamLeaderObj !== null) {
            setSalesManagerOnEdit(teamLeaderObj, ciform, setSalesManager, setTeamLeader)
        }
    }, [teamLeaderObj])

    useEffect(() => {
        if (scNameObj && scNameObj !== undefined && scNameObj !== null) {
            let fType = scNameObj[ciform.sales_consultant_id]
            if (fType) {
                setScName(fType.emp_name)
            }
        }
    }, [scNameObj])

    useEffect(() => {
        if (leadSourceObj && leadSourceObj !== undefined && leadSourceObj !== null) {
            let fType = leadSourceObj[ciform.lead_source_id]
            if (fType) {
                setLeadSource(fType.emp_name)
            }
        }
    }, [leadSourceObj])

    useEffect(() => {
        if (bankObj && bankObj !== undefined && bankObj !== null) {
            let fType = bankObj[ciform.finc_bank_id]
            if (fType) {
                setBankName(fType.finbank_name)
            }
        }
    }, [bankObj])

    useEffect(() => {
        if (finScObj && finScObj !== undefined && finScObj !== null) {
            let fType = finScObj[ciform.fin_sc_id]
            if (fType) {
                setFinSCName(fType.emp_name)
            }
        }
    }, [finScObj])

    const dispatch = useDispatch()

    const [savedCiFormId, setSavedCiFormId] = useState(false)

    const gstTypeOpt = [
        {
            key: 'unregistered',
            value: 'unregistered',
            text: 'Unregistered Person'
        },
        {
            key: 'registered',
            value: 'registered',
            text: 'Registered Person'
        },
        {
            key: 'foreign',
            value: 'foreign',
            text: 'Foreign Person'
        },
        {
            key: 'Foreign Goods Custom',
            value: 'Foreign Goods Custom',
            text: 'Foreign Goods Custom'
        },
        {
            key: 'Remind me later',
            value: 'Remind me later',
            text: 'Remind me later'
        }
    ]

    useEffect(() => {
        dispatch(getSegmap({ "cid": data.cid }))
    }, [])

    useEffect(() => {
        if (segmapObj && segmapObj !== undefined && segmapObj.length > 0) {
            let segVal = filter(segmapObj, matches({ 'segid': parseInt(data.segid, 10) }))
            if (segVal.length > 0) {
                setShowSegName(segVal[0].name)
            }
        }
    }, [segmapObj])

    useEffect(() => {
        if (custObjSave && custObjSave !== null) {
            let id = custObjSave.id
            if (id && id !== null && id !== "0" && id !== 0) {
                let ledObj = filter(custObj, matches({ 'id': parseInt(id, 10) }))
                if (ledObj.length > 0) {
                    let res = ledObj[0].party
                    let alt_address = ledObj[0].alt_party_address ? ledObj[0].alt_party_address : []
                    if (alt_address.length > 0) {
                        let pa = alt_address ? alt_address[0] : ""
                        let pa_address = `${((pa.address && pa.address !== "None" && pa.address !== undefined) ? pa.address + ", " : "")}${((pa.pin && pa.pin !== "None" && pa.pin !== undefined) ? "Pin Code - " + pa.pin + ", " : "")}${((pa.city && pa.city !== "None" && pa.city !== undefined) ? pa.city + ", " : "")}${((pa.st && pa.st !== "None" && pa.st !== undefined) ? pa.st + ", " : "")}${(pa.country_name && pa.country_name !== "None" && pa.country_name !== undefined) ? pa.country_name : ""}`
                        setCust_permanent_address(pa_address ? pa_address : "")
                    } else {
                        setCust_permanent_address("")
                    }
                    setcustomer_id(parseInt(ledObj[0].id, 10))
                    setcustomer_cd(ledObj[0].ledger_code === "None" ? "" : ledObj[0].ledger_code)
                    setCustomer_name(ledObj[0].ledger_name === " None" ? "" : ledObj[0].ledger_name)
                    setCust_email_id(res.email === "None" ? "" : res.email)
                    setCust_mobele_no(res.phone === "None" ? "" : res.phone)
                    setCust_pan_no(res.pan_no === "None" ? "" : res.pan_no)
                    setCust_gst_no(res.gstin_no === "None" ? "" : res.gstin_no)
                    setCity(res.city === "None" ? "" : res.city)
                    setPin(res.pin === "None" ? "" : res.pin)
                    setState(res.st)
                    setContactPerson(res.contact_person === "None" ? "" : res.contact_person)
                    let gstRegType = filter(gstTypeOpt, matches({ 'value': res.gst_reg_type ? (res.gst_reg_type).toString().trim() : '' }))
                    if (gstRegType.length > 0) {
                        setGstRegtype(gstRegType[0].text === "None" ? "" : gstRegType[0].text)
                    }
                    let gstCountry = filter(countryObj, matches({ 'value': res.country_name ? (res.country_name).toString().trim() : '' }))
                    if (gstCountry.length > 0) {
                        setCountry(gstCountry[0].text)
                    }
                    setCust_registration_address(res.address === "None" ? "" : res.address)
                }
            }
        }
    }, [custObj])

    const savedCiForm = (values, resetForm) => {
        props.history.push(`/ciform/summary/` + values.id)
    }


    /// assigning ref  for accessing hight

    const formDetails = useRef(null)
    const customer = useRef(null)
    const vehical = useRef(null)
    const final = useRef(null)
    const summary = useRef(null)
    const inflow = useRef(null)
    const outflow = useRef(null)
    const usedCarAddDetails = useRef(null)
    const support = useRef(null)
    const nominee = useRef(null)
    const finance = useRef(null)
    const accessories = useRef(null)


    //// scrolling function onclick

    const scrollForm = () => {
        formDetails.current.scrollIntoView({ behavior: 'smooth' })
        setForm(true)
    }
    const scrollCustomer = () => customer.current.scrollIntoView({ behavior: 'smooth' })
    const scrollVehical = () => vehical.current.scrollIntoView({ behavior: 'smooth' })
    const scrollFinal = () => final.current.scrollIntoView({ behavior: 'smooth' })
    const scrollSummary = () => summary.current.scrollIntoView({ behavior: 'smooth' })
    const scrollInflow = () => inflow.current.scrollIntoView({ behavior: 'smooth' })
    const scrollOutflow = () => outflow.current.scrollIntoView({ behavior: 'smooth' })
    const scrollUsedCarAddDetails = () => usedCarAddDetails.current.scrollIntoView({ behavior: 'smooth' })
    const scrollSupport = () => support.current.scrollIntoView({ behavior: 'smooth' })
    const scrollNominee = () => nominee.current.scrollIntoView({ behavior: 'smooth' })
    const scrollFinance = () => finance.current.scrollIntoView({ behavior: 'smooth' })
    const scrollAccessories = () => accessories.current.scrollIntoView({ behavior: 'smooth' })





    useEffect(() => {
        setFormScroll(true)
        setCustScroll(false)
        setDealScroll(false)
        setVehicalScroll(false)

    }, [])


    useEffect(() => {
        if (props.match.path === '/ciform/view/:id') {
            let id = props.match.params.id
            let listObj = ciform
            const data = merge({}, userACL.atFetch())
            let values = {
                "srchlName": listObj.customer_name
            }
            setCustObjSave({ name: listObj.customer_name, id: listObj.customer_id })
            values.segid = data.cid
            values.cid = data.cid
            dispatch(searchCustomer(values))
            let value = listObj.vin_on
            if (value.length > 2) {
                let values = {
                    "batchName": value
                }

                let data = merge({}, userACL.atFetch())
                values.segid = data.segid
                values.cid = data.cid
                if (values.cid !== 0) {
                    dispatch(searchVin(values))
                }

            }
            setSummaryOutflow(parseFloat(listObj.out_cash_disc) + parseFloat(listObj.out_exchange_disc) + parseFloat(listObj.out_foc_acc))

            let hmilSpt = (parseFloat(listObj.exchange_discount) + parseFloat(listObj.corporate_discount) + parseFloat(listObj.loyalty_discount) + parseFloat(listObj.warranty_discount) +
                parseFloat(listObj.retail_support_discount) + parseFloat(listObj.rsa_discount) + parseFloat(listObj.insurance_discount))

            setSummaryHmilSpt(hmilSpt)
            let outflowSum = parseFloat(listObj.out_exchange_disc ? listObj.out_exchange_disc : 0) + parseFloat(listObj.inflow_loyalty_discount ? listObj.inflow_loyalty_discount : 0) + parseFloat(listObj.used_car_value ? listObj.used_car_value : 0) + parseFloat(listObj.outflw_adsnl_discount ? listObj.outflw_adsnl_discount : 0)
            // let outflowSum = (parseFloat(listObj.out_cash_disc) + parseFloat(listObj.out_exchange_disc)  + parseFloat(listObj.out_foc_acc))

            if (listObj.on_road) {
                setSummaryRecivable(parseFloat(listObj.on_road) - parseFloat(outflowSum ? outflowSum : 0))
            } else {
                setSummaryRecivable(0)
            }
        }
    }, [])


    const changeBackground = () => {
        changeBackgroundFunction(
            formDetails,
            setFormScroll,
            setCustScroll,
            setVehicalScroll,
            setDealScroll,
            setOutflowScroll,
            setInflowScroll,
            setSupportScroll,
            setSummaryScroll,
            setNomineeScroll,
            setFinanceScroll,
            setAccessoriesScroll,
            setUsedCarAdditionalScroll,
            customer,
            vehical,
            final,
            summary,
            inflow,
            outflow,
            usedCarAddDetails,
            support,
            nominee,
            finance,
            accessories
        )

    }

    window.addEventListener('scroll', changeBackground)


    useEffect(() => {
        if (ciform) {
            if (saleTypeObj) {
                if (vinObj) {
                    if (vinObj[0]) {
                        if (vinObj[0].itemName && vinObj[0].itemName !== undefined && vinObj[0].itemName !== null && vinObj[0].itemName !== "") {
                            let plNameGet = ciform.sale_type_id ? (saleTypeObj[ciform.sale_type_id] ? (saleTypeObj[ciform.sale_type_id].price_list ? saleTypeObj[ciform.sale_type_id].price_list : '') : '') : ''
                            console.log("call")
                            callPriceListView(vinObj[0].itemName, ciform.booking_date, plNameGet, setPriceListAmt)
                        }
                    }
                }
            }
        }
    }, [vinObj, saleTypeObj])


    useEffect(() => {
        if (props.match.path === '/ciform/create') {
            let Acc = ciAcce[0]
            userACL.atCreate(Acc)
            Acc.txn_id = ciform.id
            ciform.accdetails = ciAcce
        }
    })



    const preantCallBack = (value) => {
        setCustObjSave(value)
        const data = merge({}, userACL.atFetch())
        let values = {
            "srchlName": value.name
        }
        values.segid = data.cid
        values.cid = data.cid
        if (values.cid !== 0) {
            dispatch(searchCustomer(values))
        }
    }


    return (
        <Container>
            <Header as='h2' textAlign='center'>{params.title}</Header>
            <Formik
                initialValues={ciform}
                validationSchema={ciformSchema}
                onSubmit={(values, { resetForm }) => savedCiForm(values, resetForm)}
                render={({ handleSubmit, onChange, values, handleChange, errors, setFieldValue, handleBlur }) => (
                    <Grid>
                        <Grid.Column width={3}>
                            <Table className='ciFormMenu'>
                                <Table.Body >
                                    <Table.Row >
                                        <Table.Cell className="subMenuTd" onClick={scrollForm}  > <span className={formScroll ? 'commonActive active' : null} >Form Details</span></Table.Cell>
                                    </Table.Row>
                                    <Table.Row >
                                        <Table.Cell className="subMenuTd" onClick={scrollCustomer} > <span className={custScroll ? 'commonActive active' : null} >Customer Details</span> </Table.Cell>
                                    </Table.Row>
                                    <Table.Row >
                                        <Table.Cell className="subMenuTd" onClick={scrollVehical} > <span className={vehicalScroll ? 'commonActive active' : null}>Vehicle Details</span> </Table.Cell>
                                    </Table.Row>
                                    <Table.Row >
                                        <Table.Cell className="subMenuTd" onClick={scrollFinal} > <span className={dealScroll ? 'commonActive active' : null}>Final Deal Details</span>
                                            <ul className='ciFormUl'>
                                                <li onClick={scrollInflow} className={inflowScroll ? 'commonActive active' : null}>- Inflow Amount</li>
                                                <li onClick={scrollOutflow} className={outflowScroll ? 'commonActive active' : null} >- Outflow Amount</li>
                                                <li onClick={scrollUsedCarAddDetails} className={usedCarAdditionalScroll ? 'commonActive active' : null} >- Used Car Additional Details</li>
                                                <li onClick={scrollSupport} className={supportScroll ? 'commonActive active' : null}>- Support Amount</li>
                                            </ul>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row >
                                        <Table.Cell className="subMenuTd" onClick={scrollSummary}  > <span className={summaryScroll ? 'commonActive active' : null}>Summary Details</span> </Table.Cell>
                                    </Table.Row>
                                    <Table.Row >
                                        <Table.Cell className="subMenuTd" onClick={scrollNominee}  > <span className={nomineeScroll ? 'commonActive active' : null}>Nominee Details</span> </Table.Cell>
                                    </Table.Row>
                                    <Table.Row >
                                        <Table.Cell className="subMenuTd" onClick={scrollFinance}  > <span className={financeScroll ? 'commonActive active' : null}>Finance Details</span> </Table.Cell>
                                    </Table.Row>
                                    <Table.Row >
                                        <Table.Cell className="subMenuTd" onClick={scrollAccessories}  > <span className={accessoriesScroll ? 'commonActive active' : null}>Accessories Details</span> </Table.Cell>
                                    </Table.Row>
                                </Table.Body>

                            </Table>
                        </Grid.Column>
                        <Grid.Column width={12}>

                            <Form as={FormikForm} size="small" onSubmit={handleSubmit} onBlur={handleBlur} className='ciform' >
                                <div ref={formDetails} className={form ? 'paddingTop' : null} id='form' >
                                    <Header as='h3' className='headerBlue' >Form Details</Header>
                                    <Form.Group widths={3} className='headerGap'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Form Type' text={formTypeObj[ciform.form_type_id] ? formType ? formType : 'Loading...' : "N/A"} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Location' text={segmapObj ? showSegName ? showSegName : 'Loading...' : 'N/A'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Date' text={ciform.ci_form_date ? displayDate(ciform.ci_form_date) : ''} />

                                    </Form.Group>
                                    <Form.Group widths={3} className="paddingTop15">
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Form No' text={ciform.form_no ? ciform.form_no : ''} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Booking Date' text={ciform.booking_date ? displayDate(ciform.booking_date) : ''} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Expected Delivery Date' text={ciform.ex_delivery_date ? displayDate(ciform.ex_delivery_date) : ''} />
                                    </Form.Group>

                                    <Form.Group widths={3} className="paddingTop15">
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Sales Consultant' text={scNameObj[ciform.sales_consultant_id] ? scName ? scName : 'Loading...' : "N/A"} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Team Leader' text={teamLeader ? teamLeader : 'N/A'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Sales Manager' text={salesManager ? salesManager : 'N/A'} />

                                    </Form.Group>

                                    <Form.Group widths={3} className='headerGapDown paddingTop15'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Lead Source' text={leadSourceObj[ciform.lead_source_id] ? leadSource ? leadSource : 'Loading...' : 'N/A'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Lead Source Name' text={ciform.lead_source_person ? ciform.lead_source_person : ''} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Type Of Sale' text={saleTypeObj[ciform.sale_type_id] ? saleType ? saleType : 'Loading...' : "N/A"} />
                                    </Form.Group>
                                    <Form.Group widths={3} className='headerGapDown paddingTop15'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Lead Source PAN' text={ciform.lead_source_pan ? ciform.lead_source_pan : ''} />
                                    </Form.Group>
                                </div>


                                <div ref={customer} className='paddingTop' id='customer' >
                                    <Header as='h3' className='headerBlue'>Customer Details</Header>
                                    <Form.Group widths={3} className='headerGap'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Customer Name' text={ciform.customer_name ? ciform.customer_name : "N/A"} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Date of Birth' text={ciform.customer_dob ? ciform.customer_dob : 'N/A'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Customer Id' text={ciform.customer_cd ? ciform.customer_cd : 'N/A'} />
                                    </Form.Group>

                                    <Form.Group widths={3} className='paddingTop15'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Email Id' text={ciform.cust_email_id ? ciform.cust_email_id : 'N/A'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Mobile No' text={ciform.cust_mobele_no ? ciform.cust_mobele_no : 'N/A'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Contact Person' text={customer_name ? contact_person ? contact_person : 'N/A' : 'Loading...'} />
                                    </Form.Group>
                                    <Form.Group widths={3} className='paddingTop15'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='GST Registration Type' text={customer_name ? gstRegtype ? gstRegtype : 'N/A' : 'Loading...'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='GST No' text={ciform.cust_gst_no ? ciform.cust_gst_no : 'N/A'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='PAN No' text={ciform.cust_pan_no ? ciform.cust_pan_no : 'N/A'} />
                                    </Form.Group>
                                    <Form.Group widths={3} className='paddingTop15'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='City' text={customer_name ? city ? city : 'N/A' : 'Loading...'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Pin' text={customer_name ? pin ? pin : 'N/A' : 'Loading...'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='State' text={customer_name ? state ? state : 'N/A' : 'Loading...'} />
                                    </Form.Group>
                                    <Form.Group widths={3} className='headerGapDown paddingTop15'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Registration Address' text={ciform.cust_registration_address ? ciform.cust_registration_address : 'N/A'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Permanant Address' text={ciform.cust_permanent_address ? ciform.cust_permanent_address : 'N/A'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Country' text={customer_name ? country ? country : 'N/A' : 'Loading...'} />
                                    </Form.Group>
                                </div>

                                <div ref={vehical} className='paddingTop' id='vehical'>
                                    <Header as='h3' className='headerBlue'  >Vehicle Details</Header>
                                    <Form.Group widths={3} className='headerGap'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Chassis/VIN No.' text={ciform ? ciform.vin_on ? ciform.vin_on : 'Loading...' : 'N/A'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Model' text={ciform.model_no ? ciform.model_no : ''} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Color' text={ciform.colour ? ciform.colour : ''} />
                                    </Form.Group>
                                    <Form.Group widths={3} className='headerGapDown paddingTop15'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Variant' text={ciform.variant ? ciform.variant : ''} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Engine No.' text={ciform.engine_no ? ciform.engine_no : ''} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Fuel Type' text={ciform.fuel_type ? ciform.fuel_type : ''} />
                                    </Form.Group>
                                </div>

                                <div ref={final} className='paddingTop' id='final'>
                                    <Header as='h3' className='headerBlue' >Final Deal Details</Header>
                                    <div ref={inflow} id='inflow' className='headerGap'  >
                                        <Header style={{ color: '#606060', fontSize: '16px' }} >Inflow Amount</Header>
                                        <Form.Group widths={4} className='headerGap'>
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Purchase Basic' text={ciform.purchase_basic ? displayAmtInLakh(ciform.purchase_basic) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Invoice Amount' text={ciform.invoice_amt ? displayAmtInLakh(ciform.invoice_amt) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='EX ShowRoom' text={ciform.ex_showroom ? displayAmtInLakh(ciform.ex_showroom) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='EX ShowRoom Without GST' text={ciform.ex_showroom_without_gst ? displayAmtInLakh(ciform.ex_showroom_without_gst) : ''} />
                                        </Form.Group>
                                        <Form.Group widths={4} className='paddingTop15'>
                                            {/* <Field component={FormikDisplayLabelComponent} isLabel={false} label='EX ShowRoom (Excl. GST & Disc.)' text={ciform.ex_showroom_without_gst_new ? displayAmtInLakh(ciform.ex_showroom_without_gst_new) : ''} addTextBelow={'Price List: ' + (priceListAmt ? displayAmtInLakh(priceListAmt) : '0.00')} /> */}
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='EX ShowRoom (Excl. GST & Disc.)' text={ciform.ex_shrm_wo_gst_n_disc ? displayAmtInLakh(ciform.ex_shrm_wo_gst_n_disc) : ''} addTextBelow={'Price List: ' + (priceListAmt ? displayAmtInLakh(priceListAmt) : '0.00')} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='TCS' text={ciform.tcs ? displayAmtInLakh(ciform.tcs) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='AMC Plan' text={ciform.sot ? displayAmtInLakh(ciform.sot) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Insurance' text={ciform.insurance ? displayAmtInLakh(ciform.insurance) : ''} />
                                        </Form.Group>
                                        <Form.Group widths={4} className='paddingTop15'>
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='M-TAX' text={ciform.m_tax ? displayAmtInLakh(ciform.m_tax) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Passing Charges' text={ciform.passing_charges ? displayAmtInLakh(ciform.passing_charges) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Hypothecation Charges' text={ciform.hypothecation_charges ? displayAmtInLakh(ciform.hypothecation_charges) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Paid Accessories' text={ciform.paid_acc ? displayAmtInLakh(ciform.paid_acc) : ''} />
                                        </Form.Group>
                                        <Form.Group widths={4} className='paddingTop15'>
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='RSA' text={ciform.rsa ? displayAmtInLakh(ciform.rsa) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Basic Kit' text={ciform.basic_kit ? displayAmtInLakh(ciform.basic_kit) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Price Difference' text={ciform.price_diff ? displayAmtInLakh(ciform.price_diff) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='RTO' text={ciform.rto ? displayAmtInLakh(ciform.rto) : ''} />
                                        </Form.Group>
                                        <Form.Group widths={4} className='paddingTop15'>
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Others 1' text={ciform.others_1 ? displayAmtInLakh(ciform.others_1) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Others 2' text={ciform.others_2 ? displayAmtInLakh(ciform.others_2) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Others 3' text={ciform.others_3 ? displayAmtInLakh(ciform.others_3) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Others 4' text={ciform.others_4 ? displayAmtInLakh(ciform.others_4) : ''} />
                                        </Form.Group>
                                        <Form.Group widths={4} className='paddingTop15' >
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='HSRP' text={ciform.hsrp ? displayAmtInLakh(ciform.hsrp) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='FASTag' text={ciform.fastag ? displayAmtInLakh(ciform.fastag) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Ex-Warranty' text={ciform.ex_warranty ? displayAmtInLakh(ciform.ex_warranty) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Cash Discount' text={ciform.out_cash_disc ? displayAmtInLakh(ciform.out_cash_disc) : ''} addTextBelow={'Excl. Tax: ' + (ciform.exclude_cash_disc ? displayAmtInLakh(ciform.exclude_cash_disc) : '0.00')} />
                                        </Form.Group>
                                        <Form.Group widths={4} className='paddingTop15' >

                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Loyalty Discount' text={ciform.inflow_loyalty_discount ? displayAmtInLakh(ciform.inflow_loyalty_discount) : ''} addTextBelow={'Excl. Tax: ' + (ciform.exclude_inflow_loyalty_disc ? displayAmtInLakh(ciform.exclude_inflow_loyalty_disc) : '0.00')} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Other Discount' text={ciform.inflow_other_discount ? displayAmtInLakh(ciform.inflow_other_discount) : ''} addTextBelow={'Excl. Tax: ' + (ciform.exclude_inflow_other_disc ? displayAmtInLakh(ciform.exclude_inflow_other_disc) : '0.00')} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Insurance Discount' text={ciform.inflow_insurance_discount ? displayAmtInLakh(ciform.inflow_insurance_discount) : ''} addTextBelow={'Excl. Tax: ' + (ciform.exclude_inflow_insurance_disc ? displayAmtInLakh(ciform.exclude_inflow_insurance_disc) : '0.00')} />
                                        </Form.Group>
                                        <Form.Group widths={4} className='paddingTop15' >
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Exchange Discount' text={ciform.out_exchange_disc ? displayAmtInLakh(ciform.out_exchange_disc) : ''} addTextBelow={'Excl. Tax: ' + (ciform.exclude_exchange_disc ? displayAmtInLakh(ciform.exclude_exchange_disc) : '0.00')} />
                                            {/* <Field component={FormikDisplayLabelComponent} isLabel={false} label='FOC Accessories' text={ciform.out_foc_acc ? displayAmtInLakh(ciform.out_foc_acc) : ''} addTextBelow={'Excl. Tax: ' + (ciform.exclude_foc_acc_disc ? displayAmtInLakh(ciform.exclude_foc_acc_disc) : '0.00')} /> */}
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='On Road' text={ciform.on_road ? displayAmtInLakh(ciform.on_road) : ''} />
                                        </Form.Group>
                                    </div>
                                    <div ref={outflow} className='headerGap' >
                                        <Header style={{ color: '#606060', fontSize: '16px' }}>Outflow Amount</Header>
                                        <Form.Group widths={4} className='headerGap'>
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Used Car Value' text={ciform.used_car_value ? displayAmtInLakh(ciform.used_car_value) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Brokerage' text={ciform.out_brokerage ? displayAmtInLakh(ciform.out_brokerage) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Loyalty Discount' text={ciform.inflow_loyalty_discount ? displayAmtInLakh(ciform.inflow_loyalty_discount) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Exchange Discount' text={ciform.out_exchange_disc ? displayAmtInLakh(ciform.out_exchange_disc) : ''} />
                                        </Form.Group>
                                        <Form.Group widths={4} className='headerGap'>
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Corporate Discount' text={ciform.inflow_corporate_discount ? displayAmtInLakh(ciform.inflow_corporate_discount) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Additional Discount' text={ciform.outflw_adsnl_discount ? displayAmtInLakh(ciform.outflw_adsnl_discount) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Remarks' text={ciform.remarks ? ciform.remarks : ''} />
                                        </Form.Group>
                                    </div>
                                    <div ref={usedCarAddDetails} className='headerGap' >
                                        <Header style={{ color: '#606060', fontSize: '16px' }}>Used Car Additional Details</Header>
                                        <Form.Group widths={2} className='headerGap'>
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Used Car Item' text={ciform.used_car_item ? ciform.used_car_item : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Used Car Batch' text={ciform.used_car_batch ? ciform.used_car_batch : ''} />
                                        </Form.Group>
                                    </div>
                                    <div ref={support} id='support' className='headerGap'>
                                        <Header style={{ color: '#606060', fontSize: '16px' }}>Support Amount</Header>
                                        <Form.Group widths={4} className='headerGap'>
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Exchange' text={ciform.exchange_discount ? displayAmtInLakh(ciform.exchange_discount) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Corporate' text={ciform.corporate_discount ? displayAmtInLakh(ciform.corporate_discount) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Loyalty' text={ciform.loyalty_discount ? displayAmtInLakh(ciform.loyalty_discount) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Warranty' text={ciform.warranty_discount ? displayAmtInLakh(ciform.warranty_discount) : ''} />
                                        </Form.Group>
                                        <Form.Group widths={4} className='headerGapDown paddingTop15'>
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Retail Support' text={ciform.retail_support_discount ? displayAmtInLakh(ciform.retail_support_discount) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='RSA' text={ciform.rsa_discount ? displayAmtInLakh(ciform.rsa_discount) : ''} />
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Insurance' text={ciform.insurance_discount ? displayAmtInLakh(ciform.insurance_discount) : ''} />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div ref={summary} className='paddingTop' id='summary'>
                                    <Header as='h3' className='headerBlue'>Summary Details</Header>
                                    <Form.Group widths={4} className='headerGap'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='INFLOW / ON ROAD' classExtra={"topExtra"} text={summaryInflow ? displayAmtInLakh(summaryInflow) : ''} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Receivable' classExtra={"topExtra"} text={summaryRecivable ? displayAmtInLakh(summaryRecivable) : ''} />
                                    </Form.Group>
                                </div>

                                <div ref={nominee} className='paddingTop'>
                                    <Header as='h3' className='headerBlue'>Nominee Details</Header>
                                    <Form.Group widths={3} className='headerGap'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Nominee Name' text={ciform.nominee_name ? ciform.nominee_name : ''} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Nominee Relationship' text={ciform.nominee_relationship ? ciform.nominee_relationship : ''} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Nominee Age' text={ciform.nominee_age ? ciform.nominee_age : ''} />
                                    </Form.Group>
                                </div>

                                <div ref={finance} className='paddingAcc' >
                                    <Header as='h3' className='headerBlue'>Finance Details</Header>
                                    <Form.Group widths={3} className='headerGap'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='In House / Self / Cash' text={ciform.through_us ? (ciform.through_us === "no" ? "No" : (ciform.through_us === "yes" ? "Yes" : "")) : ''} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Bank Name' text={bankName ? bankName : ''} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Branch Name' text={ciform.finc_branch_name ? ciform.finc_branch_name : ''} />
                                    </Form.Group>
                                    <Form.Group widths={3} className='paddingTop15'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Loan Amount' text={ciform.loan_amount ? displayAmtInLakh(ciform.loan_amount) : ''} />
                                        {throughUs === "INH" || throughUs === "inh" || throughUs === "SEL" || throughUs === "sel" ?
                                            <>
                                                <Field component={FormikDisplayLabelComponent} isLabel={false} label='Finance Consultant' text={finSCName ? finSCName : ''} />
                                                <Field component={FormikDisplayLabelComponent} isLabel={false} label='Type' text={ciform.through_us_type ? ciform.through_us_type : ''} />
                                            </>
                                            :
                                            null}
                                        {throughUs === "CAS" || throughUs === "cas" ?
                                            <Field component={FormikDisplayLabelComponent} isLabel={false} label='Type' text={ciform.through_us_type ? ciform.through_us_type : ''} />
                                            :
                                            null}
                                    </Form.Group>


                                </div>

                                <div ref={accessories} className='paddingAcc'>
                                    <Header as='h3' className='headerBlue'>Accessories Details</Header>
                                    <Form.Group widths={3} className='headerGapDown'>
                                        <FieldArray name='accdetails' component={AccessoriesArrayView} />
                                    </Form.Group>
                                </div>
                                <Button type="submit" size="medium" color="blue" className="CustomeBTN headerGapDown"  >Back To Summary</Button>
                            </Form>
                        </Grid.Column>
                    </Grid>
                )}
            />
            <Modal size='fullscreen' open={displayStatus} onClose={() => setDisplayStatus(false)} >
                <Modal.Header>Create New Customer</Modal.Header>
                <Modal.Content>
                    <CustomerForm setDisplayStatus={setDisplayStatus}
                        preantCallBack={preantCallBack}
                        setErrorAlert={setErrorAlert}
                    />
                </Modal.Content>
            </Modal>
            <Modal
                onClose={() => setErrorAlert({ isOpen: false, type: "", msg: "" })}
                open={errorAlert.isOpen}
                className='zIndexSetNotes'
                size='tiny'
            >
                <Modal.Header>{errorAlert.type}</Modal.Header>
                <Modal.Content>
                    <p>{errorAlert.msg}</p>
                </Modal.Content>
                <Modal.Actions>
                    {errorAlert.type === "Success" ?
                        <Button type="button" positive icon='thumbs up outline' content='Ok' labelPosition='right' onClick={() => { setErrorAlert({ isOpen: false, type: "", msg: "" }) }} />
                        : <Button type="button" negative icon='thumbs down outline' content='Ok' labelPosition='right' onClick={() => { setErrorAlert({ isOpen: false, type: "", msg: "" }) }} />
                    }
                </Modal.Actions>
            </Modal>
        </Container>
    )
}

export default CiFormView;