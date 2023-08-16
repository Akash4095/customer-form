import React, { useEffect, useRef, useState } from 'react'
import { Formik, Field, Form as FormikForm } from 'formik';
import { Label, Container, Segment, Grid, Image, Button, Form, Modal, Icon, Header } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { getCiFormByOnlyId, selectSegment, getSyncObj } from '../data/selectors'
import { callPriceListView } from '../data/model'
import { FormikDateComponent } from '../../../utilities/formUtils'
import { getSegmap, searchVin, fetchCiForm } from '../data/actions'
import userACL from '../../../store/access'
import { filter, matches, merge, toLower } from 'lodash'
import { searchCustomer } from '../../customer/data/actions'
import { selectCustomerName } from '../../customer/data/selectors'
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import CiFormPrint from '../pdfPrint/ciFormPrint';



const CiFormPrintOnSave = (props) => {
    const data = merge({}, userACL.atFetch())
    const saleTypeObj = useSelector(state => state.saletype.byListId)
    const ciform = useSelector(state => getCiFormByOnlyId(state, props.ciFormDataId, saleTypeObj))
    const segmapObj = useSelector(state => selectSegment(state, props))
    const custObj = useSelector(state => selectCustomerName(state, props))
    const formTypeObj = useSelector(state => state.formtype.byListId)
    const bankObj = useSelector(state => state.financebank.byId)
    const finScObj = useSelector(state => state.financeConsultant.byId)
    const syncObj = useSelector(state => getSyncObj(state, props))
    const leadSourceObj = useSelector(state => state.leadsource.byId)
    const scNameObj = useSelector(state => state.salesConsultant.byId)
    const salesManagerObj = useSelector(state => state.salesmanager.byId)

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
                    if (props.ciFormDataId !== "") {
                        setTimeout(function () {
                            document.getElementById('clickPrint').click()
                            if (props.pageType === "edit") {
                                setTimeout(function () {
                                    props.history.push(`/ciform/summary/` + props.ciFormDataId)
                                    props.setCiFormDataId('')
                                }, 500)
                            }
                            if (props.pageType === "entry") {
                                setTimeout(function () {
                                    props.setCiFormDataId('')
                                }, 500)
                            }
                        }, 1000)
                    }
                }
            }
        }
    }, [custObjSave])

    useEffect(() => {
        if (props.ciFormDataId !== "") {
            let listObj = ciform
            setSummaryOutflow(parseFloat(listObj.out_exchange_disc) + parseFloat(listObj.out_brokerage) + parseFloat(listObj.out_foc_acc))

            let hmilSpt = (parseFloat(listObj.exchange_discount) + parseFloat(listObj.corporate_discount) + parseFloat(listObj.loyalty_discount) + parseFloat(listObj.warranty_discount) +
                parseFloat(listObj.retail_support_discount) + parseFloat(listObj.rsa_discount) + parseFloat(listObj.insurance_discount))

            setSummaryHmilSpt(hmilSpt)
            let outflowSum = parseFloat(listObj.out_exchange_disc ? listObj.out_exchange_disc : 0) + parseFloat(listObj.inflow_loyalty_discount ? listObj.inflow_loyalty_discount : 0) + parseFloat(listObj.out_brokerage ? listObj.out_brokerage : 0) + parseFloat(listObj.used_car_value ? listObj.used_car_value : 0) + parseFloat(listObj.outflw_adsnl_discount ? listObj.outflw_adsnl_discount : 0)
            // let outflowSum = (parseFloat(listObj.out_exchange_disc) + parseFloat(listObj.out_brokerage) + parseFloat(listObj.out_foc_acc))

            if (listObj.on_road) {
                setSummaryRecivable(parseFloat(listObj.on_road) - parseFloat(outflowSum ? outflowSum : 0))
            } else {
                setSummaryRecivable((0))
            }
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
            const data = merge({}, userACL.atFetch())
            let values = {
                "srchlName": listObj.customer_name
            }
            setCustObjSave({ name: listObj.customer_name, id: listObj.customer_id })
            values.segid = data.cid
            values.cid = data.cid
            dispatch(searchCustomer(values))
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




    useEffect(() => {
        if (ciform) {
            if (props.priceListAmt && props.priceListAmt !== undefined && props.priceListAmt !== null) {
                // let cessRate = ciform.CESS_rate ? ciform.CESS_rate : 0,
                //     igstRate = ciform.IGST_rate ? ciform.IGST_rate : 0,
                //     cessAmt = (parseFloat(props.priceListAmt) * parseFloat(cessRate)) / 100,
                //     igstAmt = (parseFloat(props.priceListAmt) * parseFloat(igstRate)) / 100,
                //     actualShowRoomAmt = parseFloat(props.priceListAmt) + parseFloat(cessAmt) + parseFloat(igstAmt)
                let actualShowRoomAmt = parseFloat(props.priceListAmt)
                setActualShowRoom(actualShowRoomAmt)
            }
        }
    }, [props.priceListAmt, ciform])

    const componentRef = useRef();

    return (
        <>
            <ReactToPrint
                // trigger={() => <a href="#">Print this out!</a>}
                trigger={() => <Button id="clickPrint" color='blue' style={{ display: 'none' }}>Print</Button>}
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
                    leadSource={(leadSourceObj && leadSourceObj !== undefined && leadSourceObj !== null) ? ciform.lead_source_id ? leadSourceObj[ciform.lead_source_id].emp_name : '-' : ''}
                    scNameObj={scNameObj}
                    scName={(scNameObj && scNameObj !== undefined && scNameObj !== null) ? ciform.sales_consultant_id ? scNameObj[ciform.sales_consultant_id].emp_name : '-' : ''}
                    salesManagerObj={salesManagerObj}
                    salesManager={salesManager}
                    customer_name={customer_name}
                    customer_cd={customer_cd}
                    cust_registration_address={cust_registration_address}
                    cust_permanent_address={cust_permanent_address}
                    cust_mobele_no={cust_mobele_no}
                    cust_email_id={cust_email_id}
                    cust_gst_no={cust_gst_no}
                    cust_pan_no={cust_pan_no}
                    summaryInflow={summaryInflow}
                    summaryoutflow={summaryoutflow}
                    summaryInvoice={summaryInvoice}
                    summaryOtherSpt={summaryOtherSpt}
                    summaryExBasic={summaryExBasic}
                    summaryHmilSpt={summaryHmilSpt}
                    summaryRecivable={summaryRecivable}
                    finSCName={(finScObj && finScObj !== undefined && finScObj !== null) ? ciform.fin_sc_id ? finScObj[ciform.fin_sc_id].emp_name : '-' : '-'}
                    bankName={(bankObj && bankObj !== undefined && bankObj !== null) ? ciform.finc_bank_id ? bankObj[ciform.finc_bank_id].finbank_name : '-' : '-'}
                    actualShowRoom={actualShowRoom}
                />
            </div>
        </>
    )
}

export default CiFormPrintOnSave;