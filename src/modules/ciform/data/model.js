import React from 'react';
import * as Yup from 'yup';
import moment from 'moment'
import { v4 } from 'uuid';
import { debounce, merge } from 'lodash';
import axios from 'axios';
import { VEHICAL_URL } from '../../../store/path';
import { useDispatch } from 'react-redux';
import { storeSegmap } from './actions';
import userACL from '../../../store/access';
import { displayDate } from '../../../utilities/listUtils';


export const ciForm = () => ({
    id: v4(),
    form_no: "",
    segid: "",
    cid: "",
    sale_type_id: "",
    form_type_id: "",
    booking_date: null,
    ci_form_date: moment().format('YYYY-MM-DD'),
    ex_delivery_date: null,
    lead_source_person: "",
    lead_source_id: "",
    lead_source_pan: "",
    sales_consultant_id: "",
    sales_manager_id: "",
    customer_id: "",
    customer_cd: "",
    customer_name: "",
    customer_dob: null,
    cust_email_id: "",
    cust_mobele_no: "",
    cust_pan_no: "",
    cust_gst_no: "",
    city: "",
    pin: "",
    state: "",
    contact_person: "",
    gst_reg_type: "",
    country: "",
    cust_registration_address: "",
    cust_permanent_address: "",

    model_no: "",
    variant: "",
    colour: "",
    vin_on: "",
    engine_no: "",
    fuel_type: "",
    itemName: "",
    itemGroupName: "",
    item_id: "",
    itemGroup_id: "",
    invoice_amt: null,
    ex_showroom: null,
    tcs: null,
    sot: null,
    purchase_basic: null,
    ex_showroom_without_gst: null,
    ex_shrm_wo_gst_n_disc: null,
    CGST_rate: null,
    SGST_rate: null,
    IGST_rate: null,
    CESS_rate: null,
    CGST_amount: null,
    SGST_amount: null,
    IGST_amount: null,
    CESS_amount: null,
    CGST_ledger: "",
    SGST_ledger: "",
    IGST_ledger: "",
    CESS_ledger: "",
    insurance: null,
    used_car_value: null,
    hsrp: null,
    others_1: null,
    others_2: null,
    others_3: null,
    others_4: null,
    rto: null,
    passing_charges: null,
    hypothecation_charges: null,
    ex_warranty: null,
    m_tax: null,
    rsa: null,
    basic_kit: null,
    price_diff: null,
    paid_acc: null,
    fastag: null,
    on_road: null,
    out_cash_disc: null,
    out_exchange_disc: null,
    out_brokerage: null,
    out_foc_acc: null,
    exchange_discount: null,
    corporate_discount: null,
    loyalty_discount: null,
    warranty_discount: null,
    rsa_discount: null,
    insurance_discount: null,
    retail_support_discount: null,
    inflow_corporate_discount: null,
    inflow_loyalty_discount: null,
    inflow_other_discount: null,
    inflow_insurance_discount: null,
    used_car_item: "",
    used_car_batch: "",
    nominee_age: null,
    nominee_name: "",
    through_us: "",
    fin_sc_id: "",
    through_us_type: null,
    finc_bank_id: "",
    finc_branch_name: "",
    loan_amount: null,
    dt_create: moment().format("YYYY-MM-DD"),
    dt_update: moment().format("YYYY-MM-DD"),
    uid_create: "",
    uid_update: "",
    status: 1,
    accdetails: [],
    exclude_cash_disc: '',
    exclude_inflow_corporate_disc: "",
    exclude_inflow_loyalty_disc: "",
    exclude_inflow_other_disc: "",
    exclude_inflow_insurance_disc: "",
    exclude_exchange_disc: "",
    exclude_foc_acc_disc: "",
    nominee_relationship: '',
    nominee_dob: null,
    isIntra: true,
    typeOfSale: '',
    summaryInflow: '0',
    summaryoutflow: '0',
    summaryInvoice: '0',
    summaryExBasic: '0',
    summaryOtherSpt: '0',
    summaryHmilSpt: '0',
    summaryRecivable: '0',
    sales_manager_name: "",
    team_leader_name: "",
    outflw_adsnl_discount: null,
    outflw_insb4_discount: null,
    isMtaxChecked: true,
    remarks: '',
    location: "",
    vhcl_dtls_src_by: "ch",
})

export const ciFormAccessories = () => ({
    id: v4(),
    txn_id: "",
    sr_no: null,
    accessories: "",
    amount: 0,
    paid_inflow: 0,
    foc_outflow: 1,
    segid: "",
    cid: "",
    status: 1,
    dt_create: moment().format("YYYY-MM-DD"),
    dt_update: moment().format("YYYY-MM-DD"),
    uid_create: "",
    uid_update: "",

})

export const items = () => ({
    cid: "",
    itemCode: "",
    itemName: "",
    itemGrpName: "",
    baseUnitName: "",
    hsnCode: "",
    isBatchEnable: "",
})

export const ciformSchema = Yup.object().shape({
    id: Yup.string().required('This (Required Field)'),
    booking_date: Yup.string()
        .required('Booking Date (Required)').nullable(),
    ex_delivery_date: Yup.string()
        .required('Expected Delivery Date (Required)').nullable(),
    lead_source_pan: Yup.string()
        .min(10, 'PAN NO (Min 10 Characters Needed)')
        .max(10, 'PAN NO (Max 10 Characters allowed)')
        .nullable(),
    sale_type_id: Yup.string()
        .required('Sale Type (Required)'),
    customer_id: Yup.string()
        .required('Customer Name (Required)'),
    nominee_name: Yup.string()
        .required('Nominee Name (Required)'),
    vin_on: Yup.string()
        .required('VIN Number (Required)'),
    // model_no: Yup.string()
    //     .required('Model Number (Required)'),
    // colour: Yup.string()
    //     .required('Color (Required)'),
    // variant: Yup.string()
    //     .required('Variant (Required)'),
    // engine_no: Yup.string()
    //     .required('Engine Number (Required)'),

})

export const ciformUsedCarValueSchema = Yup.object({
    id: Yup.string().required('This (Required Field)'),
    booking_date: Yup.string()
        .required('Booking Date (Required)'),
    lead_source_pan: Yup.string()
        .min(10, 'PAN NO (Min 10 Characters Needed)')
        .max(10, 'PAN NO (Max 10 Characters allowed)')
        .nullable(),
    nominee_name: Yup.string()
        .required('Nominee Name (Required)'),
    used_car_item: Yup.string()
        .required('Used Car Item (Required)')
        .nullable(),
    used_car_batch: Yup.string()
        .required('Used Car Batch (Required)')
        .nullable(),

})

export const itemSchema = Yup.object({
    itemName: Yup.string()
        .required('Item Name (Required)'),
    itemGrpName: Yup.string()
        .required('Item Group Name (Required)'),
    baseUnitName: Yup.string()
        .required('Base Unit Name (Required)'),

})

export const ciformSearchList = () => ({
    fromDate: "",
    toDate: ""
})

export const syncObj = () => ({
    id: "",
    txnDate: "",
    txnType: "",
    uid: ""
})


export const ciformSearchListSchema = Yup.object().shape({

    fromDate: Yup.string()
        .required('From Date is Required'),
    toDate: Yup.string()
        .required('To Date is Required')

});

export const syncSchema = Yup.object({
    txnDate: Yup.string()
        .required('Date (Required)'),
})

export const callPriceList = debounce(callpl, 800)

function callpl(value, setFieldValue, bookingDate, computeAllcalc, values, type, plName, mtaxObj, typeOfSale, setPriceListAmt) {
    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.itemName = value
    obj.date = bookingDate
    obj.segid = data.segid
    obj.cid = data.cid
    obj.pricelvlname = plName
    if (value && value !== null && value !== undefined && value !== "" && value.length > 2) {
        if (bookingDate && bookingDate !== undefined && bookingDate !== null && bookingDate !== "") {

            axios.post(VEHICAL_URL + '/ciform/rlbPriceList', obj)
                .then(response => {
                    if (response.data) {
                        // console.log(response, '-pricelist-response')
                        let items = response.data.data
                        if (items.length > 0) {
                            const keys = Object.keys(items)
                            const obj = keys.map((key) => {
                                return items[key]
                            }).filter((obj) => {
                                let fromDate = obj.fromDate.split("-")[2] + "-" + obj.fromDate.split("-")[1] + "-" + obj.fromDate.split("-")[0],
                                    toDate = obj.toDate.split("-")[2] + "-" + obj.toDate.split("-")[1] + "-" + obj.toDate.split("-")[0]
                                return moment(bookingDate).isBetween(fromDate, toDate, undefined, '[]')
                            })
                            // console.log(obj, '------date-fil-pricelist-obj')
                            if (obj.length > 0) {
                                // values.ex_showroom_without_gst_new = parseFloat(obj[0].rate)
                                values.ex_shrm_wo_gst_n_disc = parseFloat(obj[0].rate)
                                values.ex_showroom_without_gst = parseFloat(obj[0].rate)
                                setPriceListAmt(parseFloat(obj[0].rate))
                                // setFieldValue("ex_showroom_without_gst_new", parseFloat(obj[0].rate))
                                setFieldValue("ex_shrm_wo_gst_n_disc", parseFloat(obj[0].rate))
                                setFieldValue("ex_showroom_without_gst", parseFloat(obj[0].rate))
                                computeAllcalc(parseFloat(obj[0].rate), values, 0, setFieldValue, 'ex_shrm_wo_gst_n_disc', mtaxObj, typeOfSale)
                            }

                        }
                    }
                }).catch(error => "")
        }
    }
}


export const callPriceListView = debounce(callplView, 800)

function callplView(value, bookingDate, plName, setPriceListAmt) {
    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.itemName = value
    obj.date = bookingDate
    obj.segid = data.segid
    obj.cid = data.cid
    obj.pricelvlname = plName
    if (value && value !== null && value !== undefined && value !== "" && value.length > 2) {
        if (bookingDate && bookingDate !== undefined && bookingDate !== null && bookingDate !== "") {
            axios.post(VEHICAL_URL + '/ciform/rlbPriceList', obj)
                .then(response => {
                    if (response.data) {
                        let items = response.data.data
                        if (items.length > 0) {
                            const keys = Object.keys(items)
                            const obj = keys.map((key) => {
                                return items[key]
                            }).filter((obj) => {
                                let fromDate = obj.fromDate.split("-")[2] + "-" + obj.fromDate.split("-")[1] + "-" + obj.fromDate.split("-")[0],
                                    toDate = obj.toDate.split("-")[2] + "-" + obj.toDate.split("-")[1] + "-" + obj.toDate.split("-")[0]
                                return moment(bookingDate).isBetween(fromDate, toDate, undefined, '[]')
                            })
                            if (obj.length > 0) {
                                setPriceListAmt(parseFloat(obj[0].rate))
                            }

                        }
                    }
                }).catch(error => "")
        }
    }
}

export const callPriceListForAccessories = debounce(callplAccessories, 800)

function callplAccessories(value, bookingDate, plName, setFieldValue, index) {
    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.itemName = value
    obj.date = bookingDate
    obj.segid = data.segid
    obj.cid = data.cid
    obj.pricelvlname = plName
    if (value && value !== null && value !== undefined && value !== "") {
        if (bookingDate && bookingDate !== undefined && bookingDate !== null && bookingDate !== "") {
            axios.post(VEHICAL_URL + '/ciform/rlbPriceList', obj)
                .then(response => {
                    if (response.data) {
                        // console.log('response.data', response.data)
                        let items = response.data.data
                        if (items.length > 0) {
                            const keys = Object.keys(items)
                            const obj = keys.map((key) => {
                                return items[key]
                            }).filter((obj) => {
                                let fromDate = obj.fromDate.split("-")[2] + "-" + obj.fromDate.split("-")[1] + "-" + obj.fromDate.split("-")[0],
                                    toDate = obj.toDate.split("-")[2] + "-" + obj.toDate.split("-")[1] + "-" + obj.toDate.split("-")[0]
                                return moment(bookingDate).isBetween(fromDate, toDate, undefined, '[]')
                            })
                            if (obj.length > 0) {
                                setFieldValue("accdetails[" + index + "].amount", parseFloat(obj[0].rate))
                                console.log('accesories-pricelist-obj', obj)
                            }

                        }
                    }
                }).catch(error => "")
        }
    }
}

export const callSegmap = debounce(callSegmapAPI, 800)

function callSegmapAPI(value, setFieldValue, values) {
    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    if (value !== null && value !== undefined && value !== "") {
        axios.post(VEHICAL_URL + "/ciform/get-segmap", obj)
            .then(response => {
                response.data.data.map(item => {
                    setFieldValue('segid', item.name)
                })
                return response.data.data
            }).catch(error => "")
    }
}

export const callPurchasePrice = debounce(callPurchasePriceAPI, 800)

function callPurchasePriceAPI(value, setFieldValue, computeAllcalc, values, mtaxObj, typeOfSale) {
    let currDate = new Date()
    let batchDate = moment(currDate).format("YYYY-MM-DD")
    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.segid
    obj.batchName = value
    obj.batchDate = batchDate
    if (value !== null && value !== undefined && value !== "") {
        axios.post(VEHICAL_URL + "/ciform/rlbBatchPurchasePrice", obj)
            .then(response => {
                if (response.data.data) {
                    let price = response.data.data
                    values.purchase_basic = parseFloat(price.last_purchase_price)
                    setFieldValue("purchase_basic", parseFloat(price.last_purchase_price))
                    computeAllcalc(parseFloat(price.last_purchase_price), values, 0, setFieldValue, 'purchase_basic', mtaxObj, typeOfSale)
                }

                return response.data.data
            }).catch(error => console.log(error))
    }
}

export const callCarSaleSync = (carSaleObj, onModal, dispatch, fetchCiForm, history, id, setCiFetch, ciformFetchedDate) => {
    return axios.post(VEHICAL_URL + "/ciform/rlbCarSale", carSaleObj, { crossDomain: true })
        .then(response => {
            let res = response.data
            dispatch(fetchCiForm(ciformFetchedDate))
            if (response.data.type === 'success') {
                onModal({ type: true, msg: res.data ? res.data.msg : res.msg, status: 'Success' })
                dispatch(fetchCiForm(ciformFetchedDate))
            } else {
                onModal({ type: true, msg: res.data ? res.data.msg : res.msg, status: 'Error' })
            }
            setTimeout(function () {
                setCiFetch(false)
            }, 1000)
        })
        .catch(error => console.log(error))
}

export const callUsedCarValueSync = (usedCarValueObj, onModal, dispatch, fetchCiForm, history, id, setCiFetch, ciformFetchedDate) => {
    return axios.post(VEHICAL_URL + "/ciform/rlbUcarPur", usedCarValueObj, { crossDomain: true })
        .then(response => {
            let res = response.data
            dispatch(fetchCiForm(ciformFetchedDate))
            if (response.data.type === 'success') {
                onModal({ type: true, msg: res.data ? res.data.msg : res.msg, status: 'Success' })
                dispatch(fetchCiForm(ciformFetchedDate))
            } else {
                onModal({ type: true, msg: res.data ? res.data.msg : res.msg, status: 'Error' })
            }
            setTimeout(function () {
                setCiFetch(false)
            }, 1000)
        })
        .catch(error => console.log(error))
}

export const callJVSaleSync = (jvSaleObj, onModal, dispatch, fetchCiForm, history, id, setCiFetch, ciformFetchedDate) => {
    return axios.post(VEHICAL_URL + "/ciform/rlbJvSync", jvSaleObj, { crossDomain: true })
        .then(response => {
            dispatch(fetchCiForm(ciformFetchedDate))
            let res = response.data
            if (response.data.type === 'success') {
                onModal({ type: true, msg: res.data ? res.data.msg : res.msg, status: 'Success' })
            } else {
                onModal({ type: true, msg: res.data ? res.data.msg : res.msg, status: 'Error' })
            }
            setTimeout(function () {
                setCiFetch(false)
            }, 1000)
        })
        .catch(error => console.log(error))
}

export const callCarSaleUnSync = (saleUnSyncObj, onModal, dispatch, fetchCiForm, history, id, setCiFetch, ciformFetchedDate) => {
    return axios.post(VEHICAL_URL + "/ciform/rlbJvUn-Sync", saleUnSyncObj, { crossDomain: true })
        .then(response => {
            let res = response.data
            dispatch(fetchCiForm(ciformFetchedDate))
            if (response.data.type === 'success') {
                onModal({ type: true, msg: res.data ? res.data.msg : res.msg, status: 'Success' })
            } else {
                onModal({ type: true, msg: res.data ? res.data.msg : res.msg, status: 'Error' })
            }
            setTimeout(function () {
                setCiFetch(false)
            }, 1000)
        })
        .catch(error => console.log(error))
}

export const callStockInfo = debounce(callStockInfoAPI, 800)

function callStockInfoAPI(value, setFieldValue, date, setStockModal) {
    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.segid
    obj.batchId = value
    obj.date = date !== "" ? moment(date).format("DD-MM-YYYY") : ""
    axios.post(VEHICAL_URL + "/ciform/rlbBatchStockInfo", obj)
        .then(response => {
            if (response.data) {
                // console.log('response.data', response.data)
                if (response.data.type === "success" || response.data.type === "error") {
                    if (response.data.data[0]) {
                        let qty = response.data.data[0].avl_qty
                        if (parseInt(qty) == 0) {
                            // console.log('qty', qty)
                            setStockModal({ open: true, msg: "" })
                            setFieldValue("vin_on", "")
                            setFieldValue('engine_no', '')
                            setFieldValue('model_no', '')
                            setFieldValue('colour', '')
                            setFieldValue('variant', '')
                            setFieldValue('fuel_type', '')
                        }
                    }
                }
            }

            return response.data.data
        }).catch(error => console.log(error))
}

export const createItemNext = debounce(createItemNextWait, 800)
async function createItemNextWait(values, setCreateItemModalOpen, setErrorAlert, createItemPreantCallBack, resetForm, id) {
    try {
        const response = await axios.post(VEHICAL_URL + '/ciform/RlbItemCreate', values);
        if (response.data.type === "success" || response.data.type === "Success") {
            setErrorAlert({ isOpen: true, type: "Success", msg: response.data.msg });
            setCreateItemModalOpen({ isOpen: false, id: "" });
            createItemPreantCallBack(response.data);
            resetForm();
        } else {
            let msgG = response.data.msg;
            let getMsg = (typeof msgG === 'string' || msgG instanceof String) ? response.data.msg : response.data.msg.msg;
            setErrorAlert({ isOpen: true, type: "Error", msg: getMsg });
            setCreateItemModalOpen({ isOpen: false, id: "" });
        }
    } catch (error) {
        return console.log(error);
    }
}


export const callItemBatch = debounce(callItemBatchAPI, 800)

function callItemBatchAPI(value, setFieldValue, values) {

    const data = merge({}, userACL.atFetch())

    if (value !== null && value !== undefined && value !== "") {
        let obj = {}
        obj.itemId = value
        obj.cid = data.cid
        obj.segid = data.segid
        console.log('obj', obj)
        axios.post(VEHICAL_URL + "/ciform/ItemBatch", obj)
            .then(response => {
                console.log('response', response)
                return response.data
            }).catch(error => "")
    }
}

const filterDate = (rows, id, filterValue) => {
    return rows.filter(row => {
        let rowValue = moment(row.values[id]).format("DD-MM-YYYY")
        let check = filterValue.replace(/[ ]/gi, "-").replace(/[*]/gi, "-").replace(/[.]/gi, "-").replace(/[+]/gi, "-").replace(/[/]/gi, "-").replace(/[,]/gi, "-")
        return rowValue !== undefined ?
            String(rowValue).toLowerCase().startsWith(String(check).toLowerCase())
            : true
    })
}

export const searchColumns = [
    {
        Header: <div style={{ textAlign: 'left' }} >Customer Name</div>,
        accessor: 'customer_name',
        Cell: row => <div className='ellipsisDiv' style={{ width: '210px' }} title={(row.value && row.value !== undefined && row.value !== null && row.value !== 'NULL' && row.value !== "0" && row.value !== 0) ? row.value : ""}>{(row.value && row.value !== undefined && row.value !== null && row.value !== 'NULL' && row.value !== "0" && row.value !== 0) ? row.value : ""}</div>,
        classNameGet: 'ciListFilter1',

    },
    {
        Header: <div style={{ textAlign: 'left' }} >Form No</div>,
        accessor: 'form_no',
        Cell: row => <div style={{ textAlign: "left", paddingLeft: "5px" }}>{(row.value && row.value !== undefined && row.value !== null && row.value !== 'NULL' && row.value !== "0" && row.value !== 0) ? row.value : ""}</div>,
        classNameGet: 'ciListFilter2'
    },
    {
        Header: <div style={{ textAlign: 'left', paddingLeft: '5px' }} >CI Form Date</div>,
        accessor: 'ci_form_date',
        Cell: row => <div style={{ textAlign: "left", paddingLeft: '10px' }}>{row.value ? row.value === null ? "" : row.value === 'NULL' ? '' : displayDate(row.value) : ''}</div>,
        classNameGet: 'ciListFilter3',
        filter: filterDate,
    },
    {
        Header: <div style={{ textAlign: 'left', paddingLeft: '5px' }} >Booking Date</div>,
        accessor: 'booking_date',
        Cell: row => <div style={{ textAlign: "left", paddingLeft: '10px' }} className='wrapTextEllipsis'>{row.value ? row.value === null ? "" : row.value === 'NULL' ? '' : displayDate(row.value) : ''}</div>,
        classNameGet: 'ciListFilter4',
        filter: filterDate,
    },
    {
        Header: <div style={{ textAlign: 'left', paddingLeft: '5px' }} >GSTIN</div>,
        accessor: 'cust_gst_no',
        Cell: row => <div style={{ textAlign: "left", paddingLeft: '10px' }}>{(row.value && row.value !== undefined && row.value !== null && row.value !== 'NULL' && row.value !== "0" && row.value !== 0) ? row.value : ""}</div>,
        classNameGet: 'ciListFilter5'
    },
    {
        Header: <div style={{ textAlign: 'left', paddingLeft: '5px' }} >VIN No</div>,
        accessor: 'vin_on',
        Cell: row => <div style={{ textAlign: "left", paddingLeft: '15px' }}>{(row.value && row.value !== undefined && row.value !== null && row.value !== 'NULL' && row.value !== "0" && row.value !== 0) ? row.value : ""}</div>,
        classNameGet: 'ciListFilter6'
    },
]