import { createSelector } from "reselect";
import { startsWith, cloneDeep, at } from "lodash";
import { ciForm, ciFormAccessories, ciformSearchList, items, syncObj } from './model'
import { } from '../../../utilities/listUtils'
import moment from "moment";


export const getIsFetchingCiForm = (state, props) => state.ciform.params.isFetching;
export const getIsCiFormFetched = (state, props) => state.ciform.params.itemsFetched;
export const getIsSuccessFullySave = (state, props) => state.ciform.params.isSuccessFullySave;
export const getCiFormList = (state, props) => state.ciform.byId
export const getSearchVinResults = (state, props) => state.ciform.storeSearchedVin
export const getSearchUsedCarItemResults = (state, props) => state.ciform.storeSearchedUsedCarItem
export const getSearchAccesoriesItemResults = (state, props) => state.ciform.storeSearchedAccesoriesItem
export const getSearchVariantResults = (state, props) => state.ciform.storeSearchedVariant
export const getSearchItemBatchResults = (state, props) => state.ciform.storeSearchedItemBatch
export const getStoreSegmapResults = (state, props) => state.ciform.storeSegmap
export const getSearchSegListResults = (state, props) => state.ciform.storeSearchedSegList
export const getFetchPriceListResults = (state, props) => state.ciform.storePriceList
export const getNotification = (state, id) => state.ciform.notifications[id]


export const getCiForm = (state, props, saleTypeObj) => {
    if (props.match.path === '/ciform/create') {
        return ciForm()
    }
    if (props.match.path === '/ciform/edit/:id') {
        let _id = props.match.params.id
        let obj = cloneDeep(state.ciform.byId[_id]);
        // console.log(JSON.stringify(obj))
        let ex_showroom_without_gst = obj.ex_showroom_without_gst ? parseFloat(obj.ex_showroom_without_gst) : 0,
            CESS_rate = obj.CESS_rate ? parseFloat(obj.CESS_rate) : 0,
            IGST_rate = obj.IGST_rate ? parseFloat(obj.IGST_rate) : 0,
            CGST_rate = obj.CGST_rate ? parseFloat(obj.CGST_rate) : 0,
            SGST_rate = obj.SGST_rate ? parseFloat(obj.SGST_rate) : 0,
            IGST_amount = obj.IGST_amount ? parseFloat(obj.IGST_amount) : 0,
            totalRate = parseFloat(CESS_rate) + (parseFloat(IGST_rate) === 0 ? (parseFloat(CGST_rate) + parseFloat(SGST_rate)) : parseFloat(IGST_rate)),
            out_cash_disc = obj.out_cash_disc ? parseFloat(obj.out_cash_disc) : 0,
            exclCashDisc = parseFloat(out_cash_disc) / (1 + (parseFloat(totalRate) / 100)),
            inflow_corporate_discount = obj.inflow_corporate_discount ? parseFloat(obj.inflow_corporate_discount) : 0,
            inflCorporateDisc = parseFloat(inflow_corporate_discount) / (1 + (parseFloat(totalRate) / 100)),
            inflow_loyalty_discount = obj.inflow_loyalty_discount ? parseFloat(obj.inflow_loyalty_discount) : 0,
            inflLoyaltyDisc = parseFloat(inflow_loyalty_discount) / (1 + (parseFloat(totalRate) / 100)),
            inflow_other_discount = obj.inflow_other_discount ? parseFloat(obj.inflow_other_discount) : 0,
            inflOtherDisc = parseFloat(inflow_other_discount) / (1 + (parseFloat(totalRate) / 100)),
            inflow_insurance_discount = obj.inflow_insurance_discount ? parseFloat(obj.inflow_insurance_discount) : 0,
            inflInsuranceDisc = parseFloat(inflow_insurance_discount) / (1 + (parseFloat(totalRate) / 100)),
            out_exchange_disc = obj.out_exchange_disc ? parseFloat(obj.out_exchange_disc) : 0,
            exchangeDisc = parseFloat(out_exchange_disc) / (1 + (parseFloat(totalRate) / 100)),
            out_foc_acc = obj.out_foc_acc ? parseFloat(obj.out_foc_acc) : 0,
            focAccDisc = parseFloat(out_foc_acc) / (1 + (parseFloat(totalRate) / 100)),
            ex_showroom_without_gst_new = parseFloat(ex_showroom_without_gst) + parseFloat(exclCashDisc) + parseFloat(inflCorporateDisc) + parseFloat(inflLoyaltyDisc) + parseFloat(inflOtherDisc) + parseFloat(inflInsuranceDisc) + parseFloat(exchangeDisc)
        obj.exclude_cash_disc = exclCashDisc
        obj.exclude_inflow_corporate_disc = inflCorporateDisc
        obj.exclude_inflow_loyalty_disc = inflLoyaltyDisc
        obj.exclude_inflow_other_disc = inflOtherDisc
        obj.exclude_inflow_insurance_disc = inflInsuranceDisc
        obj.exclude_exchange_disc = exchangeDisc
        obj.exclude_foc_acc_disc = focAccDisc
        obj.isIntra = parseFloat(IGST_amount) === 0 ? true : false
        let sale_type_id = ''
        if (saleTypeObj) {
            sale_type_id = obj ? obj.sale_type_id : "";
        }
        obj.typeOfSale = saleTypeObj[sale_type_id] ? saleTypeObj[sale_type_id].saletype_name : ""
        obj.ex_showroom_without_gst_new = ex_showroom_without_gst_new
        obj.summaryInflow = obj.on_road
        obj.summaryoutflow = (parseFloat(obj.out_exchange_disc ? obj.out_exchange_disc : 0) + parseFloat(obj.out_brokerage ? obj.out_brokerage : 0) + parseFloat(obj.out_foc_acc ? obj.out_foc_acc : 0))
        let invoiceAmt = (obj.ex_showroom ? parseFloat(obj.ex_showroom) : 0) + (obj.tcs ? parseFloat(obj.tcs) : 0)
        obj.summaryInvoice = (invoiceAmt)
        obj.summaryExBasic = (obj.ex_showroom_without_gst)
        obj.summaryOtherSpt = 0
        let hmilSpt = (parseFloat(obj.exchange_discount ? obj.exchange_discount : 0) + parseFloat(obj.corporate_discount ? obj.corporate_discount : 0) + parseFloat(obj.warranty_discount ? obj.warranty_discount : obj.warranty_discount) + parseFloat(obj.retail_support_discount ? obj.retail_support_discount : 0) + parseFloat(obj.rsa_discount ? obj.rsa_discount : 0) + parseFloat(obj.insurance_discount ? obj.insurance_discount : 0))
        obj.summaryHmilSpt = (hmilSpt)
        obj.isMtaxChecked = (obj.m_tax && obj.m_tax !== undefined && obj.m_tax !== null && obj.m_tax !== "" && parseFloat(obj.m_tax) !== 0) ? true : false
        let outflowSum = (parseFloat(obj.out_exchange_disc ? obj.out_exchange_disc : 0) + parseFloat(obj.out_brokerage ? obj.out_brokerage : 0) + parseFloat(obj.inflLoyaltyDisc ? obj.inflLoyaltyDisc : 0) + parseFloat(obj.used_car_value ? obj.used_car_value : 0) + parseFloat(obj.outflw_adsnl_discount ? obj.outflw_adsnl_discount : 0)),
            onRoad = obj.on_road ? parseFloat(obj.on_road) : 0,
            summRec = parseFloat(onRoad) - parseFloat(outflowSum)
        obj.summaryRecivable = (summRec)
        obj.customer_dob = obj.customer_dob === "0000-00-00 00:00:00" ? "" : obj.customer_dob
        let sortedArr = []
        if (obj.accdetails.length === 0) {
            obj.accdetails = [ciFormAccessories()]
        } else {
            sortedArr = obj.accdetails.filter((item) => {
                return (parseInt(item.status, 10) === 1)
            }).sort((a, b) => {
                return (parseInt(a.sr_no, 10) - parseInt(b.sr_no, 10))
            })
        }
        if (sortedArr.length > 0) {
            obj.accdetails = sortedArr
        }
        return obj
    }
    if (props.match.path === '/ciform/view/:id' || props.match.path === '/ciform/summary/:id') {
        let _id = props.match.params.id
        let obj = cloneDeep(state.ciform.byId[_id]);
        let ex_showroom_without_gst = obj.ex_showroom_without_gst ? parseFloat(obj.ex_showroom_without_gst) : 0,
            CESS_rate = obj.CESS_rate ? parseFloat(obj.CESS_rate) : 0,
            IGST_rate = obj.IGST_rate ? parseFloat(obj.IGST_rate) : 0,
            CGST_rate = obj.CGST_rate ? parseFloat(obj.CGST_rate) : 0,
            SGST_rate = obj.SGST_rate ? parseFloat(obj.SGST_rate) : 0,
            totalRate = parseFloat(CESS_rate) + (parseFloat(IGST_rate) === 0 ? (parseFloat(CGST_rate) + parseFloat(SGST_rate)) : parseFloat(IGST_rate)),
            out_cash_disc = obj.out_cash_disc ? parseFloat(obj.out_cash_disc) : 0,
            exclCashDisc = parseFloat(out_cash_disc) / (1 + (parseFloat(totalRate) / 100)),
            inflow_corporate_discount = obj.inflow_corporate_discount ? parseFloat(obj.inflow_corporate_discount) : 0,
            inflCorporateDisc = parseFloat(inflow_corporate_discount) / (1 + (parseFloat(totalRate) / 100)),
            inflow_loyalty_discount = obj.inflow_loyalty_discount ? parseFloat(obj.inflow_loyalty_discount) : 0,
            inflLoyaltyDisc = parseFloat(inflow_loyalty_discount) / (1 + (parseFloat(totalRate) / 100)),
            inflow_other_discount = obj.inflow_other_discount ? parseFloat(obj.inflow_other_discount) : 0,
            inflOtherDisc = parseFloat(inflow_other_discount) / (1 + (parseFloat(totalRate) / 100)),
            inflow_insurance_discount = obj.inflow_insurance_discount ? parseFloat(obj.inflow_insurance_discount) : 0,
            inflInsuranceDisc = parseFloat(inflow_insurance_discount) / (1 + (parseFloat(totalRate) / 100)),
            out_exchange_disc = obj.out_exchange_disc ? parseFloat(obj.out_exchange_disc) : 0,
            exchangeDisc = parseFloat(out_exchange_disc) / (1 + (parseFloat(totalRate) / 100)),
            out_foc_acc = obj.out_foc_acc ? parseFloat(obj.out_foc_acc) : 0,
            focAccDisc = parseFloat(out_foc_acc) / (1 + (parseFloat(totalRate) / 100)),
            ex_showroom_without_gst_new = parseFloat(ex_showroom_without_gst) + parseFloat(exclCashDisc) + parseFloat(inflCorporateDisc) + parseFloat(inflLoyaltyDisc) + parseFloat(inflOtherDisc) + parseFloat(inflInsuranceDisc) + parseFloat(exchangeDisc)
        obj.exclude_cash_disc = exclCashDisc
        obj.exclude_inflow_corporate_disc = inflCorporateDisc
        obj.exclude_inflow_loyalty_disc = inflLoyaltyDisc
        obj.exclude_inflow_other_disc = inflOtherDisc
        obj.exclude_inflow_insurance_disc = inflInsuranceDisc
        obj.exclude_exchange_disc = exchangeDisc
        obj.exclude_foc_acc_disc = focAccDisc
        obj.ex_showroom_without_gst_new = ex_showroom_without_gst_new
        obj.customer_dob = obj.customer_dob === "0000-00-00 00:00:00" ? "" : obj.customer_dob
        if (obj.accdetails.length === 0) {
            obj.accdetails = [ciFormAccessories()]
        }
        return obj
    }
}

export const getCiFormByOnlyId = (state, _id, saleTypeObj) => {
    let obj = cloneDeep(state.ciform.byId[_id]);
    let ex_showroom_without_gst = obj.ex_showroom_without_gst ? parseFloat(obj.ex_showroom_without_gst) : 0,
        CESS_rate = obj.CESS_rate ? parseFloat(obj.CESS_rate) : 0,
        IGST_rate = obj.IGST_rate ? parseFloat(obj.IGST_rate) : 0,
        CGST_rate = obj.CGST_rate ? parseFloat(obj.CGST_rate) : 0,
        SGST_rate = obj.SGST_rate ? parseFloat(obj.SGST_rate) : 0,
        totalRate = parseFloat(CESS_rate) + (parseFloat(IGST_rate) === 0 ? (parseFloat(CGST_rate) + parseFloat(SGST_rate)) : parseFloat(IGST_rate)),
        out_cash_disc = obj.out_cash_disc ? parseFloat(obj.out_cash_disc) : 0,
        exclCashDisc = parseFloat(out_cash_disc) / (1 + (parseFloat(totalRate) / 100)),
        inflow_corporate_discount = obj.inflow_corporate_discount ? parseFloat(obj.inflow_corporate_discount) : 0,
        inflCorporateDisc = parseFloat(inflow_corporate_discount) / (1 + (parseFloat(totalRate) / 100)),
        inflow_loyalty_discount = obj.inflow_loyalty_discount ? parseFloat(obj.inflow_loyalty_discount) : 0,
        inflLoyaltyDisc = parseFloat(inflow_loyalty_discount) / (1 + (parseFloat(totalRate) / 100)),
        inflow_other_discount = obj.inflow_other_discount ? parseFloat(obj.inflow_other_discount) : 0,
        inflOtherDisc = parseFloat(inflow_other_discount) / (1 + (parseFloat(totalRate) / 100)),
        inflow_insurance_discount = obj.inflow_insurance_discount ? parseFloat(obj.inflow_insurance_discount) : 0,
        inflInsuranceDisc = parseFloat(inflow_insurance_discount) / (1 + (parseFloat(totalRate) / 100)),
        out_exchange_disc = obj.out_exchange_disc ? parseFloat(obj.out_exchange_disc) : 0,
        exchangeDisc = parseFloat(out_exchange_disc) / (1 + (parseFloat(totalRate) / 100)),
        out_foc_acc = obj.out_foc_acc ? parseFloat(obj.out_foc_acc) : 0,
        focAccDisc = parseFloat(out_foc_acc) / (1 + (parseFloat(totalRate) / 100)),
        ex_showroom_without_gst_new = parseFloat(ex_showroom_without_gst) + parseFloat(exclCashDisc) + parseFloat(inflCorporateDisc) + parseFloat(inflLoyaltyDisc) + parseFloat(inflOtherDisc) + parseFloat(inflInsuranceDisc) + parseFloat(exchangeDisc)
    obj.exclude_cash_disc = exclCashDisc
    obj.exclude_inflow_corporate_disc = inflCorporateDisc
    obj.exclude_inflow_loyalty_disc = inflLoyaltyDisc
    obj.exclude_inflow_other_disc = inflOtherDisc
    obj.exclude_inflow_insurance_disc = inflInsuranceDisc
    obj.exclude_exchange_disc = exchangeDisc
    obj.exclude_foc_acc_disc = focAccDisc
    obj.isIntra = parseFloat(IGST_rate) === 0 ? true : false
    let sale_type_id = ''
    if (saleTypeObj) {
        sale_type_id = obj ? obj.sale_type_id : "";
    }
    obj.typeOfSale = saleTypeObj[sale_type_id] ? saleTypeObj[sale_type_id].saletype_name : ""
    obj.ex_showroom_without_gst_new = ex_showroom_without_gst_new
    obj.summaryInflow = obj.on_road
    obj.summaryoutflow = (parseFloat(obj.out_exchange_disc ? obj.out_exchange_disc : 0) + parseFloat(obj.out_brokerage ? obj.out_brokerage : 0) + parseFloat(obj.out_foc_acc ? obj.out_foc_acc : 0))
    let invoiceAmt = (obj.ex_showroom ? parseFloat(obj.ex_showroom) : 0) + (obj.tcs ? parseFloat(obj.tcs) : 0)
    obj.summaryInvoice = (invoiceAmt)
    obj.summaryExBasic = (obj.ex_showroom_without_gst)
    obj.summaryOtherSpt = 0
    let hmilSpt = (parseFloat(obj.exchange_discount ? obj.exchange_discount : 0) + parseFloat(obj.corporate_discount ? obj.corporate_discount : 0) + parseFloat(obj.warranty_discount ? obj.warranty_discount : obj.warranty_discount) + parseFloat(obj.retail_support_discount ? obj.retail_support_discount : 0) + parseFloat(obj.rsa_discount ? obj.rsa_discount : 0) + parseFloat(obj.insurance_discount ? obj.insurance_discount : 0))
    obj.summaryHmilSpt = (hmilSpt)
    let outflowSum = (parseFloat(obj.out_exchange_disc ? obj.out_exchange_disc : 0) + parseFloat(obj.out_brokerage ? obj.out_brokerage : 0) + parseFloat(obj.inflLoyaltyDisc ? obj.inflLoyaltyDisc : 0) + parseFloat(obj.used_car_value ? obj.used_car_value : 0) + parseFloat(obj.outflw_adsnl_discount ? obj.outflw_adsnl_discount : 0)),
        onRoad = obj.on_road ? parseFloat(obj.on_road) : 0,
        summRec = parseFloat(onRoad) - parseFloat(outflowSum)
    obj.summaryRecivable = (summRec)
    obj.customer_dob = obj.customer_dob === "0000-00-00 00:00:00" ? "" : obj.customer_dob
    let sortedArr = []
    if (obj.accdetails.length === 0) {
        obj.accdetails = [ciFormAccessories()]
    } else {
        sortedArr = obj.accdetails.filter((item) => {
            return (parseInt(item.status, 10) === 1)
        }).sort((a, b) => {
            return (parseInt(a.sr_no, 10) - parseInt(b.sr_no, 10))
        })
    }
    if (sortedArr.length > 0) {
        obj.accdetails = sortedArr
    }
    return obj
}

export const getCiformListSearch = (state, path) => {
    return ciformSearchList()
}

export const getSyncObj = (state, props) => {
    return syncObj()
}

export const getItems = (state, props) => {
    return items()
}

export const getAccessories = (state, ciformId) => {
    let acceFromCiform = at(state.ciform.ById, ciformId)
    if (acceFromCiform[0] === undefined)
        acceFromCiform = [ciFormAccessories()]
    return acceFromCiform
}

export const getCiFormParams = (state, props) => {
    const params = {}

    if (startsWith(state.router.location.pathname, '/ciform/create')) {
        params.title = state.ciform.params.createTitle
        params.submitButtonText = state.ciform.params.createSubmitButtonText
    };

    if (startsWith(state.router.location.pathname, '/ciform/edit/')) {
        params.title = state.ciform.params.editTitle
        params.submitButtonText = state.ciform.params.editSubmitButtonText
    }
    return params
}



export const selectVinName = createSelector(
    getSearchVinResults,
    vin => {
        const keys = Object.keys(vin)
        const obj = keys.map((key) => { return { key: vin[key].batchName, value: vin[key].batchName, text: vin[key].batchName } })
        return obj

    })

export const selectVinNameByItemBatch = createSelector(
    getSearchItemBatchResults,
    vin => {
        let data = (vin && vin.data && vin.data.length > 0) ? vin.data : []
        if (data.length > 0) {
            const keys = Object.keys(data)
            const obj = keys.map((key) => { return { key: data[key].batchName, value: data[key].batchName, text: data[key].batchName } })
            return obj
        } else {
            return []
        }

    })

export const selectUsedCarItem = createSelector(
    getSearchUsedCarItemResults,
    caritem => {
        const keys = Object.keys(caritem)
        const obj = keys.map((key) => { return { key: caritem[key].id, value: caritem[key].item_name, text: caritem[key].item_name } })
        return obj

    })


export const selectAccesoriesItem = createSelector(
    getSearchAccesoriesItemResults,
    caritem => {
        const keys = Object.keys(caritem)
        const obj = keys.map((key) => { return { key: caritem[key].id, value: caritem[key].item_name, text: caritem[key].item_name } })
        return obj

    })

export const selectVariantItems = createSelector(
    getSearchVariantResults,
    variant => {
        const keys = Object.keys(variant)
        const obj = keys.map((key) => { return { key: variant[key].id, value: variant[key].item_name, text: variant[key].item_name } })
        return obj

    })

export const selectSegList = createSelector(
    getSearchSegListResults,
    seglist => {
        const keys = Object.keys(seglist)
        const obj = keys.map((key) => { return { key: seglist[key].segid, value: seglist[key].segid, text: seglist[key].segment } })
        return obj

    })


export const selectSegment = createSelector(
    getSearchSegListResults,
    segment => {
        let segObj = cloneDeep(segment)
        const keys = Object.keys(segObj)
        const obj = keys.map((key) => {
            segObj[key].key = (segObj[key].segid).toString()
            segObj[key].value = (segObj[key].segid).toString()
            segObj[key].text = segObj[key].name
            return segObj[key]
        });
        return obj
    })

export const getFilteredCiform = createSelector(
    getCiFormList,
    (ciform) => {
        let filteredCiform = Object.keys(ciform).map(function (key) {
            return ciform[key];
        })
        let sortedArr = filteredCiform.sort((a, b) => { return moment(b.ci_form_date) - moment(a.ci_form_date) })
        // console.log('sortedArr', sortedArr)
        return sortedArr;
    }
)