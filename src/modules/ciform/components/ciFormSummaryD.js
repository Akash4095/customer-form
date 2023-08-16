import React, { useEffect, useRef, useState } from 'react'
import { Formik, Field, Form as FormikForm } from 'formik';
import { Label, Container, Segment, Grid, Image, Button, Form, Modal, Icon, Header } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { getCiForm, selectSegment, getSyncObj, getSearchVinResults } from '../data/selectors'
import { syncSchema, callCarSaleSync, callJVSaleSync, callCarSaleUnSync, callUsedCarValueSync, callPriceListView } from '../data/model'
import { FormikDateComponent } from '../../../utilities/formUtils'
import { getSegmap, searchVin, fetchCiForm } from '../data/actions'
import userACL from '../../../store/access'
import { filter, matches, merge, toLower } from 'lodash'
import { displayAmtInLakh, displayDate } from '../../../utilities/listUtils'
import { searchCustomer } from '../../customer/data/actions'
import { selectCustomerName } from '../../customer/data/selectors'
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import CiFormPrint from '../pdfPrint/ciFormPrint';



const CiFormSummaryD = (props) => {
    const data = merge({}, userACL.atFetch())
    const vinObj = useSelector(state => getSearchVinResults(state, props))
    const ciform = useSelector(state => getCiForm(state, props))
    const segmapObj = useSelector(state => selectSegment(state, props))
    const custObj = useSelector(state => selectCustomerName(state, props))
    const formTypeObj = useSelector(state => state.formtype.byListId)
    const bankObj = useSelector(state => state.financebank.byId)
    const finScObj = useSelector(state => state.financeConsultant.byId)
    const syncObj = useSelector(state => getSyncObj(state, props))
    const saleTypeObj = useSelector(state => state.saletype.byListId)
    const leadSourceObj = useSelector(state => state.leadsource.byId)
    const scNameObj = useSelector(state => state.salesConsultant.byId)
    const salesManagerObj = useSelector(state => state.salesmanager.byId)
    const ciformFetchedDate = useSelector(state => state.ciform.saveFetchedCiFormDate)

    const [summaryInflow, setSummaryInflow] = useState(ciform ? ciform.on_road : 0)
    const [summaryoutflow, setSummaryOutflow] = useState(0)
    const [summaryInvoice, setSummaryInvoice] = useState(ciform ? (parseFloat(ciform.ex_showroom) + parseFloat(ciform.tcs)) : 0)
    const [summaryOtherSpt, setSummaryOtherSpt] = useState(0)
    const [summaryExBasic, setSummaryExBasic] = useState(ciform ? ciform.purchase_basic : 0)
    const [summaryHmilSpt, setSummaryHmilSpt] = useState(0)
    const [summaryRecivable, setSummaryRecivable] = useState(0)
    const [showSegName, setShowSegName] = useState('')
    const [custObjSave, setCustObjSave] = useState(null)
    const [rlbPostedList, setRlbPostedList] = useState(null)
    const [isModalOpenGet, setIsModalOpenGet] = useState({ status: false, id: '', type: '' })
    const [modalNotification, setModalNotification] = useState({ type: false, msg: '', status: '' })
    const [modalCofirmation, setModalCofirmation] = useState({ status: false, id: '', type: '' })
    const [ciFetch, setCiFetch] = useState(false)
    const [saleType, setSaleType] = useState('')
    const [scName, setScName] = useState('')
    const [salesManager, setSalesManager] = useState('')
    const [cust_registration_address, setCust_registration_address] = useState('')
    const [cust_permanent_address, setCust_permanent_address] = useState("")

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

    const [postedVoucher, setPostedVoucher] = useState(0)
    const [customer_name, setCustomer_name] = useState(0)
    const [customer_cd, setcustomer_cd] = useState('')
    const [cust_pan_no, setCust_pan_no] = useState('')
    const [cust_gst_no, setCust_gst_no] = useState('')
    const [cust_email_id, setCust_email_id] = useState('')
    const [cust_mobele_no, setCust_mobele_no] = useState('')

    const [state, setState] = useState('')

    const [formType, setFormType] = useState('')
    const [bankName, setBankName] = useState('')
    const [leadSource, setLeadSource] = useState('')
    const [finSCName, setFinSCName] = useState('')

    const [priceListAmt, setPriceListAmt] = useState(0)
    const [actualShowRoom, setActualShowRoom] = useState(0)


    useEffect(() => {
        if (saleTypeObj && saleTypeObj !== undefined && saleTypeObj !== null) {
            let fType = saleTypeObj[ciform.sale_type_id]
            if (fType) {
                setSaleType(fType.saletype_name)
            }
        }
    }, [saleTypeObj])


    useEffect(() => {
        if (ciform) {
            if (saleTypeObj) {
                if (vinObj) {
                    if (vinObj[0]) {
                        if (vinObj[0].itemName && vinObj[0].itemName !== undefined && vinObj[0].itemName !== null && vinObj[0].itemName !== "") {
                            let plNameGet = ciform.sale_type_id ? (saleTypeObj[ciform.sale_type_id] ? (saleTypeObj[ciform.sale_type_id].price_list ? saleTypeObj[ciform.sale_type_id].price_list : '') : '') : ''
                            callPriceListView(vinObj[0].itemName, ciform.booking_date, plNameGet, setPriceListAmt)
                        }
                    }
                }
            }
        }
    }, [vinObj, ciform, saleTypeObj])


    useEffect(() => {
        if (ciform) {
            if (priceListAmt && priceListAmt !== undefined && priceListAmt !== null) {
                let cessRate = ciform.CESS_rate ? ciform.CESS_rate : 0,
                    igstRate = ciform.IGST_rate ? ciform.IGST_rate : 0,
                    cessAmt = (parseFloat(priceListAmt) * parseFloat(cessRate)) / 100,
                    igstAmt = (parseFloat(priceListAmt) * parseFloat(igstRate)) / 100,
                    actualShowRoomAmt = parseFloat(priceListAmt) + parseFloat(cessAmt) + parseFloat(igstAmt)
                setActualShowRoom(actualShowRoomAmt)

            }
        }
    }, [priceListAmt, ciform])

    useEffect(() => {
        if (formTypeObj && formTypeObj !== undefined && formTypeObj !== null) {
            let fType = formTypeObj[ciform.form_type_id]
            if (fType) {
                setFormType(fType.stype_name)
            }
        }
    }, [formTypeObj])

    useEffect(() => {
        if (leadSourceObj && leadSourceObj !== undefined && leadSourceObj !== null) {
            let fType = leadSourceObj[ciform.lead_source_id]
            if (fType) {
                setLeadSource(fType.emp_name)
            }
        }
    }, [leadSourceObj])

    useEffect(() => {
        if (scNameObj && scNameObj !== undefined && scNameObj !== null) {
            let fType = scNameObj[ciform.sales_consultant_id]
            if (fType) {
                setScName(fType.emp_name)
            }
        }
    }, [scNameObj])


    useEffect(() => {
        if (salesManagerObj && salesManagerObj !== undefined && salesManagerObj !== null) {
            let fType = salesManagerObj[ciform.sales_manager_id]
            if (fType) {
                setSalesManager(fType.emp_name)
            }
        }
    }, [salesManagerObj])


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
                    let res_address = `${((res.address && res.address !== "None" && res.address !== undefined) ? res.address + ", " : "")}${((res.pin && res.pin !== "None" && res.pin !== undefined) ? "Pin Code - " + res.pin + ", " : "")}${((res.city && res.city !== "None" && res.city !== undefined) ? res.city + ", " : "")}${((res.st && res.st !== "None" && res.st !== undefined) ? res.st + ", " : "")}${(res.country_name && res.country_name !== "None" && res.country_name !== undefined) ? res.country_name : ""}`
                    let alt_address = ledObj[0].alt_party_address ? ledObj[0].alt_party_address : []
                    if (alt_address.length > 0) {
                        let pa = alt_address ? alt_address[0] : ""
                        let pa_address = `${((pa.address && pa.address !== "None" && pa.address !== undefined) ? pa.address + ", " : "")}${((pa.pin && pa.pin !== "None" && pa.pin !== undefined) ? "Pin Code - " + pa.pin + ", " : "")}${((pa.city && pa.city !== "None" && pa.city !== undefined) ? pa.city + ", " : "")}${((pa.st && pa.st !== "None" && pa.st !== undefined) ? pa.st + ", " : "")}${(pa.country_name && pa.country_name !== "None" && pa.country_name !== undefined) ? pa.country_name : ""}`
                        setCust_permanent_address(pa_address ? pa_address : "")
                    } else {
                        setCust_permanent_address("")
                    }
                    setCustomer_name(ledObj[0].ledger_name)
                    setcustomer_cd(ledObj[0].ledger_code)
                    setCust_pan_no(res.pan_no)
                    setCust_gst_no(res.gstin_no)
                    setState(res.st)
                    setCust_registration_address(res_address)
                    setCust_email_id(res.email)
                    setCust_mobele_no(res.phone)
                }
            }
        }
    }, [custObj])
  
    useEffect(() => {
        if (props.match.path === '/ciform/summary/:id') {
            let id = props.match.params.id
            let listObj = ciform
            const data = merge({}, userACL.atFetch())
            let values = {
                "srchlName": listObj.customer_name
            }
            setCustObjSave({ name: listObj.customer_name, id: listObj.customer_id })
            values.segid = data.cid
            values.cid = data.cid
            // dispatch(searchCustomer(values))
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
            setSummaryOutflow((parseFloat(listObj.out_exchange_disc ? listObj.out_exchange_disc : 0) + parseFloat(listObj.inflow_corporate_discount ? listObj.inflow_corporate_discount : 0) + parseFloat(listObj.inflow_loyalty_discount ? listObj.inflow_loyalty_discount : 0) + parseFloat(listObj.outflw_adsnl_discount ? listObj.outflw_adsnl_discount : 0)))

            let hmilSpt = (parseFloat(listObj.exchange_discount) + parseFloat(listObj.corporate_discount) + parseFloat(listObj.warranty_discount) +
                parseFloat(listObj.retail_support_discount) + parseFloat(listObj.rsa_discount) + parseFloat(listObj.insurance_discount))

            setSummaryHmilSpt(hmilSpt)
            let outflowSum = parseFloat(listObj.out_exchange_disc ? listObj.out_exchange_disc : 0) + parseFloat(listObj.inflow_corporate_discount ? listObj.inflow_corporate_discount : 0) + parseFloat(listObj.inflow_loyalty_discount ? listObj.inflow_loyalty_discount : 0) + parseFloat(listObj.used_car_value ? listObj.used_car_value : 0) + parseFloat(listObj.outflw_adsnl_discount ? listObj.outflw_adsnl_discount : 0)

            if (listObj.on_road) {
                setSummaryRecivable(parseFloat(listObj.on_road) - parseFloat(outflowSum ? outflowSum : 0))
            } else {
                setSummaryRecivable(0)
            }
        }
    }, [])

    useEffect(() => {
        if (ciFetch === false) {
            let rlbSyncArray = ciform ? ciform.rlbsyncf : []
            let filteredObj = []
            if (rlbSyncArray && rlbSyncArray !== undefined && rlbSyncArray.length > 0) {
                filteredObj = rlbSyncArray.filter((obj) => {
                    return (toLower(obj.txnStatus) === toLower("posted"))
                })
            }
            setPostedVoucher(filteredObj.length)
            setRlbPostedList(rlbSyncArray)
            setCiFetch(true)
        }
    }, [ciform])

    const editCIForm = (id) => {
        props.history.push(`/ciform/edit/` + id)
    }

    const viewCIForm = (id) => {
        props.history.push(`/ciform/view/` + id)
    }

    const listCIForm = () => {
        props.history.push(`/ciform/list`)
    }

    const getStatus = (txn) => {
        let status = "n/a"
        if (rlbPostedList && rlbPostedList !== undefined && rlbPostedList !== null && rlbPostedList.length > 0) {
            let getObj = rlbPostedList.filter((obj) => {
                return (toLower(obj.txnType) === toLower(txn))
            })
            if (getObj.length > 0) {
                status = getObj[0].txnStatus ? getObj[0].txnStatus : "n/a"
            }
        }
        return status
    }

    const getRlbVid = (txn) => {
        let rlbVid = 0
        if (rlbPostedList && rlbPostedList !== undefined && rlbPostedList !== null && rlbPostedList.length > 0) {
            let getObj = rlbPostedList.filter((obj) => {
                return (toLower(obj.txnType) === toLower(txn))
            })
            if (getObj.length > 0) {
                rlbVid = getObj[0].rlb_vid ? getObj[0].rlb_vid : 0
            }
        }
        return rlbVid
    }

    const callToPostingRLB = (type, id) => {
        setIsModalOpenGet({ status: true, id: id, type: type })
    }

    const callToDeleteRLB = (type, id) => {
        setModalCofirmation({ status: true, id: id, type: type })
    }

    const postDataToRlb = (values, type, id) => {
        if (type !== "" && type !== "") {
            const data = userACL.atFetch()
            if (toLower(type) === "car_sale") {
                let carSaleObj = {
                    id: id,
                    txnDate: moment(values.txnDate).format("YYYY-MM-DD"),
                    uid: data.uid
                }
                setIsModalOpenGet({ status: false, id: '', type: '' })
                callCarSaleSync(carSaleObj, setModalNotification, dispatch, fetchCiForm, props.history, id, setCiFetch, ciformFetchedDate)
            }
            else if (toLower(type) === "used_car_value") {
                let usedCarValueObj = {
                    id: id,
                    txnDate: moment(values.txnDate).format("YYYY-MM-DD"),
                    uid: data.uid
                }
                setIsModalOpenGet({ status: false, id: '', type: '' })
                callUsedCarValueSync(usedCarValueObj, setModalNotification, dispatch, fetchCiForm, props.history, id, setCiFetch, ciformFetchedDate)
            }
            else {
                let jvSaleObj = {
                    id: id,
                    txnDate: moment(values.txnDate).format("YYYY-MM-DD"),
                    uid: data.uid,
                    txnType: type
                }
                setIsModalOpenGet({ status: false, id: '', type: '' })
                callJVSaleSync(jvSaleObj, setModalNotification, dispatch, fetchCiForm, props.history, id, setCiFetch, ciformFetchedDate)
            }
        }
    }

    const deletePostedDataToRlb = (type, id) => {
        const data = userACL.atFetch()
        let rlb_vid = getRlbVid(type)
        let saleUnSyncObj = {
            vid: rlb_vid,
            cid: data.cid,
            uid: data.uid
        }
        setModalCofirmation({ status: false, id: '', type: '' })
        callCarSaleUnSync(saleUnSyncObj, setModalNotification, dispatch, fetchCiForm, props.history, id, setCiFetch, ciformFetchedDate)
    }


    const componentRef = useRef();

    return (
        <Container className="backGroundChange">
            <center>
                <Grid>
                    <Grid.Column width={10} className="removePadding backGroundChangeDiv getPadding">
                        <Grid columns={1}>
                            <Grid.Row className="gridRowSummary">
                                <Grid.Column>
                                    <Header as='h4' className='headerBlue alignLeftCell'>C.I Form No.</Header>
                                    <div className='alignLeftCell fontHead'>
                                        {ciform.form_no ? ciform.form_no : "N/A"}
                                    </div>
                                    <div className='alignLeftCell fontSub' style={{ paddingTop: "5px" }}>
                                        {ciform.ex_delivery_date ? 'Expected Delivery Date: ' + displayDate(ciform.ex_delivery_date) : "Expected Delivery Date: N/A"}
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className="gridRowSummary">
                                <Grid.Column>
                                    <Header as='h4' className='headerBlue alignLeftCell'>Customer Name</Header>
                                    <div className='alignLeftCell fontHead'>

                                        {ciform.customer_name ? ciform.customer_name : "-"}

                                    </div>
                                    <div className='alignLeftCell fontSub' style={{ paddingTop: "5px" }}>
                                        {ciform.cust_gst_no ? 'GST No: ' + ciform.cust_gst_no : ciform.cust_pan_no ? 'PAN No: ' + ciform.cust_pan_no : 'GST No: N/A'}
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className="gridRowSummary">
                                <Grid.Column>
                                    <Header as='h4' className='headerBlue alignLeftCell'>Model No.</Header>
                                    <div className='alignLeftCell fontHead'>
                                        {ciform ? ciform.model_no !== "" ? ciform.model_no : "Loading..." : "N/A"}
                                    </div>
                                    <div className='alignLeftCell fontSub' style={{ paddingTop: "5px" }}>
                                        {ciform.vin_on ? 'VIN No: ' + ciform.vin_on : 'VIN No: N/A'}
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className="gridRowSummary">
                                <Grid.Column>
                                    <Header as='h4' className='headerBlue alignLeftCell'>Bank Name</Header>
                                    <div className='alignLeftCell fontHead'>
                                        {bankObj[ciform.finc_bank_id] ? bankName !== "" ? bankName : "Loading..." : "N/A"}
                                    </div>
                                    <div className='alignLeftCell fontSub' style={{ paddingTop: "5px" }}>
                                        {ciform.finc_branch_name ? 'Branch Name: ' + ciform.finc_branch_name : 'Branch Name: N/A'}
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className="gridRowSummary">
                                <Grid.Column className="alignLeftCell">
                                    {parseInt(postedVoucher, 10) === 0 ?
                                        <Button className='floatRightA' onClick={() => editCIForm(ciform.id)}>
                                            Edit
                                        </Button>
                                        :
                                        <Button className='floatRightA' onClick={() => viewCIForm(ciform.id)}>
                                            View
                                        </Button>
                                    }
                                    &nbsp;&nbsp;
                                    <>
                                        <ReactToPrint
                                            // trigger={() => <a href="#">Print this out!</a>}
                                            trigger={() => <Button color='blue'>Print</Button>}
                                            content={() => componentRef.current}
                                            documentTitle={ciform.form_no + "_" + customer_name}
                                        />
                                        <div style={{ display: 'none' }}>
                                            <CiFormPrint
                                                ref={componentRef}
                                                ciform={ciform}
                                                saleTypeObj={saleTypeObj}
                                                saleType={saleType}
                                                segmapObj={segmapObj}
                                                showSegName={showSegName}
                                                leadSourceObj={leadSourceObj}
                                                leadSource={leadSource}
                                                scNameObj={scNameObj}
                                                scName={scName}
                                                salesManagerObj={salesManagerObj}
                                                salesManager={salesManager}
                                                customer_name={ciform ? ciform.customer_name : ""}
                                                customer_cd={ciform ? ciform.customer_cd : ""}
                                                cust_registration_address={ciform ? ciform.cust_registration_address : ""}
                                                cust_permanent_address={ciform ? ciform.cust_permanent_address : ""}
                                                cust_mobele_no={ciform ? ciform.cust_mobele_no : ""}
                                                cust_email_id={ciform ? ciform.cust_email_id : ""}
                                                cust_gst_no={ciform ? ciform.cust_gst_no : ""}
                                                cust_pan_no={ciform ? ciform.cust_pan_no : ""}
                                                summaryInflow={summaryInflow}
                                                summaryoutflow={summaryoutflow}
                                                summaryInvoice={summaryInvoice}
                                                summaryOtherSpt={summaryOtherSpt}
                                                summaryExBasic={summaryExBasic}
                                                summaryHmilSpt={summaryHmilSpt}
                                                summaryRecivable={summaryRecivable}
                                                finSCName={finSCName}
                                                bankName={bankName}
                                                actualShowRoom={actualShowRoom}
                                            />
                                        </div>
                                    </>
                                    &nbsp;&nbsp;
                                    <Button className='floatRightA' onClick={() => listCIForm()}>
                                        Back
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width={6} className="removePadding backGroundChangeDiv">
                        <Grid.Row className="gridRowSummary">
                            <Grid.Column>
                                <div className='tableDiv'>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth' style={{ borderBottom: "1px solid black" }}>
                                            <Header as='h4' className='headerBlu'>Sl</Header>
                                        </div>
                                        <div className='tdDiv nameWidth' style={{ borderBottom: "1px solid black" }}>
                                            <Header as='h4' className='headerBlu alignLeftCell'>Transactions</Header>
                                        </div>

                                        <div className='tdDiv amountWidth' style={{ borderBottom: "1px solid black" }}>
                                            <Header as='h4' className='headerBlu'>Amount</Header>
                                        </div>

                                        <div className='tdDiv postWidth' style={{ borderBottom: "1px solid black" }}>
                                            <Header as='h4' className='headerBlu'>Status</Header>
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                1.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                EX ShowRoom W/O GST
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.ex_showroom_without_gst ? displayAmtInLakh(ciform.ex_showroom_without_gst) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('ex_showroom_without_gst') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('car_sale', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                2.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                AMC Plan
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.sot ? displayAmtInLakh(ciform.sot) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('sot') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('sot', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('sot') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('sot', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                3.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                Insurance
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.insurance ? displayAmtInLakh(ciform.insurance) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('Insurance') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('insurance', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('Insurance') === "posted" ?
                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('Insurance', ciform ? ciform.id : '')}>Delete</span>
                                                    </>

                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                4.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                M-TAX
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.m_tax ? displayAmtInLakh(ciform.m_tax) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('m_tax') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('m_tax', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('m_tax') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('m_tax', ciform ? ciform.id : '')}>Delete</span>
                                                    </>

                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                5.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                Passing Charges
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.passing_charges ? displayAmtInLakh(ciform.passing_charges) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('passing_charges') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('passing_charges', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('passing_charges') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('passing_charges', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                6.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                Hypothecation Charges
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.hypothecation_charges ? displayAmtInLakh(ciform.hypothecation_charges) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('hypothecation_charges') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('hypothecation_charges', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('hypothecation_charges') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('hypothecation_charges', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                7.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                Ex-Warranty
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.ex_warranty ? displayAmtInLakh(ciform.ex_warranty) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('ex_warranty') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('ex_warranty', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('ex_warranty') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('ex_warranty', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                8.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                Others 1
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.others_1 ? displayAmtInLakh(ciform.others_1) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('others_1') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('others_1', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('others_1') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('others_1', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                9.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                Others 2
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.others_2 ? displayAmtInLakh(ciform.others_2) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('others_2') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('others_2', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('others_2') === "posted" ?
                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('others_2', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                10.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                Others 3
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.others_3 ? displayAmtInLakh(ciform.others_3) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('others_3') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('others_3', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('others_3') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('others_3', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                11.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                Others 4
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.others_4 ? displayAmtInLakh(ciform.others_4) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('others_4') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('others_4', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('others_4') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('others_4', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                12.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                RTO
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.rto ? displayAmtInLakh(ciform.rto) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('rto') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('rto', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('rto') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('rto', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                13.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                HSRP
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.hsrp ? displayAmtInLakh(ciform.hsrp) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('hsrp') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('hsrp', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('hsrp') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('hsrp', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                14.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                Fastag
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.fastag ? displayAmtInLakh(ciform.fastag) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('fastag') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('fastag', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('fastag') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('fastag', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                15.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                Discount
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {summaryoutflow ? displayAmtInLakh(summaryoutflow) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('disc') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('disc', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('disc') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('disc', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                16.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                RSA
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.rsa_discount ? displayAmtInLakh(ciform.rsa_discount) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('rsa') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('rsa', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('rsa') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('rsa', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className='trDiv'>
                                        <div className='tdDiv slWidth'>
                                            <label className='alignLeftCell topFontLabel'>
                                                17.
                                            </label>
                                        </div>
                                        <div className='tdDiv nameWidth'>
                                            <label className='alignLeftCell headLabel  topFontLabel'>
                                                Used Car Value
                                            </label>
                                        </div>
                                        <div className='tdDiv amountWidth'>
                                            <label className="headAmtLabel topFontLabel">
                                                {ciform.used_car_value ? displayAmtInLakh(ciform.used_car_value) : 'N/A'}
                                            </label>
                                        </div>
                                        <div className='tdDiv postWidth'>
                                            {getStatus('used_car_value') === "pending" ?
                                                <Button className='floatRightB' onClick={() => callToPostingRLB('used_car_value', ciform ? ciform.id : '')}>
                                                    Post
                                                </Button>
                                                : getStatus('used_car_value') === "posted" ?

                                                    <>
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon name='check circle' color='green' size='large' /><span>&nbsp;</span>
                                                        <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => callToDeleteRLB('used_car_value', ciform ? ciform.id : '')}>Delete</span>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </center>
            <Modal open={isModalOpenGet.status} size="mini" onClose={() => setIsModalOpenGet({ status: false, id: '', type: '' })}>
                <Modal.Header>{'Post Data'} <Icon name='cancel' color='red' className='closeIcon' onClick={() => setIsModalOpenGet({ status: false, id: '', type: '' })} /></Modal.Header>
                <Modal.Content>
                    <Formik id={'sync' + isModalOpenGet.id} size="large" width={8}
                        initialValues={syncObj}
                        validationSchema={syncSchema}
                        render={({ values, handleSubmit, onChange, handleChange, errors }) => (
                            <Form as={FormikForm} size="small" className="popupCustomeForm" width={3}>
                                <Form.Group className=''>
                                    <Field name='txnDate' placeholder={'Date'} label='' component={FormikDateComponent} isLabel='false' isTxn='true' />
                                </Form.Group>
                                <br /><br />
                                <Button type="button" positive icon='thumbs up outline' content='Post' labelPosition='right' onClick={() => postDataToRlb(values, isModalOpenGet.type, isModalOpenGet.id)} />
                            </Form>
                        )}
                    />
                </Modal.Content>
            </Modal>
            <Modal open={modalNotification.type} size="tiny" onClose={() => setModalNotification({ type: false, msg: '', field: '', status: '' })}>
                <Modal.Header>{modalNotification.status}</Modal.Header>
                <Modal.Content>
                    <p>{modalNotification.msg}</p>
                </Modal.Content>
                <Modal.Actions>
                    {modalNotification.status === 'Error' ?
                        <Button type="button" negative icon='thumbs down outline' content='Okay' labelPosition='right' onClick={() => setModalNotification({ type: false, msg: '', field: '', status: '' })} />
                        :
                        <Button type="button" positive icon='thumbs up outline' content='Okay' labelPosition='right' onClick={() => setModalNotification({ type: false, msg: '', field: '', status: '' })} />
                    }
                </Modal.Actions>
            </Modal>
            <Modal open={modalCofirmation.status} size="tiny" onClose={() => setModalCofirmation({ status: false, id: '', type: '' })}>
                <Modal.Header>{'Delete Confirmation'}</Modal.Header>
                <Modal.Content>
                    <p>Do you want to delete this posted data?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type="button" negative icon='thumbs down outline' content='No' labelPosition='right' onClick={() => setModalCofirmation({ status: false, id: '', type: '' })} />
                    <Button type="button" positive icon='thumbs up outline' content='Yes' labelPosition='right' onClick={() => deletePostedDataToRlb(modalCofirmation.type, modalCofirmation.id)} />
                </Modal.Actions>
            </Modal>
        </Container>
    )
}

export default CiFormSummaryD;