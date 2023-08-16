import { filter } from 'lodash'
import Moment from 'moment';
import { extendMoment } from 'moment-range';


export const computeAllcalc = (value, values, index, setFieldValue, type, mtaxObj, extraValue) => {
    let ex_delivery_date = type === "ex_delivery_date" ? (value ? value : '') : (values.ex_delivery_date ? values.ex_delivery_date : ''),
        purchase_basic = type === "purchase_basic" ? (value ? value : 0) : (values.purchase_basic ? values.purchase_basic : 0),
        invoice_amt = type === "invoice_amt" ? (value ? value : 0) : (values.invoice_amt ? values.invoice_amt : 0),
        ex_showroom = type === "ex_showroom" ? (value ? value : 0) : (values.ex_showroom ? values.ex_showroom : 0),
        ex_showroom_without_gst = type === "ex_showroom_without_gst" ? (value ? value : 0) : (values.ex_showroom_without_gst ? values.ex_showroom_without_gst : 0),
        ex_showroom_without_gst_new = type === "ex_showroom_without_gst_new" ? (value ? value : 0) : (values.ex_showroom_without_gst_new ? values.ex_showroom_without_gst_new : 0),
        ex_shrm_wo_gst_n_disc = type === "ex_shrm_wo_gst_n_disc" ? (value ? value : 0) : (values.ex_shrm_wo_gst_n_disc ? values.ex_shrm_wo_gst_n_disc : 0),
        tcs = type === "tcs" ? (value ? value : 0) : (values.tcs ? values.tcs : 0),
        sot = type === "sot" ? (value ? value : 0) : (values.sot ? values.sot : 0),
        insurance = type === "insurance" ? (value ? value : 0) : (values.insurance ? values.insurance : 0),
        m_tax = type === "m_tax" ? (value ? value : 0) : (values.m_tax ? values.m_tax : 0),
        used_car_value = type === "used_car_value" ? (value ? value : 0) : (values.used_car_value ? values.used_car_value : 0),
        passing_charges = type === "passing_charges" ? (value ? value : 0) : (values.passing_charges ? values.passing_charges : 0),
        hypothecation_charges = type === "hypothecation_charges" ? (value ? value : 0) : (values.hypothecation_charges ? values.hypothecation_charges : 0),
        ex_warranty = type === "ex_warranty" ? (value ? value : 0) : (values.ex_warranty ? values.ex_warranty : 0),
        paid_acc = type === "paid_acc" ? (value ? value : 0) : (values.paid_acc ? values.paid_acc : 0),
        rsa = type === "rsa" ? (value ? value : 0) : (values.rsa ? values.rsa : 0),
        basic_kit = type === "basic_kit" ? (value ? value : 0) : (values.basic_kit ? values.basic_kit : 0),
        price_diff = type === "price_diff" ? (value ? value : 0) : (values.price_diff ? values.price_diff : 0),
        others_1 = type === "others_1" ? (value ? value : 0) : (values.others_1 ? values.others_1 : 0),
        others_2 = type === "others_2" ? (value ? value : 0) : (values.others_2 ? values.others_2 : 0),
        others_3 = type === "others_3" ? (value ? value : 0) : (values.others_3 ? values.others_3 : 0),
        others_4 = type === "others_4" ? (value ? value : 0) : (values.others_4 ? values.others_4 : 0),
        rto = type === "rto" ? (value ? value : 0) : (values.rto ? values.rto : 0),
        hsrp = type === "hsrp" ? (value ? value : 0) : (values.hsrp ? values.hsrp : 0),
        fastag = type === "fastag" ? (value ? value : 0) : (values.fastag ? values.fastag : 0),
        on_road = type === "on_road" ? (value ? value : 0) : (values.on_road ? values.on_road : 0),
        out_cash_disc = type === "out_cash_disc" ? (value ? value : 0) : (values.out_cash_disc ? values.out_cash_disc : 0),
        inflow_corporate_discount = type === "inflow_corporate_discount" ? (value ? value : 0) : (values.inflow_corporate_discount ? values.inflow_corporate_discount : 0),
        inflow_loyalty_discount = type === "inflow_loyalty_discount" ? (value ? value : 0) : (values.inflow_loyalty_discount ? values.inflow_loyalty_discount : 0),
        inflow_other_discount = type === "inflow_other_discount" ? (value ? value : 0) : (values.inflow_other_discount ? values.inflow_other_discount : 0),
        inflow_insurance_discount = type === "inflow_insurance_discount" ? (value ? value : 0) : (values.inflow_insurance_discount ? values.inflow_insurance_discount : 0),
        exclude_cash_disc = type === "exclude_cash_disc" ? (value ? value : 0) : (values.exclude_cash_disc ? values.exclude_cash_disc : 0),
        exclude_inflow_corporate_disc = type === "exclude_inflow_corporate_disc" ? (value ? value : 0) : (values.exclude_inflow_corporate_disc ? values.exclude_inflow_corporate_disc : 0),
        exclude_inflow_loyalty_disc = type === "exclude_inflow_loyalty_disc" ? (value ? value : 0) : (values.exclude_inflow_loyalty_disc ? values.exclude_inflow_loyalty_disc : 0),
        exclude_inflow_other_disc = type === "exclude_inflow_other_disc" ? (value ? value : 0) : (values.exclude_inflow_other_disc ? values.exclude_inflow_other_disc : 0),
        exclude_inflow_insurance_disc = type === "exclude_inflow_insurance_disc" ? (value ? value : 0) : (values.exclude_inflow_insurance_disc ? values.exclude_inflow_insurance_disc : 0),
        exclude_exchange_disc = type === "exclude_exchange_disc" ? (value ? value : 0) : (values.exclude_exchange_disc ? values.exclude_exchange_disc : 0),
        exclude_foc_acc_disc = type === "exclude_foc_acc_disc" ? (value ? value : 0) : (values.exclude_foc_acc_disc ? values.exclude_foc_acc_disc : 0),
        out_exchange_disc = type === "out_exchange_disc" ? (value ? value : 0) : (values.out_exchange_disc ? values.out_exchange_disc : 0),
        out_brokerage = type === "out_brokerage" ? (value ? value : 0) : (values.out_brokerage ? values.out_brokerage : 0),
        out_foc_acc = type === "out_foc_acc" ? (value ? value : 0) : (values.out_foc_acc ? values.out_foc_acc : 0),
        exchange_discount = type === "exchange_discount" ? (value ? value : 0) : (values.exchange_discount ? values.exchange_discount : 0),
        corporate_discount = type === "corporate_discount" ? (value ? value : 0) : (values.corporate_discount ? values.corporate_discount : 0),
        loyalty_discount = type === "loyalty_discount" ? (value ? value : 0) : (values.loyalty_discount ? values.loyalty_discount : 0),
        warranty_discount = type === "warranty_discount" ? (value ? value : 0) : (values.warranty_discount ? values.warranty_discount : 0),
        retail_support_discount = type === "retail_support_discount" ? (value ? value : 0) : (values.retail_support_discount ? values.retail_support_discount : 0),
        insurance_discount = type === "insurance_discount" ? (value ? value : 0) : (values.insurance_discount ? values.insurance_discount : 0),
        outflw_adsnl_discount = type === "outflw_adsnl_discount" ? (value ? value : 0) : (values.outflw_adsnl_discount ? values.outflw_adsnl_discount : 0),
        mtaxCheck = type === "mtax-check" ? (value === true ? true : false) : ((values.isMtaxChecked !== undefined && values.isMtaxChecked !== null) ? values.isMtaxChecked : true),
        CESS_rate = values.CESS_rate ? values.CESS_rate : 0,
        CGST_rate = values.CESS_rate ? values.CGST_rate : 0,
        SGST_rate = values.CESS_rate ? values.SGST_rate : 0,
        IGST_rate = values.CESS_rate ? values.IGST_rate : 0,
        totalIgstRate = parseFloat(CESS_rate) + parseFloat(IGST_rate),
        totalCgstSgstRate = parseFloat(CESS_rate) + parseFloat(CGST_rate) + parseFloat(SGST_rate),
        isIntra = (values !== null && values.isIntra !== undefined) ? values.isIntra : true,
        cust_pan_no = values.cust_pan_no ? values.cust_pan_no : '',
        typeOfSale = type === "sale_type_id" ? (value ? value : '') : (extraValue ? extraValue : '')
    if (type === "purchase_basic") {
        if (isIntra === true) {
            invoice_amt = parseFloat(purchase_basic) + ((parseFloat(purchase_basic) * parseFloat(totalCgstSgstRate)) / 100)
        } else {
            invoice_amt = parseFloat(purchase_basic) + ((parseFloat(purchase_basic) * parseFloat(totalIgstRate)) / 100)
        }
        setFieldValue("invoice_amt", invoice_amt)
    }
    if (type === "out_cash_disc") {
        if (isIntra === true) {
            exclude_cash_disc = parseFloat(out_cash_disc) / (1 + (parseFloat(totalCgstSgstRate) / 100))
        } else {
            exclude_cash_disc = parseFloat(out_cash_disc) / (1 + (parseFloat(totalIgstRate) / 100))
        }
        setFieldValue("exclude_cash_disc", exclude_cash_disc ? parseFloat(exclude_cash_disc) : 0)
    }
    if (type === "inflow_corporate_discount") {
        if (isIntra === true) {
            exclude_inflow_corporate_disc = parseFloat(inflow_corporate_discount) / (1 + (parseFloat(totalCgstSgstRate) / 100))
        } else {
            exclude_inflow_corporate_disc = parseFloat(inflow_corporate_discount) / (1 + (parseFloat(totalIgstRate) / 100))
        }
        setFieldValue("exclude_inflow_corporate_disc", exclude_inflow_corporate_disc ? parseFloat(exclude_inflow_corporate_disc) : 0)
    }
    if (type === "inflow_loyalty_discount") {
        if (isIntra === true) {
            exclude_inflow_loyalty_disc = parseFloat(inflow_loyalty_discount) / (1 + (parseFloat(totalCgstSgstRate) / 100))
        } else {
            exclude_inflow_loyalty_disc = parseFloat(inflow_loyalty_discount) / (1 + (parseFloat(totalIgstRate) / 100))
        }
        setFieldValue("exclude_inflow_loyalty_disc", exclude_inflow_loyalty_disc ? parseFloat(exclude_inflow_loyalty_disc) : 0)
    }
    if (type === "inflow_other_discount") {
        if (isIntra === true) {
            exclude_inflow_other_disc = parseFloat(inflow_other_discount) / (1 + (parseFloat(totalCgstSgstRate) / 100))
        } else {
            exclude_inflow_other_disc = parseFloat(inflow_other_discount) / (1 + (parseFloat(totalIgstRate) / 100))
        }
        setFieldValue("exclude_inflow_other_disc", exclude_inflow_other_disc ? parseFloat(exclude_inflow_other_disc) : 0)
    }
    if (type === "out_foc_acc") {
        if (isIntra === true) {
            exclude_foc_acc_disc = parseFloat(out_foc_acc) / (1 + (parseFloat(totalCgstSgstRate) / 100))
        } else {
            exclude_foc_acc_disc = parseFloat(out_foc_acc) / (1 + (parseFloat(totalIgstRate) / 100))
        }
        setFieldValue("exclude_foc_acc_disc", exclude_foc_acc_disc ? parseFloat(exclude_foc_acc_disc) : 0)
    }
    if (type === "ex_shrm_wo_gst_n_disc" || type === "out_cash_disc" || type === "inflow_corporate_discount" || type === "inflow_other_discount" || type === "out_foc_acc") {
        ex_showroom_without_gst = parseFloat(ex_shrm_wo_gst_n_disc) - (parseFloat(parseFloat(exclude_cash_disc) + parseFloat(exclude_inflow_other_disc)))
        setFieldValue("ex_showroom_without_gst", ex_showroom_without_gst ? parseFloat(ex_showroom_without_gst) : 0)
    }

    if (isIntra === true) {
        let cessAmt = (parseFloat(ex_showroom_without_gst) * parseFloat(CESS_rate)) / 100,
            cgstAmt = (parseFloat(ex_showroom_without_gst) * parseFloat(CGST_rate)) / 100,
            sgstAmt = (parseFloat(ex_showroom_without_gst) * parseFloat(SGST_rate)) / 100
        setFieldValue("CESS_amount", parseFloat(cessAmt))
        setFieldValue("CGST_amount", parseFloat(cgstAmt))
        setFieldValue("SGST_amount", parseFloat(sgstAmt))
        setFieldValue("IGST_amount", parseFloat(0))
    } else {
        let cessAmt = (parseFloat(ex_showroom_without_gst) * parseFloat(CESS_rate)) / 100,
            igstAmt = (parseFloat(ex_showroom_without_gst) * parseFloat(IGST_rate)) / 100
        setFieldValue("CESS_amount", parseFloat(cessAmt))
        setFieldValue("CGST_amount", parseFloat(0))
        setFieldValue("SGST_amount", parseFloat(0))
        setFieldValue("IGST_amount", parseFloat(igstAmt))
    }

    if (isIntra === true) {
        ex_showroom = parseFloat(ex_showroom_without_gst) + ((parseFloat(ex_showroom_without_gst) * parseFloat(totalCgstSgstRate)) / 100)
    } else {
        ex_showroom = parseFloat(ex_showroom_without_gst) + ((parseFloat(ex_showroom_without_gst) * parseFloat(totalIgstRate)) / 100)
    }
    setFieldValue("ex_showroom", ex_showroom ? parseFloat(ex_showroom) : 0)
    if (ex_delivery_date !== "" && (ex_showroom_without_gst && ex_showroom_without_gst !== undefined && ex_showroom_without_gst !== null && ex_showroom_without_gst !== "" && parseFloat(ex_showroom_without_gst) !== 0)) {
        if (isIntra === true) {
            const keys = Object.keys(mtaxObj)
            const obj = keys.map((key) => { return mtaxObj[key] })
            let getObj = obj.length > 0 ? obj[0] : null
            if (getObj && getObj !== null) {
                let taxetails = getObj.taxetails
                if (taxetails.length > 0) {
                    const moment = extendMoment(Moment);
                    let filteredObj = taxetails.filter((obj) => {
                        return (((parseFloat(ex_showroom_without_gst) >= parseFloat(obj.from_amount)) && parseFloat(ex_showroom_without_gst) <= parseFloat(obj.to_amount)) && (Moment(ex_delivery_date).within(moment.range(Moment(obj.valid_from), Moment(obj.valid_to))) || Moment(ex_delivery_date).isSame(Moment(obj.valid_from) || Moment(ex_delivery_date).isSame(Moment(obj.valid_to)))))
                    })
                    if (filteredObj.length > 0) {
                        if (mtaxCheck === true) {
                            let app_rate = filteredObj[0].app_rate,
                                add_amount = filteredObj[0].add_amount
                            m_tax = ((parseFloat(ex_showroom_without_gst) * parseFloat(app_rate)) / 100) + parseFloat(add_amount)
                        } else {
                            m_tax = 0
                        }
                    } else {
                        m_tax = 0
                    }
                } else {
                    m_tax = 0
                }
            } else {
                m_tax = 0
            }
        } else {
            m_tax = 0
        }
    } else {
        m_tax = 0
    }
    setFieldValue('m_tax', parseFloat(m_tax))
    let isPan = (cust_pan_no && cust_pan_no !== undefined && cust_pan_no !== null && cust_pan_no !== "") ? true : false
    if (isPan) {
        if (parseFloat(ex_showroom) >= 1000000) {
            tcs = parseFloat(ex_showroom) / 100
        } else {
            tcs = 0
        }
    } else {
        if (parseFloat(ex_showroom) >= 1000000) {
            tcs = parseFloat(ex_showroom) / 20
        } else {
            tcs = 0
        }
    }
    setFieldValue('tcs', tcs)

    let rtoCalculationAmt = (parseFloat(purchase_basic) > parseFloat(ex_showroom_without_gst)) ? parseFloat(purchase_basic) : parseFloat(ex_showroom_without_gst)
    let isCorporate = typeOfSale.toString().trim().toLowerCase().indexOf("corporate")
    rto = isCorporate >= 0 ? ((rtoCalculationAmt * 12) / 100) : ((rtoCalculationAmt * 6) / 100)
    setFieldValue('rto', parseFloat(rto))

    // /// setting on_road price to auto
    on_road = ((parseFloat(ex_showroom ? ex_showroom : 0) + parseFloat(tcs ? tcs : 0) + parseFloat(sot ? sot : 0) + parseFloat(insurance ? insurance : 0) + parseFloat(rto ? rto : 0) + parseFloat(passing_charges ? passing_charges : 0) + parseFloat(hypothecation_charges ? hypothecation_charges : 0) + parseFloat(m_tax ? m_tax : 0) + parseFloat(ex_warranty ? ex_warranty : 0) + parseFloat(hsrp ? hsrp : 0) + parseFloat(others_1 ? others_1 : 0) + parseFloat(others_2 ? others_2 : 0) + parseFloat(others_3 ? others_3 : 0) + parseFloat(others_4 ? others_4 : 0) + parseFloat(rsa ? rsa : 0) + parseFloat(basic_kit ? basic_kit : 0) + parseFloat(price_diff ? price_diff : 0) + parseFloat(paid_acc ? paid_acc : 0) + parseFloat(fastag ? fastag : 0)))
    setFieldValue('on_road', on_road)
    setFieldValue('summaryInflow', on_road)

    let outflowSumm = parseFloat(out_exchange_disc ? out_exchange_disc : 0) + parseFloat(inflow_corporate_discount ? inflow_corporate_discount : 0) + parseFloat(inflow_loyalty_discount ? inflow_loyalty_discount : 0)  + parseFloat(used_car_value ? used_car_value : 0) + parseFloat(outflw_adsnl_discount ? outflw_adsnl_discount : 0)
    setFieldValue('summaryoutflow', outflowSumm)

    let invoiceAmt = parseFloat(ex_showroom) + parseFloat(tcs)
    setFieldValue('summaryInvoice', invoiceAmt)
    setFieldValue('summaryExBasic', ex_showroom_without_gst)

    let hmilSupport = parseFloat(exchange_discount ? exchange_discount : 0) + parseFloat(corporate_discount ? corporate_discount : 0) + parseFloat(loyalty_discount ? loyalty_discount : 0) + parseFloat(warranty_discount ? warranty_discount : 0) + parseFloat(retail_support_discount ? retail_support_discount : 0) + parseFloat(rsa ? rsa : 0) + parseFloat(insurance_discount ? insurance_discount : 0)
    setFieldValue('summaryHmilSpt', hmilSupport)

    let Receivable = ((on_road ? on_road : 0) - (outflowSumm ? outflowSumm : 0))
    setFieldValue('summaryRecivable', Receivable)
}