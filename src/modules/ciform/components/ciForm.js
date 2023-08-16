import React, { useEffect, useRef, useState } from 'react'
import { Formik, Field, FieldArray, Form as FormikForm } from 'formik'
import { Button, Container, Form, Grid, Header, Table, TableCell, TableRow, Modal, GridColumn, Checkbox, Icon } from 'semantic-ui-react'
import { FormikAmountComponent, FormikDateComponent, FormikDisplayLabelComponent, FormikInputComponent, FormikHiddenInputComponent, FormikTextAreaComponent } from '../../../utilities/formUtils'
import ThroughUsSelect from './throughUsSelect'
import { useSelector, useDispatch } from 'react-redux'
import { getAccessories, getCiForm, getIsSuccessFullySave, getCiFormParams, getNotification, getSearchVinResults, getStoreSegmapResults, selectSegment, getSearchStockResults, getSearchItemBatchResults, selectVariantItems, selectVinNameByItemBatch } from '../data/selectors'
import { createCiForm, editCiForm, fetchPriceList, getSegmap, searchVin, setNotifyDone, fetchCiForm, removeIsSavedCIForm, searchUsedCarItem, searcBatchStock, clearBatchStock, searchAccesoriesItem, searchItemBatch, searchVariant, clearSearchedItemBatch } from '../data/actions'
import { v4 } from 'uuid'
import userACL from '../../../store/access'
import Notification from '../../../utilities/notificationUtils'
import AccessoriesArray from './accessoriesArray'
import SalesManagerSelect from '../../salesmanager/components/salesManagerSelect'
import LeadSourceSelect from '../../leadsource/components/leadSourceSelect'
import SaleTypeSelect from '../../saletype/components/saleTypeSelect'
import SalesConsultantSelect from '../../salesconsultant/components/salesConsultantSelect'
import CustomerForm from '../../customer/components/customerForm'
import FormTypeSelect from '../../formtype/components/formTypeSelect'
import VinSearch from './vinSelect'
import { callItemBatch, callPriceList, callPriceListView, callPurchasePrice, callSegmap, callStockInfo, ciformSchema, ciformUsedCarValueSchema } from '../data/model'
import { cloneDeep, filter, matches, merge } from 'lodash'
import { displayAmtInLakh } from '../../../utilities/listUtils'
import FinanceBankSelect from '../../financebank/components/finananceBankSelect'
import FinanceConsultantSelect from '../../financeconsultant/components/financeConsultantSelect'
import CustomerSearch from '../../customer/components/customerSelect'
import { fetchCustomer, searchCustomer } from '../../customer/data/actions'
import { selectCountry, selectCustomerName } from '../../customer/data/selectors'
import * as lfns from './allCalculation'
import moment from 'moment'
import { selectSalesConsultant } from '../../salesconsultant/data/selectors'
import CiFormPrintOnSave from '../pdfPrint/ciFormPrintOnSave'
import ThroughUsTypeSelect from './throughUsTypeSelect'
import UsedCarItemSearch from './usedCarItemSearch'
import FinanceBankForm from './addFinanceBank'
import { fetchFinanceBank } from '../../financebank/data/actions'
import CalculatorComponent from './calculatorComponent'
import AgeCalculator from './ageCalculator'
import CustomerEditForm from '../../customer/components/customerEditForm'
import { calculateAgeFromDob, changeBackgroundFunction, checkFieldValidation, checkIsAddressSame, setSalesManagerOnEdit } from './commonFunctions'
import FuelTypeSelect from './fuelTypeSelect'
import CreateItemForm from './createItem'
import VariantSearch from './variantSearch'
import VehicalDetailsSearchBySelect from './vehicalDtlsSearchBy'



const CiForm = (props) => {

    const data = merge({}, userACL.atFetch())
    const vinObj = useSelector(state => getSearchVinResults(state, props))
    const segmapObj = useSelector(state => selectSegment(state, props))
    const segmapResult = useSelector(state => getStoreSegmapResults(state, props))
    const params = useSelector(state => getCiFormParams(state, props))
    const custObj = useSelector(state => selectCustomerName(state, props))
    const countryObj = useSelector(state => selectCountry(state, props))
    const formTypeObj = useSelector(state => state.formtype.byListId)
    const saleTypeObj = useSelector(state => state.saletype.byListId)
    const ciformFetchedDate = useSelector(state => state.ciform.saveFetchedCiFormDate)
    const salesManagereObj = useSelector(state => state.salesmanager.byId)
    const teamleader = useSelector(state => state.teamleader.byId)
    const leadSourceObj = useSelector(state => state.leadsource.byId)
    const scNameObj = useSelector(state => state.salesConsultant.byId)
    const salesManagerObj = useSelector(state => state.salesmanager.byId)
    const bankObj = useSelector(state => state.financebank.byId)
    const finScObj = useSelector(state => state.financeConsultant.byId)
    const ciform = useSelector(state => getCiForm(state, props, saleTypeObj))
    const ciformIsSuccessFullySave = useSelector(state => getIsSuccessFullySave(state, props))
    const itemBatchResponse = useSelector(state => getSearchItemBatchResults(state, props))
    const ciAcce = useSelector(state => getAccessories(state, ciform ? ciform.id : 0))
    const mtaxObj = useSelector(state => state.mtax.byId)
    const [customerModal, setCustomerModal] = useState(false);
    const [customerEditModal, setCustomerEditModal] = useState(false);
    const [showCustEditIcon, setShowCustEditIcon] = useState(false);
    const [customerEditObj, setCustomerEditObj] = useState({});
    const [finBankModalOpen, setFinBankModalOpen] = useState({ isOpen: false, id: "", setFieldValue: "" });
    const [createItemModalOpen, setCreateItemModalOpen] = useState({ isOpen: false, id: "", setFieldValue: "" });
    const [ageCalculatorOpen, setAgeCalculatorOpen] = useState(false);
    const [throughUs, setThroughUs] = useState(ciform ? ciform.through_us : "")
    const [vhclDtlsSrcBy, setVhclDtlsSrcBy] = useState(ciform ? ciform.vhcl_dtls_src_by : "")
    const [bankId, setBankId] = useState(ciform ? ciform.finc_bank_id : "")
    const [typeOfSale, setTypeOfSale] = useState('')
    const [typeOfSaleId, setTypeOfSaleId] = useState(ciform ? ciform.sale_type_id : "")
    const [leadSrc, setLeadSrcId] = useState(ciform ? ciform.lead_source_id : "")
    const [exCashDisc, setExCashDisc] = useState(ciform ? ciform.exclude_cash_disc : 0)
    const [inflowCorporateDisc, setInflowCorporateDisc] = useState(ciform ? ciform.exclude_inflow_corporate_disc : 0)
    const [inflowLoyaltyDisc, setInflowLoyaltyDisc] = useState(ciform ? ciform.exclude_inflow_loyalty_disc : 0)
    const [inflowOtherDisc, setInflowOtherDisc] = useState(ciform ? ciform.exclude_inflow_other_disc : 0)
    const [inflowInsuranceDisc, setInflowInsuranceDisc] = useState(ciform ? ciform.exclude_inflow_insurance_disc : 0)
    const [exchangeDisc, setExchangeDisc] = useState(ciform ? ciform.exclude_exchange_disc : 0)
    const [focAccDisc, setFocAccDisc] = useState(ciform ? ciform.exclude_foc_acc_disc : 0)
    const [focAccTotal, setFocAccTotal] = useState(ciform ? ciform.out_foc_acc : 0)
    const [totalValue, setTotalValue] = useState(ciform ? ciform : {})
    const [salesmanagerName, setSalesManagerName] = useState("")
    const [teamLeaderName, setTeamLeaderName] = useState("")
    const [isIntra, setIsIntra] = useState(false)
    const [showSegName, setShowSegName] = useState('')
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, type: "", msg: "" });
    const [stockModal, setStockModal] = useState({ open: false, msg: "" });
    const [itemBatchModal, setItemBatchModal] = useState({ open: false, msg: "" });
    const [custObjSave, setCustObjSave] = useState(null)
    const [isAutoVnum, setIsAutoVnum] = useState(false)
    const [isSavingOn, setIsSavingOn] = useState(false)
    const [ciFormDataId, setCiFormDataId] = useState('')
    const [usedCarVal, setUsedCarVal] = useState(ciform ? ciform.used_car_value : "")
    const [priceListAmt, setPriceListAmt] = useState(0)
    const [calculatorOpen, setCalculatorOpen] = useState(false)
    const [usedCarToggle, setUsedCarToggle] = useState(false)
    const [sameAddCheck, setSameAddCheck] = useState(false);
    const [vinOptByItemBatch, setVinOptByItemBatch] = useState(false)

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
    const [isFocusOnUsedCarItem, setIsFocusOnUsedCarItem] = useState(false);
    const [isFocusOnCustomer, setIsFocusOnCustomer] = useState(false);
    const [bookingDateError, setbookingDateError] = useState(false);
    const [expectedDateError, setExpectedDateError] = useState(false);
    const [saleTypeError, setSaleTypeError] = useState(false);
    const [leadSrcError, setLeadSrcError] = useState(false);
    const [custIdError, setCustIdError] = useState(false);
    const [vinNoError, setVinNoError] = useState(false);
    const [nomineeError, setNomineeError] = useState(false);
    const date = new Date()
    const todayDate = moment(date).format("YYYY-MM-DD")

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
            key: 'foreign_goods_custom',
            value: 'foreign_goods_custom',
            text: 'Foreign Goods Custom'
        },
        {
            key: 'remind_me_later',
            value: 'remind_me_later',
            text: 'Remind me later'
        }
    ]
    // let fromDate = data.fromdt
    // let toDate = data.todt
    // let fDate = fromDate.split("-")[2] + "-" + fromDate.split("-")[1] + "-" + fromDate.split("-")[0]
    // let tDate = toDate.split("-")[2] + "-" + toDate.split("-")[1] + "-" + toDate.split("-")[0]



    const savedCiForm = (values, resetForm) => {
        checkFieldValidation(
            values,
            setbookingDateError,
            setExpectedDateError,
            setSaleTypeError,
            setLeadSrcError,
            setCustIdError,
            setVinNoError,
            setNomineeError,
            scrollForm,
            scrollCustomer,
            scrollVehical,
            scrollSummary
        )
        if ((values.booking_date !== "" && values.booking_date !== null) && (values.ex_delivery_date !== "" && values.ex_delivery_date !== null) && values.sale_type_id !== "" && values.customer_id && values.vin_on !== "" && values.nominee_name !== "") {

            if (props.match.path === '/ciform/create') {
                values.purchase_basic = (values.purchase_basic === null || values.purchase_basic === "") ? parseFloat(0) : parseFloat(values.purchase_basic)
                values.ex_showroom = (values.ex_showroom === null || values.ex_showroom === "") ? parseFloat(0) : parseFloat(values.ex_showroom)
                values.ex_showroom_without_gst = (values.ex_showroom_without_gst === null || values.ex_showroom_without_gst === "") ? parseFloat(0) : parseFloat(values.ex_showroom_without_gst)
                values.ex_shrm_wo_gst_n_disc = (values.ex_shrm_wo_gst_n_disc === null || values.ex_shrm_wo_gst_n_disc === "") ? parseFloat(0) : parseFloat(values.ex_shrm_wo_gst_n_disc)
                values.invoice_amt = (values.invoice_amt === null || values.invoice_amt === "") ? parseFloat(0) : parseFloat(values.invoice_amt)
                values.tcs = (values.tcs === null || values.tcs === "") ? parseFloat(0) : parseFloat(values.tcs)
                values.sot = (values.sot === null || values.sot === "") ? parseFloat(0) : parseFloat(values.sot)
                values.insurance = (values.insurance === null || values.insurance === "") ? parseFloat(0) : parseFloat(values.insurance)
                values.used_car_value = (values.used_car_value === null || values.used_car_value === "") ? parseFloat(0) : parseFloat(values.used_car_value)
                values.hsrp = (values.hsrp === null || values.hsrp === "") ? parseFloat(0) : parseFloat(values.hsrp)
                values.others_1 = (values.others_1 === null || values.others_1 === "") ? parseFloat(0) : parseFloat(values.others_1)
                values.others_2 = (values.others_2 === null || values.others_2 === "") ? parseFloat(0) : parseFloat(values.others_2)
                values.others_3 = (values.others_3 === null || values.others_3 === "") ? parseFloat(0) : parseFloat(values.others_3)
                values.others_4 = (values.others_4 === null || values.others_4 === "") ? parseFloat(0) : parseFloat(values.others_4)
                values.rto = (values.rto === null || values.rto === "") ? parseFloat(0) : parseFloat(values.rto)
                values.passing_charges = (values.passing_charges === null || values.passing_charges === "") ? parseFloat(0) : parseFloat(values.passing_charges)
                values.hypothecation_charges = (values.hypothecation_charges === null || values.hypothecation_charges === "") ? parseFloat(0) : parseFloat(values.hypothecation_charges)
                values.m_tax = (values.m_tax === null || values.m_tax === "") ? parseFloat(0) : parseFloat(values.m_tax)
                values.ex_warranty = (values.ex_warranty === null || values.ex_warranty === "") ? parseFloat(0) : parseFloat(values.ex_warranty)
                values.rsa = (values.rsa === null || values.rsa === "") ? parseFloat(0) : parseFloat(values.rsa)
                values.basic_kit = (values.basic_kit === null || values.basic_kit === "") ? parseFloat(0) : parseFloat(values.basic_kit)
                values.price_diff = (values.price_diff === null || values.price_diff === "") ? parseFloat(0) : parseFloat(values.price_diff)
                values.paid_acc = (values.paid_acc === null || values.paid_acc === "") ? parseFloat(0) : parseFloat(values.paid_acc)
                values.fastag = (values.fastag === null || values.fastag === "") ? parseFloat(0) : parseFloat(values.fastag)
                values.on_road = (values.on_road === null || values.on_road === "") ? parseFloat(0) : parseFloat(values.on_road)
                values.out_cash_disc = (values.out_cash_disc === null || values.out_cash_disc === "") ? parseFloat(0) : parseFloat(values.out_cash_disc)
                values.inflow_corporate_discount = (values.inflow_corporate_discount === null || values.inflow_corporate_discount === "") ? parseFloat(0) : parseFloat(values.inflow_corporate_discount)
                values.outflw_adsnl_discount = (values.outflw_adsnl_discount === null || values.outflw_adsnl_discount === "") ? parseFloat(0) : parseFloat(values.outflw_adsnl_discount)
                values.outflw_insb4_discount = (values.outflw_insb4_discount === null || values.outflw_insb4_discount === "") ? parseFloat(0) : parseFloat(values.outflw_insb4_discount)
                values.inflow_loyalty_discount = (values.inflow_loyalty_discount === null || values.inflow_loyalty_discount === "") ? parseFloat(0) : parseFloat(values.inflow_loyalty_discount)
                values.inflow_other_discount = (values.inflow_other_discount === null || values.inflow_other_discount === "") ? parseFloat(0) : parseFloat(values.inflow_other_discount)
                values.inflow_insurance_discount = (values.inflow_insurance_discount === null || values.inflow_insurance_discount === "") ? parseFloat(0) : parseFloat(values.inflow_insurance_discount)
                values.out_brokerage = (values.out_brokerage === null || values.out_brokerage === "") ? parseFloat(0) : parseFloat(values.out_brokerage)
                values.out_exchange_disc = (values.out_exchange_disc === null || values.out_exchange_disc === "") ? parseFloat(0) : parseFloat(values.out_exchange_disc)
                values.out_foc_acc = (values.out_foc_acc === null || values.out_foc_acc === "") ? parseFloat(0) : parseFloat(values.out_foc_acc)
                values.exchange_discount = (values.exchange_discount === null || values.exchange_discount === "") ? parseFloat(0) : parseFloat(values.exchange_discount)
                values.corporate_discount = (values.corporate_discount === null || values.corporate_discount === "") ? parseFloat(0) : parseFloat(values.corporate_discount)
                values.loyalty_discount = (values.loyalty_discount === null || values.loyalty_discount === "") ? parseFloat(0) : parseFloat(values.loyalty_discount)
                values.warranty_discount = (values.warranty_discount === null || values.warranty_discount === "") ? parseFloat(0) : parseFloat(values.warranty_discount)
                values.rsa_discount = (values.rsa_discount === null || values.rsa_discount === "") ? parseFloat(0) : parseFloat(values.rsa_discount)
                values.insurance_discount = (values.insurance_discount === null || values.insurance_discount === "") ? parseFloat(0) : parseFloat(values.insurance_discount)
                values.retail_support_discount = (values.retail_support_discount === null || values.retail_support_discount === "") ? parseFloat(0) : parseFloat(values.retail_support_discount)
                values.loan_amount = (values.loan_amount === null || values.loan_amount === "") ? parseFloat(0) : parseFloat(values.loan_amount)
                if (values.nominee_dob == "") {
                    values.nominee_age = null
                }
                values.nominee_dob = values.nominee_dob === "" ? null : values.nominee_dob
                values.nominee_age = values.nominee_age === "" ? null : values.nominee_age
                values.customer_dob = values.customer_dob === "" ? null : values.customer_dob

                values.accdetails.map((acce_arr) => {
                    // userACL.atCreate(acce_arr)
                    // acce_arr.cid = values.cid
                    acce_arr.amount = (acce_arr.amount === null || acce_arr.amount === "") ? parseFloat(0) : parseFloat(acce_arr.amount)
                    acce_arr.paid_inflow = (acce_arr.paid_inflow === null || acce_arr.paid_inflow === "") ? parseFloat(0) : parseFloat(acce_arr.paid_inflow)
                    acce_arr.foc_outflow = (acce_arr.foc_outflow === null || acce_arr.foc_outflow === "") ? parseFloat(0) : parseFloat(acce_arr.foc_outflow)
                    delete acce_arr.txn_id
                })

                let accdetails = values.accdetails,
                    accDetFlag = false
                if (accdetails.length > 1) {
                    let count = 0
                    for (let g = 0; g < accdetails.length; g++) {
                        let accessories = accdetails[g].accessories ? accdetails[g].accessories : '',
                            amount = (accdetails[0].amount && accdetails[0].amount !== "") ? accdetails[g].amount : 0,
                            paid_inflow = accdetails[g].paid_inflow ? accdetails[g].paid_inflow : 0,
                            foc_outflow = accdetails[g].foc_outflow ? accdetails[g].foc_outflow : 0
                        if (accessories.toString().trim() !== "") {
                            count++
                        }
                    }
                    if (parseInt(accdetails.length, 10) == parseInt(count, 10)) {
                        accDetFlag = true
                    } else {
                        accDetFlag = false
                    }
                } else if (accdetails.length === 1) {
                    let accessories = accdetails[0].accessories ? accdetails[0].accessories : '',
                        amount = (accdetails[0].amount && accdetails[0].amount !== "") ? accdetails[0].amount : 0,
                        paid_inflow = accdetails[0].paid_inflow ? accdetails[0].paid_inflow : 0,
                        foc_outflow = accdetails[0].foc_outflow ? accdetails[0].foc_outflow : 0
                    if (accessories.toString().trim() === "" && parseFloat(amount) === 0) {
                        accDetFlag = true
                        // values.accdetails = []
                    } else if (accessories.toString().trim() === "") {
                        accDetFlag = false
                    } else {
                        accDetFlag = true
                    }
                }
                if (accDetFlag) {
                    let saleObject = cloneDeep(formTypeObj[values.form_type_id]),
                        numberType = (saleObject && saleObject !== null && saleObject !== undefined) ? saleObject.numbering : ""
                    if (numberType === 'auto') {

                        let numDetails = saleObject.numdetails,
                            onSegMap = filter(numDetails, matches({ 'segid': data.segid }))
                        let segMentObj = onSegMap.filter((obj) => {
                            let fromDate = moment(obj.from_date).format("YYYY-MM-DD"),
                                toDate = moment(obj.to_date).format("YYYY-MM-DD")
                            return moment(values.ci_form_date).isBetween(fromDate, toDate, undefined, '[]')
                        })
                        if (segMentObj.length > 0) {
                            let indexGet = numDetails.indexOf(segMentObj[0])
                            numDetails[indexGet].next_number = (parseInt(numDetails[indexGet].next_number, 10) + 1)
                        }
                    }
                    userACL.atCreate(values)
                    delete values.txnid
                    delete values.city
                    delete values.pin
                    delete values.state
                    delete values.contact_person
                    delete values.gst_reg_type
                    delete values.country
                    delete values.ex_showroom_without_gst_new
                    delete values.exclude_cash_disc
                    delete values.exclude_inflow_corporate_disc
                    delete values.exclude_inflow_loyalty_disc
                    delete values.exclude_inflow_other_disc
                    delete values.exclude_inflow_insurance_disc
                    delete values.exclude_exchange_disc
                    delete values.exclude_foc_acc_disc
                    delete values.isIntra
                    delete values.typeOfSale
                    delete values.summaryInflow
                    delete values.summaryoutflow
                    delete values.summaryInvoice
                    delete values.summaryExBasic
                    delete values.summaryOtherSpt
                    delete values.summaryHmilSpt
                    delete values.summaryRecivable
                    delete values.sales_manager_name
                    delete values.team_leader_name
                    delete values.isMtaxChecked
                    delete values.location

                    if (values.cid !== 0) {
                        dispatch(createCiForm(values, saleObject))
                        setSavedCiFormId(values.id)

                        setIsIntra(true)
                        setTimeout(function () {
                            dispatch(fetchCiForm(ciformFetchedDate))
                            dispatch(removeIsSavedCIForm())
                        }, 500)
                    }
                } else {
                    setErrorAlert({ isOpen: true, type: "Error", msg: "Please provide Accessories Details properly" })
                }
            }

            if (props.match.path === '/ciform/edit/:id') {
                values.purchase_basic = (values.purchase_basic === null || values.purchase_basic === "") ? parseFloat(0) : parseFloat(values.purchase_basic)
                values.ex_showroom = (values.ex_showroom === null || values.ex_showroom === "") ? parseFloat(0) : parseFloat(values.ex_showroom)
                values.ex_showroom_without_gst = (values.ex_showroom_without_gst === null || values.ex_showroom_without_gst === "") ? parseFloat(0) : parseFloat(values.ex_showroom_without_gst)
                values.ex_shrm_wo_gst_n_disc = (values.ex_shrm_wo_gst_n_disc === null || values.ex_shrm_wo_gst_n_disc === "") ? parseFloat(0) : parseFloat(values.ex_shrm_wo_gst_n_disc)
                values.invoice_amt = (values.invoice_amt === null || values.invoice_amt === "") ? parseFloat(0) : parseFloat(values.invoice_amt)
                values.tcs = (values.tcs === null || values.tcs === "") ? parseFloat(0) : parseFloat(values.tcs)
                values.sot = (values.sot === null || values.sot === "") ? parseFloat(0) : parseFloat(values.sot)
                values.insurance = (values.insurance === null || values.insurance === "") ? parseFloat(0) : parseFloat(values.insurance)
                values.used_car_value = (values.used_car_value === null || values.used_car_value === "") ? parseFloat(0) : parseFloat(values.used_car_value)
                values.hsrp = (values.hsrp === null || values.hsrp === "") ? parseFloat(0) : parseFloat(values.hsrp)
                values.others_1 = (values.others_1 === null || values.others_1 === "") ? parseFloat(0) : parseFloat(values.others_1)
                values.others_2 = (values.others_2 === null || values.others_2 === "") ? parseFloat(0) : parseFloat(values.others_2)
                values.others_3 = (values.others_3 === null || values.others_3 === "") ? parseFloat(0) : parseFloat(values.others_3)
                values.others_4 = (values.others_4 === null || values.others_4 === "") ? parseFloat(0) : parseFloat(values.others_4)
                values.rto = (values.rto === null || values.rto === "") ? parseFloat(0) : parseFloat(values.rto)
                values.passing_charges = (values.passing_charges === null || values.passing_charges === "") ? parseFloat(0) : parseFloat(values.passing_charges)
                values.hypothecation_charges = (values.hypothecation_charges === null || values.hypothecation_charges === "") ? parseFloat(0) : parseFloat(values.hypothecation_charges)
                values.m_tax = (values.m_tax === null || values.m_tax === "") ? parseFloat(0) : parseFloat(values.m_tax)
                values.ex_warranty = (values.ex_warranty === null || values.ex_warranty === "") ? parseFloat(0) : parseFloat(values.ex_warranty)
                values.rsa = (values.rsa === null || values.rsa === "") ? parseFloat(0) : parseFloat(values.rsa)
                values.basic_kit = (values.basic_kit === null || values.basic_kit === "") ? parseFloat(0) : parseFloat(values.basic_kit)
                values.price_diff = (values.price_diff === null || values.price_diff === "") ? parseFloat(0) : parseFloat(values.price_diff)
                values.paid_acc = (values.paid_acc === null || values.paid_acc === "") ? parseFloat(0) : parseFloat(values.paid_acc)
                values.fastag = (values.fastag === null || values.fastag === "") ? parseFloat(0) : parseFloat(values.fastag)
                values.out_cash_disc = (values.out_cash_disc === null || values.out_cash_disc === "") ? parseFloat(0) : parseFloat(values.out_cash_disc)
                values.inflow_corporate_discount = (values.inflow_corporate_discount === null || values.inflow_corporate_discount === "") ? parseFloat(0) : parseFloat(values.inflow_corporate_discount)
                values.outflw_adsnl_discount = (values.outflw_adsnl_discount === null || values.outflw_adsnl_discount === "") ? parseFloat(0) : parseFloat(values.outflw_adsnl_discount)
                values.outflw_insb4_discount = (values.outflw_insb4_discount === null || values.outflw_insb4_discount === "") ? parseFloat(0) : parseFloat(values.outflw_insb4_discount)
                values.inflow_loyalty_discount = (values.inflow_loyalty_discount === null || values.inflow_loyalty_discount === "") ? parseFloat(0) : parseFloat(values.inflow_loyalty_discount)
                values.inflow_other_discount = (values.inflow_other_discount === null || values.inflow_other_discount === "") ? parseFloat(0) : parseFloat(values.inflow_other_discount)
                values.inflow_insurance_discount = (values.inflow_insurance_discount === null || values.inflow_insurance_discount === "") ? parseFloat(0) : parseFloat(values.inflow_insurance_discount)
                values.out_brokerage = (values.out_brokerage === null || values.out_brokerage === "") ? parseFloat(0) : parseFloat(values.out_brokerage)
                values.out_exchange_disc = (values.out_exchange_disc === null || values.out_exchange_disc === "") ? parseFloat(0) : parseFloat(values.out_exchange_disc)
                values.out_foc_acc = (values.out_foc_acc === null || values.out_foc_acc === "") ? parseFloat(0) : parseFloat(values.out_foc_acc)
                values.exchange_discount = (values.exchange_discount === null || values.exchange_discount === "") ? parseFloat(0) : parseFloat(values.exchange_discount)
                values.corporate_discount = (values.corporate_discount === null || values.corporate_discount === "") ? parseFloat(0) : parseFloat(values.corporate_discount)
                values.loyalty_discount = (values.loyalty_discount === null || values.loyalty_discount === "") ? parseFloat(0) : parseFloat(values.loyalty_discount)
                values.warranty_discount = (values.warranty_discount === null || values.warranty_discount === "") ? parseFloat(0) : parseFloat(values.warranty_discount)
                values.rsa_discount = (values.rsa_discount === null || values.rsa_discount === "") ? parseFloat(0) : parseFloat(values.rsa_discount)
                values.insurance_discount = (values.insurance_discount === null || values.insurance_discount === "") ? parseFloat(0) : parseFloat(values.insurance_discount)
                values.retail_support_discount = (values.retail_support_discount === null || values.retail_support_discount === "") ? parseFloat(0) : parseFloat(values.retail_support_discount)
                values.on_road = (values.on_road === null || values.on_road === "") ? parseFloat(0) : parseFloat(values.on_road)
                values.loan_amount = (values.loan_amount === null || values.loan_amount === "") ? parseFloat(0) : parseFloat(values.loan_amount)
                values.CESS_amount = (values.CESS_amount === null || values.CESS_amount === "") ? parseFloat(0) : parseFloat(values.CESS_amount)
                values.IGST_amount = (values.IGST_amount === null || values.IGST_amount === "") ? parseFloat(0) : parseFloat(values.IGST_amount)
                values.CGST_amount = (values.CGST_amount === null || values.CGST_amount === "") ? parseFloat(0) : parseFloat(values.CGST_amount)
                values.SGST_amount = (values.SGST_amount === null || values.SGST_amount === "") ? parseFloat(0) : parseFloat(values.SGST_amount)
                values.CESS_rate = (values.CESS_rate === null || values.CESS_rate === "") ? parseFloat(0) : parseFloat(values.CESS_rate)
                values.IGST_rate = (values.IGST_rate === null || values.IGST_rate === "") ? parseFloat(0) : parseFloat(values.IGST_rate)
                values.CGST_rate = (values.CGST_rate === null || values.CGST_rate === "") ? parseFloat(0) : parseFloat(values.CGST_rate)
                values.SGST_rate = (values.SGST_rate === null || values.SGST_rate === "") ? parseFloat(0) : parseFloat(values.SGST_rate)
                if (values.nominee_dob == "") {
                    values.nominee_age = null
                }
                values.nominee_dob = values.nominee_dob === "" ? null : values.nominee_dob
                values.nominee_age = values.nominee_age === "" ? null : values.nominee_age
                values.customer_dob = values.customer_dob === "" ? null : values.customer_dob

                values.accdetails.map((acce_arr) => {
                    // userACL.atCreate(acce_arr)
                    // acce_arr.cid = values.cid
                    acce_arr.amount = (acce_arr.amount === null || acce_arr.amount === "") ? parseFloat(0) : parseFloat(acce_arr.amount)
                    acce_arr.paid_inflow = (acce_arr.paid_inflow === null || acce_arr.paid_inflow === "") ? parseFloat(0) : parseFloat(acce_arr.paid_inflow)
                    acce_arr.foc_outflow = (acce_arr.foc_outflow === null || acce_arr.foc_outflow === "") ? parseFloat(0) : parseFloat(acce_arr.foc_outflow)
                    delete acce_arr.txn_id
                })

                let accdetails = values.accdetails,
                    accDetFlag = false
                if (accdetails.length > 1) {
                    let count = 0
                    for (let g = 0; g < accdetails.length; g++) {
                        let accessories = accdetails[g].accessories ? accdetails[g].accessories : '',
                            amount = (accdetails[0].amount && accdetails[0].amount !== "") ? accdetails[g].amount : 0,
                            paid_inflow = accdetails[g].paid_inflow ? accdetails[g].paid_inflow : 0,
                            foc_outflow = accdetails[g].foc_outflow ? accdetails[g].foc_outflow : 0
                        if (accessories.toString().trim() !== "") {
                            count++
                        }
                    }
                    if (parseInt(accdetails.length, 10) == parseInt(count, 10)) {
                        accDetFlag = true
                    } else {
                        accDetFlag = false
                    }
                } else {
                    let accessories = accdetails[0].accessories ? accdetails[0].accessories : '',
                        amount = (accdetails[0].amount && accdetails[0].amount !== "") ? accdetails[0].amount : 0,
                        paid_inflow = accdetails[0].paid_inflow ? accdetails[0].paid_inflow : 0,
                        foc_outflow = accdetails[0].foc_outflow ? accdetails[0].foc_outflow : 0
                    if (accessories.toString().trim() === "" && parseFloat(amount) === 0) {
                        accDetFlag = true
                        // values.accdetails = []
                    } else if (accessories.toString().trim() === "") {
                        accDetFlag = false
                    } else {
                        accDetFlag = true
                    }
                }

                if (accDetFlag) {
                    userACL.atUpdate(values)
                    delete values.txnid
                    delete values.rlbsyncf
                    delete values.city
                    delete values.pin
                    delete values.state
                    delete values.contact_person
                    delete values.gst_reg_type
                    delete values.country
                    delete values.ex_showroom_without_gst_new
                    delete values.exclude_cash_disc
                    delete values.exclude_inflow_corporate_disc
                    delete values.exclude_inflow_loyalty_disc
                    delete values.exclude_inflow_other_disc
                    delete values.exclude_inflow_insurance_disc
                    delete values.exclude_exchange_disc
                    delete values.exclude_foc_acc_disc
                    delete values.isIntra
                    delete values.typeOfSale
                    delete values.summaryInflow
                    delete values.summaryoutflow
                    delete values.summaryInvoice
                    delete values.summaryExBasic
                    delete values.summaryOtherSpt
                    delete values.summaryHmilSpt
                    delete values.summaryRecivable
                    delete values.sales_manager_name
                    delete values.team_leader_name
                    delete values.dt_update
                    delete values.isMtaxChecked
                    delete values.location
                    if (values.cid !== 0) {
                        dispatch(editCiForm(values))
                        setSavedCiFormId(values.id)
                        setTimeout(function () {
                            dispatch(fetchCiForm(ciformFetchedDate))
                        }, 2000)

                    }
                } else {
                    setErrorAlert({ isOpen: true, type: "Error", msg: "Please provide Accessories Details properly" })
                }
            }
        }
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





    const changeBackground = () => {

        changeBackgroundFunction(formDetails, setFormScroll, setCustScroll, setVehicalScroll, setDealScroll, setOutflowScroll, setInflowScroll,
            setSupportScroll, setSummaryScroll, setNomineeScroll, setFinanceScroll, setAccessoriesScroll, setUsedCarAdditionalScroll,
            customer, vehical, final, summary, inflow, outflow, usedCarAddDetails, support, nominee, finance, accessories
        )

    }

    window.addEventListener('scroll', changeBackground)

    const setFormNumber = (value, setFieldValue, values) => {

        callSegmap(value, setFieldValue)

        if (value != "") {
            if (formTypeObj) {
                if (formTypeObj[value]) {
                    if (formTypeObj[value].numbering === 'auto') {
                        setFieldValue("form_no", "")
                        setIsAutoVnum(true)
                        let numDetails = formTypeObj[value].numdetails,
                            onSegMap = filter(numDetails, matches({ 'segid': data.segid }))
                        let segMentObj = onSegMap.filter((obj) => {
                            let fromDate = moment(obj.from_date).format("YYYY-MM-DD"),
                                toDate = moment(obj.to_date).format("YYYY-MM-DD")
                            return moment(values.ci_form_date).isBetween(fromDate, toDate, undefined, '[]')
                        })
                        if (segMentObj.length > 0) {
                            segMentObj.map((item) => {
                                let zeros = ''
                                for (var i = 0; i < item.number_count; i++) {
                                    zeros += 0
                                }
                                return (
                                    setFieldValue("form_no", item.number_prefix + "" + zeros + "" + item.next_number + "" + item.number_suffix)
                                )
                            })
                        }
                    } else {
                        setIsAutoVnum(false)
                        setFieldValue("form_no", "")
                    }
                } else {
                    setFieldValue("form_no", "")
                }
            } else {
                setFieldValue("form_no", "")
            }
        } else {
            setFieldValue("form_no", "")
        }
    }

    useEffect(() => {
        if (itemBatchResponse && itemBatchResponse !== null && itemBatchResponse !== undefined && itemBatchResponse !== {}) {
            if (itemBatchResponse.type === "error") {
                // setItemBatchModal({ open: true, msg: "" })
                dispatch(clearSearchedItemBatch())
            }
        }
    }, [itemBatchResponse])

    const variantSetFunction = (value, setFieldValue, values, searchedVarient) => {
        let id = ""
        searchedVarient.filter((item) => {
            if (item.value === value) {
                id = item.key
            }

        })
        if (id && id !== "") {
            let obj = {}
            obj.itemId = id
            obj.cid = data.cid
            obj.segid = data.segid
            // callItemBatch(value, setFieldValue, values)
            dispatch(searchItemBatch(obj))
            setVinOptByItemBatch(true)
        }

    }

    const setVinObj = (value, setFieldValue, bookingDate, values) => {
        if (value !== "") {
            let payload = {
                "batchName": value
            }
            payload.segid = data.segid
            payload.cid = data.cid
            if (payload.cid !== 0) {
                dispatch(searchVin(payload))
            }
            let vinObjSelected = filter(vinObj, matches({ 'batchName': value ? (value).toString().trim() : '' }))
            if (vinObjSelected[0]) {
                if (vinObjSelected[0].batchTaxList) {
                    vinObjSelected[0].batchTaxList.map((item) => {
                        if (item.taxName === "CESS-Output") {
                            values.CESS_rate = parseFloat(item.taxRate)
                            values.CESS_ledger = `CESS-Output @ ${parseFloat(item.taxRate).toFixed(1)}%`
                            setFieldValue("CESS_rate", parseFloat(item.taxRate))
                            setFieldValue("CESS_ledger", `CESS-Output @ ${parseFloat(item.taxRate).toFixed(1)}%`)

                        } else if (item.taxName === "CGST-Output") {
                            values.CGST_rate = parseFloat(item.taxRate)
                            values.CGST_ledger = `CGST-Output @ ${parseFloat(item.taxRate).toFixed(1)}%`
                            setFieldValue("CGST_rate", parseFloat(item.taxRate))
                            setFieldValue("CGST_ledger", `CGST-Output @ ${parseFloat(item.taxRate).toFixed(1)}%`)

                        } else if (item.taxName === "SGST-Output") {
                            values.SGST_rate = parseFloat(item.taxRate)
                            values.SGST_ledger = `SGST-Output @ ${parseFloat(item.taxRate).toFixed(1)}%`
                            setFieldValue("SGST_rate", parseFloat(item.taxRate))
                            setFieldValue("SGST_ledger", `SGST-Output @ ${parseFloat(item.taxRate).toFixed(1)}%`)
                        }
                        else if (item.taxName === "IGST-Output") {
                            values.IGST_rate = parseFloat(item.taxRate)
                            values.IGST_ledger = `IGST-Output @ ${parseFloat(item.taxRate).toFixed(1)}%`
                            setFieldValue("IGST_rate", parseFloat(item.taxRate))
                            setFieldValue("IGST_ledger", `IGST-Output @ ${parseFloat(item.taxRate).toFixed(1)}%`)
                        }
                    })
                }
            }
            if (vinObjSelected[0]) {
                if (vinObjSelected[0].batchName) {
                    callPurchasePrice(vinObjSelected[0].batchName, setFieldValue, lfns.computeAllcalc, values, mtaxObj, typeOfSale)
                }
                if (vinObjSelected[0].batch_id) {
                    callStockInfo(vinObjSelected[0].batch_id, setFieldValue, values.ci_form_date, setStockModal)
                }
            }
            if (vinObjSelected[0] && vinObjSelected[0] !== undefined && vinObjSelected[0] !== null) {
                setFieldValue("itemName", vinObjSelected[0].itemName)
                setFieldValue("itemGroupName", vinObjSelected[0].itemGroupName)
                setFieldValue("item_id", vinObjSelected[0].itemId)
                setFieldValue("itemGroup_id", vinObjSelected[0].itemGroupId)
                setFieldValue('model_no', vinObjSelected[0].itemGroupName)
                if (vhclDtlsSrcBy === "ch" || vhclDtlsSrcBy === "") {
                    setFieldValue('variant', vinObjSelected[0].itemName)
                }
                if (vinObjSelected[0].itemName && vinObjSelected[0].itemName !== undefined && vinObjSelected[0].itemName !== null && vinObjSelected[0].itemName !== "") {
                    let plNameGet = typeOfSaleId ? (saleTypeObj[typeOfSaleId] ? (saleTypeObj[typeOfSaleId].price_list ? saleTypeObj[typeOfSaleId].price_list : '') : '') : ''
                    callPriceList(vinObjSelected[0].itemName, setFieldValue, values.booking_date, lfns.computeAllcalc, values, 0, plNameGet, mtaxObj, typeOfSale, setPriceListAmt)
                }
                if (vinObjSelected[0].batchSpecList && vinObjSelected[0].batchSpecList !== undefined && vinObjSelected[0].batchSpecList !== null && vinObjSelected[0].batchSpecList.length > 0) {
                    vinObjSelected[0].batchSpecList.map((item) => {
                        if ((item.key).toString().trim().toLowerCase() === 'engine no.' || (item.key).toString().trim().toLowerCase() === 'engine no') {
                            setFieldValue('engine_no', item.val)
                        } else {
                            setFieldValue('engine_no', "")
                        }
                        if ((item.key).toString().trim().toLowerCase() === 'color' || (item.key).toString().trim().toLowerCase() === 'colour' || (item.key).toString().trim().toLowerCase() === 'color code') {
                            setFieldValue('colour', item.val)
                        } else {
                            setFieldValue('colour', "")
                        }

                    })
                }
            }
        } else {
            setFieldValue('engine_no', '')
            setFieldValue('model_no', '')
            setFieldValue('colour', '')
            if (vhclDtlsSrcBy === "ch" || vhclDtlsSrcBy === "") {
                setFieldValue('variant', '')
            }
            setFieldValue('fuel_type', '')
            setFieldValue('itemName', '')
            setFieldValue('item_id', '')
            setFieldValue('itemGroupName', '')
            setFieldValue('itemGroup_id', '')
            setFieldValue('CESS_rate', '0')
            setFieldValue('CESS_ledger', '')
            setFieldValue('CESS_amount', '0')
            setFieldValue('CGST_rate', '0')
            setFieldValue('CGST_ledger', '')
            setFieldValue('CGST_amount', '0')
            setFieldValue('SGST_rate', '0')
            setFieldValue('SGST_ledger', '')
            setFieldValue('SGST_amount', '0')
            setFieldValue('IGST_rate', '0')
            setFieldValue('IGST_ledger', '')
            setFieldValue('IGST_amount', '0')
        }
    }


    const setCustObj = (value, setFieldValue, obj) => {
        if (value) {
            if (obj) {
                if (obj[value]) {
                    setShowCustEditIcon(true)
                    setCustomerEditObj(obj[value])
                    checkIsAddressSame(obj[value], setSameAddCheck)
                    let res = obj[value].party ? obj[value].party : ""
                    let alt_address = obj[value].alt_party_address ? obj[value].alt_party_address : []
                    let pa_address = ""
                    if (alt_address.length > 0) {
                        let pa = alt_address ? alt_address[0] : ""
                        pa_address = `${((pa.address && pa.address !== "None" && pa.address !== undefined) ? pa.address + ", " : "")}${((pa.pin && pa.pin !== "None" && pa.pin !== undefined) ? "Pin Code - " + pa.pin + ", " : "")}${((pa.city && pa.city !== "None" && pa.city !== undefined) ? pa.city + ", " : "")}${((pa.st && pa.st !== "None" && pa.st !== undefined) ? pa.st + ", " : "")}${(pa.country_name && pa.country_name !== "None" && pa.country_name !== undefined) ? pa.country_name : ""}`
                        setCust_permanent_address(pa_address ? pa_address : "")
                    } else {
                        setCust_permanent_address("")
                    }
                    setFieldValue("customer_id", obj[value].id)
                    setFieldValue("customer_cd", obj[value].ledger_code === "None" ? "" : obj[value].ledger_code)
                    setFieldValue("customer_name", obj[value].ledger_name === "None" ? "" : obj[value].ledger_name)
                    setFieldValue("cust_email_id", res.email === "None" ? "" : res.email)
                    setFieldValue("cust_mobele_no", res.phone === "None" ? "" : res.phone)
                    setFieldValue("cust_pan_no", res.pan_no === "None" ? "" : res.pan_no)
                    setFieldValue("cust_gst_no", res.gstin_no === "None" ? "" : res.gstin_no)
                    setFieldValue("cust_registration_address", res.address === "None" ? "" : res.address)
                    setFieldValue("cust_permanent_address", pa_address ? pa_address : "")

                    setCust_pan_no(res.pan_no === "None" ? "" : res.pan_no)
                    setCust_email_id(res.email === "None" ? "" : res.email)
                    setCust_mobele_no(res.phone === "None" ? "" : res.phone)
                    setCust_gst_no(res.gstin_no === "None" ? "" : res.gstin_no)
                    setCust_registration_address(res.address === "None" ? "" : res.address)
                    setcustomer_id(obj[value].id === "None" ? "" : obj[value].id)
                    setcustomer_cd(obj[value].ledger_code === "None" ? "" : obj[value].ledger_code)
                    setCustomer_name(obj[value].ledger_name === "None" ? "" : obj[value].ledger_name)
                    setCity(res.city === "None" ? "" : res.city)
                    setPin(res.pin === "None" ? "" : res.pin)
                    setState(res.st)
                    setContactPerson(res.contact_person === "None" ? "" : res.contact_person)
                    if (segmapResult && segmapResult !== undefined && segmapResult !== null) {
                        segmapResult.map((item) => {
                            if (parseInt(data.segid, 10) === parseInt(item.segid, 10)) {
                                let itemGst = item.gstin
                                let custGst = res.gstin_no
                                let itemResult = itemGst.slice(0, 2)
                                let custResult = (custGst && custGst !== undefined && custGst !== null) ? custGst.slice(0, 2) : res.state_code
                                if (parseInt(itemResult, 10) === parseInt(custResult, 10)) {
                                    setIsIntra(true)
                                    setFieldValue("isIntra", true)
                                } else {
                                    setIsIntra(false)
                                    setFieldValue("isIntra", false)
                                }
                            }
                        })
                    } else {
                        setIsIntra(false)
                        setFieldValue("isIntra", false)
                    }

                    let gstCountry = filter(countryObj, matches({ 'value': res.country_name ? (res.country_name).toString().trim() : '' }))
                    if (gstCountry.length > 0) {
                        setCountry(gstCountry[0].text)
                    }
                    let gstRegType = filter(gstTypeOpt, matches({ 'value': res.gst_reg_type ? (res.gst_reg_type).toString().trim() : '' }))
                    if (gstRegType.length > 0) {
                        setGstRegtype(gstRegType[0].text === "None" ? "" : gstRegType[0].text)
                    }
                } else {
                    setShowCustEditIcon(false)
                    setFieldValue("customer_id", "")
                    setFieldValue("customer_cd", "")
                    setFieldValue("customer_name", "")
                    setFieldValue("cust_email_id", "")
                    setFieldValue("cust_mobele_no", "")
                    setFieldValue("cust_pan_no", "")
                    setFieldValue("cust_gst_no", "")
                    setFieldValue("cust_registration_address", "")
                    setFieldValue("cust_permanent_address", "")

                    setCust_pan_no("")
                    setCust_email_id("")
                    setCust_mobele_no("")
                    setCust_gst_no("")
                    setCust_registration_address("")
                    setcustomer_id("")
                    setcustomer_cd("")
                    setCustomer_name("")
                    setCust_permanent_address("")
                    setCity("")
                    setPin("")
                    setState("")
                    setContactPerson("")
                    setCountry("")
                    setGstRegtype("")
                }
            }
            else {
                setShowCustEditIcon(false)
                setFieldValue("customer_id", "")
                setFieldValue("customer_cd", "")
                setFieldValue("cust_email_id", "")
                setFieldValue("cust_mobele_no", "")
                setFieldValue("cust_pan_no", "")
                setFieldValue("cust_gst_no", "")
                setFieldValue("cust_registration_address", "")
                setFieldValue("cust_permanent_address", "")

                setCust_pan_no("")
                setCust_email_id("")
                setCust_mobele_no("")
                setCust_gst_no("")
                setCust_registration_address("")
                setcustomer_id("")
                setcustomer_cd("")
                setCustomer_name("")
                setCust_permanent_address("")
                setCity("")
                setPin("")
                setState("")
                setContactPerson("")
                setCountry("")
                setGstRegtype("")
            }

        }
        else {
            setShowCustEditIcon(false)
            setFieldValue("customer_id", "")
            setFieldValue("customer_cd", "")
            setFieldValue("cust_email_id", "")
            setFieldValue("cust_mobele_no", "")
            setFieldValue("cust_pan_no", "")
            setFieldValue("cust_gst_no", "")
            setFieldValue("cust_registration_address", "")
            setFieldValue("cust_permanent_address", "")

            setCust_pan_no("")
            setCust_email_id("")
            setCust_mobele_no("")
            setCust_gst_no("")
            setCust_registration_address("")
            setcustomer_id("")
            setcustomer_cd("")
            setCustomer_name("")
            setCust_permanent_address("")
            setCity("")
            setPin("")
            setState("")
            setContactPerson("")
            setCountry("")
            setGstRegtype("")
        }
    }

    const setSalesManager = (value, setFieldValue, values) => {
        if (teamleader) {
            if (teamleader[value]) {
                if (teamleader[value].history) {

                    let array = teamleader[value].history
                    let data = array.filter((obj) => {
                        let fromDate = moment(obj.team_lead_4mdate).format("YYYY-MM-DD"),
                            toDate = moment(obj.team_lead_2date).format("YYYY-MM-DD")

                        return moment(values.ci_form_date).isBetween(fromDate, toDate, undefined, '[]')
                    })
                    if (data.length > 0) {
                        let teamleaderId = data[0].prnt_id
                        let salesmanagerId = teamleaderId ? teamleader[teamleaderId].prnt_id : ""
                        let salesmanagerName = salesmanagerId ? teamleader[salesmanagerId].emp_name : ""
                        let teamLeaderName = salesmanagerId ? teamleader[teamleaderId].emp_name : ""
                        setSalesManagerName(salesmanagerName)
                        setTeamLeaderName(teamLeaderName)
                        setFieldValue("sales_manager_id", salesmanagerId)
                    }

                } else {
                    setSalesManagerName("")
                    setTeamLeaderName("")
                    setFieldValue("sales_manager_id", "")
                    values.sales_manager_id = ""
                }
            } else {
                setSalesManagerName("")
                setTeamLeaderName("")
                setFieldValue("sales_manager_id", "")
                values.sales_manager_id = ""
            }
        }

    }

    const callAndSetCheckBox = (e, { checked }, mtax, setFieldValue, values) => {
        if (checked === false) {
            lfns.computeAllcalc(false, values, 0, setFieldValue, 'mtax-check', mtaxObj, typeOfSale)
            setFieldValue('isMtaxChecked', false);
        } else {
            lfns.computeAllcalc(true, values, 0, setFieldValue, 'mtax-check', mtaxObj, typeOfSale)
            setFieldValue('isMtaxChecked', true);
        }
    }

    const callCashDiscountCal = (value, values, index, setFieldValue, textFrom) => {
        let cashDisc = value ? parseFloat(value) : 0,
            excludeCashDisc = 0
        let cess = values.CESS_rate ? values.CESS_rate : 0,
            cgst = values.CGST_rate ? values.CGST_rate : 0,
            sgst = values.SGST_rate ? values.SGST_rate : 0,
            igst = values.IGST_rate ? values.IGST_rate : 0
        if (isIntra === true) {
            let taxRate = parseFloat(cess) + parseFloat(cgst) + parseFloat(sgst)
            excludeCashDisc = parseFloat(cashDisc) / (1 + (parseFloat(taxRate) / 100))
        } else {
            let taxRate = parseFloat(cess) + parseFloat(igst)
            excludeCashDisc = parseFloat(cashDisc) / (1 + (parseFloat(taxRate) / 100))
        }
        setExCashDisc(excludeCashDisc ? parseFloat(excludeCashDisc) : 0)
        setFieldValue("exclude_cash_disc", excludeCashDisc ? parseFloat(excludeCashDisc) : 0)
        values.out_cash_disc = cashDisc
        values.exclude_cash_disc = excludeCashDisc
        lfns.computeAllcalc(cashDisc, values, index, setFieldValue, 'out_cash_disc', mtaxObj, typeOfSale)
    }

    const callInflowCorporateDiscountCal = (value, values, index, setFieldValue, textFrom) => {
        let cashDisc = value ? parseFloat(value) : 0,
            excludeInflowCorporateDisc = 0
        let cess = values.CESS_rate ? values.CESS_rate : 0,
            cgst = values.CGST_rate ? values.CGST_rate : 0,
            sgst = values.SGST_rate ? values.SGST_rate : 0,
            igst = values.IGST_rate ? values.IGST_rate : 0
        if (isIntra === true) {
            let taxRate = parseFloat(cess) + parseFloat(cgst) + parseFloat(sgst)
            excludeInflowCorporateDisc = parseFloat(cashDisc) / (1 + (parseFloat(taxRate) / 100))
        } else {
            let taxRate = parseFloat(cess) + parseFloat(igst)
            excludeInflowCorporateDisc = parseFloat(cashDisc) / (1 + (parseFloat(taxRate) / 100))
        }
        setInflowCorporateDisc(excludeInflowCorporateDisc ? parseFloat(excludeInflowCorporateDisc) : 0)
        setFieldValue("exclude_inflow_corporate_disc", excludeInflowCorporateDisc ? parseFloat(excludeInflowCorporateDisc) : 0)
        values.inflow_corporate_discount = cashDisc
        values.exclude_inflow_corporate_disc = excludeInflowCorporateDisc
        lfns.computeAllcalc(cashDisc, values, index, setFieldValue, 'inflow_corporate_discount', mtaxObj, typeOfSale)
    }

    const callInflowOtherDiscountCal = (value, values, index, setFieldValue, textFrom) => {
        let cashDisc = value ? parseFloat(value) : 0,
            excludeInflowOtherDisc = 0
        let cess = values.CESS_rate ? values.CESS_rate : 0,
            cgst = values.CGST_rate ? values.CGST_rate : 0,
            sgst = values.SGST_rate ? values.SGST_rate : 0,
            igst = values.IGST_rate ? values.IGST_rate : 0
        if (isIntra === true) {
            let taxRate = parseFloat(cess) + parseFloat(cgst) + parseFloat(sgst)
            excludeInflowOtherDisc = parseFloat(cashDisc) / (1 + (parseFloat(taxRate) / 100))
        } else {
            let taxRate = parseFloat(cess) + parseFloat(igst)
            excludeInflowOtherDisc = parseFloat(cashDisc) / (1 + (parseFloat(taxRate) / 100))
        }
        setInflowOtherDisc(excludeInflowOtherDisc ? parseFloat(excludeInflowOtherDisc) : 0)
        setFieldValue("exclude_inflow_other_disc", excludeInflowOtherDisc ? parseFloat(excludeInflowOtherDisc) : 0)
        values.inflow_other_discount = cashDisc
        values.exclude_inflow_other_disc = excludeInflowOtherDisc
        lfns.computeAllcalc(cashDisc, values, index, setFieldValue, 'inflow_other_discount', mtaxObj, typeOfSale)
    }

    const callInflowInsuranceDiscountCal = (value, values, index, setFieldValue, textFrom) => {
        let cashDisc = value ? parseFloat(value) : 0,
            excludeInflowInsuranceDisc = 0
        let cess = values.CESS_rate ? values.CESS_rate : 0,
            cgst = values.CGST_rate ? values.CGST_rate : 0,
            sgst = values.SGST_rate ? values.SGST_rate : 0,
            igst = values.IGST_rate ? values.IGST_rate : 0
        if (isIntra === true) {
            let taxRate = parseFloat(cess) + parseFloat(cgst) + parseFloat(sgst)
            excludeInflowInsuranceDisc = parseFloat(cashDisc) / (1 + (parseFloat(taxRate) / 100))
        } else {
            let taxRate = parseFloat(cess) + parseFloat(igst)
            excludeInflowInsuranceDisc = parseFloat(cashDisc) / (1 + (parseFloat(taxRate) / 100))
        }
        setInflowInsuranceDisc(excludeInflowInsuranceDisc ? parseFloat(excludeInflowInsuranceDisc) : 0)
        setFieldValue("exclude_inflow_insurance_disc", excludeInflowInsuranceDisc ? parseFloat(excludeInflowInsuranceDisc) : 0)
        values.inflow_insurance_discount = cashDisc
        values.exclude_inflow_insurance_disc = excludeInflowInsuranceDisc
        lfns.computeAllcalc(cashDisc, values, index, setFieldValue, 'inflow_insurance_discount', mtaxObj, typeOfSale)
    }

    const callFocAccDiscountCal = (value, values, index, setFieldValue, textFrom) => {
        let cashDisc = value ? parseFloat(value) : 0,
            excludeFocAccDisc = 0
        let cess = values.CESS_rate ? values.CESS_rate : 0,
            cgst = values.CGST_rate ? values.CGST_rate : 0,
            sgst = values.SGST_rate ? values.SGST_rate : 0,
            igst = values.IGST_rate ? values.IGST_rate : 0
        if (isIntra === true) {
            let taxRate = parseFloat(cess) + parseFloat(cgst) + parseFloat(sgst)
            excludeFocAccDisc = parseFloat(cashDisc) / (1 + (parseFloat(taxRate) / 100))
        } else {
            let taxRate = parseFloat(cess) + parseFloat(igst)
            excludeFocAccDisc = parseFloat(cashDisc) / (1 + (parseFloat(taxRate) / 100))
        }
        setFocAccDisc(excludeFocAccDisc ? parseFloat(excludeFocAccDisc) : 0)
        setFieldValue("exclude_foc_acc_disc", excludeFocAccDisc ? parseFloat(excludeFocAccDisc) : 0)
        values.out_foc_acc = cashDisc
        values.exclude_foc_acc_disc = excludeFocAccDisc
        lfns.computeAllcalc(cashDisc, values, index, setFieldValue, 'out_foc_acc', mtaxObj, typeOfSale)
    }


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
            setShowCustEditIcon(true)
        }
    }

    const editCustomer = (custObjSave, custObj, customer_id) => {
        let data = custObj.filter((item) => item.id === customer_id)
        checkIsAddressSame(data[0], setSameAddCheck)
        setCustomerEditModal(true)
    }
    const finBankPreantCallBack = (values) => {
        dispatch(fetchFinanceBank())
        finBankModalOpen.setFieldValue("finc_bank_id", values.id)
    }

    const createItemPreantCallBack = (response) => {
        let itemObj = (response.data && response.data !== undefined && response.data !== null) ? response.data : ''
        if (itemObj && itemObj !== null && itemObj !== undefined && itemObj !== {}) {
            let values = {
                "srchStr": itemObj.name
            }

            let data = merge({}, userACL.atFetch())
            values.segid = data.segid
            values.cid = data.cid
            if (values.cid !== 0) {
                console.log('values', values)
                dispatch(searchUsedCarItem(values))
            }

        }

    }

    const setThroughUsFunction = (value, setFieldValue, values) => {
        setThroughUs(value)
        if (value === "") {
            setFieldValue("through_us_type", "")
            setFieldValue("fin_sc_id", "")
        }

    }


    const setVehicleDtlsSrchByFunction = (value, setFieldValue, values) => {
        setVhclDtlsSrcBy(value)
        if (value === "") {
            setFieldValue("vhcl_dtls_src_by", "")
        }

    }

    const callCalculationOnChange = (value, values, setFieldValue) => {
        lfns.computeAllcalc(value, values, 0, setFieldValue, 'ex_delivery_date', mtaxObj, typeOfSale)
    }

    const setUsedcarValue = (values, index, setFieldValue) => {
        setUsedCarVal(values.used_car_value)
    }

    const openModelToAddBank = (setFieldValue) => {
        setFinBankModalOpen({ isOpen: true, id: "", setFieldValue: setFieldValue })
    }

    const openModelToCreateItem = (setFieldValue) => {
        setCreateItemModalOpen({ isOpen: true, id: "", setFieldValue: setFieldValue })
    }

    const openModelToEditBank = (setFieldValue) => {
        setFinBankModalOpen({ isOpen: true, id: bankId, setFieldValue: setFieldValue })
    }


    useEffect(() => {
        if (ciformIsSuccessFullySave) {
            if (props.match.path === '/ciform/create') {
                setTimeout(() => {
                    setcustomer_id("")
                    setcustomer_cd("")
                    setCustomer_name("")
                    setCust_email_id("")
                    setCust_mobele_no("")
                    setCust_pan_no("")
                    setCust_gst_no("")
                    setCity("")
                    setPin("")
                    setState("")
                    setContactPerson("")
                    setGstRegtype("")
                    setCountry("")
                    setCust_registration_address("")
                    setCust_permanent_address("")
                    setSalesManagerName("")
                    setTeamLeaderName("")
                    window.scroll(0, 0)
                }, 3500)
            }
        }
    }, [ciformIsSuccessFullySave])

    useEffect(() => {
        if (props.match.path === '/ciform/create') {
            let Acc = ciAcce[0]
            userACL.atCreate(Acc)
            Acc.txn_id = ciform.id
            ciform.accdetails = ciAcce
        }
    })

    useEffect(() => {
        dispatch(fetchCiForm({ "fromDate": todayDate, "toDate": todayDate }))
        dispatch(fetchCustomer())
    }, [])

    useEffect(() => {
        dispatch(getSegmap({ "cid": data.cid }))
    }, [])

    useEffect(() => {
        setFormScroll(true)
        setCustScroll(false)
        setDealScroll(false)
        setVehicalScroll(false)

    }, [])


    useEffect(() => {
        if (props.match.path === '/ciform/edit/:id') {
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
            let sale_type_id = ciform ? ciform.sale_type_id : "";
            if (sale_type_id !== "") {
                setTypeOfSale(saleTypeObj[sale_type_id] ? saleTypeObj[sale_type_id].saletype_name : "")
            }
            let sales_consultant_id = ciform ? ciform.sales_consultant_id : "";
            if (sales_consultant_id != "") {
                setSalesManagerOnEdit(teamleader, ciform, setSalesManagerName, setTeamLeaderName)
            }

            if (vhclDtlsSrcBy && vhclDtlsSrcBy !== null && vhclDtlsSrcBy === "va") {
                let variantObj = {
                    srchStr: listObj.variant,
                };
                variantObj.segid = data.segid;
                variantObj.cid = data.cid;
                dispatch(searchVariant(variantObj))
            }

            let carItem = (listObj.used_car_item && listObj.used_car_item !== undefined && listObj.used_car_item !== null) ? listObj.used_car_item : ''
            if (carItem.length > 2) {
                let values = {
                    "srchStr": carItem
                }

                let data = merge({}, userACL.atFetch())
                values.segid = data.segid
                values.cid = data.cid
                if (values.cid !== 0) {
                    dispatch(searchUsedCarItem(values))
                }

            }
            let accItem = (ciform.accdetails && ciform.accdetails !== undefined && ciform.accdetails !== null) ? ciform.accdetails : []

            if (accItem.length > 0) {
                accItem.map((item, index) => {
                    let values = {
                        "srchStr": item.accessories
                    }
                    let data = merge({}, userACL.atFetch())
                    values.segid = data.segid
                    values.cid = data.cid
                    dispatch(searchAccesoriesItem(values, index))
                })

            }
            if (listObj.used_car_item !== null && listObj.used_car_item !== undefined && listObj.used_car_item !== "") {
                setUsedCarToggle(true)
            }
            if (listObj.used_car_batch !== null && listObj.used_car_batch !== undefined && listObj.used_car_batch !== "") {
                setUsedCarToggle(true)
            }

        }
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
                    setCustomerEditObj(ledObj[0])
                    checkIsAddressSame(ledObj[0], setSameAddCheck)
                    let res = ledObj[0].party ? ledObj[0].party : ""
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
                    setCustomer_name(ledObj[0].ledger_name === "None" ? "" : ledObj[0].ledger_name)
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
        ///////////////
    }, [vinObj, saleTypeObj])

    useEffect(() => {
        let cashDisc = focAccTotal ? parseFloat(focAccTotal) : 0,
            excludeFocAccDisc = 0
        let cess = totalValue.CESS_rate ? totalValue.CESS_rate : 0,
            cgst = totalValue.CGST_rate ? totalValue.CGST_rate : 0,
            sgst = totalValue.SGST_rate ? totalValue.SGST_rate : 0,
            igst = totalValue.IGST_rate ? totalValue.IGST_rate : 0
        if (isIntra === true) {
            let taxRate = parseFloat(cess) + parseFloat(cgst) + parseFloat(sgst)
            excludeFocAccDisc = parseFloat(cashDisc) / (1 + (parseFloat(taxRate) / 100))
        } else {
            let taxRate = parseFloat(cess) + parseFloat(igst)
            excludeFocAccDisc = parseFloat(cashDisc) / (1 + (parseFloat(taxRate) / 100))
        }
        setFocAccDisc(excludeFocAccDisc ? parseFloat(excludeFocAccDisc) : 0)
    }, [focAccTotal])



    const closeStockModalPopup = () => {
        setStockModal({ open: false, msg: "" })
    }

    // console.log('usedCarToggle', usedCarToggle)
    const setUsedCarToggleFunc = (checked, setFieldValue) => {
        if (checked === true) {
            setUsedCarToggle(true)
        } else {
            setUsedCarToggle(false)
            setFieldValue("used_car_item", "")
            setFieldValue("used_car_batch", "")
        }
    }

    const handleKeyDownOnFields = (event) => {
        if (event.altKey && event.code === "KeyC") {
            if (isFocusOnUsedCarItem) {
                setCreateItemModalOpen({ isOpen: true, id: "", setFieldValue: "" })
            }
            if (isFocusOnCustomer) {
                setCustomerModal(true)
            }
        }
        if (event.code === "F2") {
            scrollForm()
        }

    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDownOnFields);

        return () => {
            document.removeEventListener("keydown", handleKeyDownOnFields);
        };
    }, [isFocusOnUsedCarItem]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDownOnFields);

        return () => {
            document.removeEventListener("keydown", handleKeyDownOnFields);
        };
    }, [isFocusOnCustomer]);

    const onFocusOnUsedCarItem = () => {
        setIsFocusOnUsedCarItem(true)
    }

    const onBlurOnUsedCarItem = () => {
        setIsFocusOnUsedCarItem(false)
    }

    const onFocusOnCustomer = () => {
        setIsFocusOnCustomer(true)
    }

    const onBlurOnCustomer = () => {
        setIsFocusOnCustomer(false)
    }


    const setNomineeAgeFunction = (value, values, setFieldValue) => {
        let age = calculateAgeFromDob(value)
        if (value !== "") {
            setFieldValue("nominee_age", age)
        } else {
            setFieldValue("nominee_age", 0)
        }

    }

    return (
        <Container>
            <Header as='h2' textAlign='center'>{params.title}</Header>
            <Formik
                initialValues={ciform}
                // validationSchema={ciformSchema}
                onSubmit={(values, { resetForm }) => savedCiForm(values, resetForm)}
                render={({ handleSubmit, onChange, values, resetForm, handleChange, errors, setFieldValue, }) => (
                    <Grid>
                        <Grid.Column width={3}>
                            <Table className='ciFormMenu'>
                                <Table.Body>
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

                            <Form as={FormikForm} size="small" onSubmit={handleSubmit} className='ciform' >

                                <div ref={formDetails} className={form ? 'paddingTop' : null} id='form' >
                                    <Header as='h3' className='headerBlue' >Form Details</Header>
                                    <Form.Group widths={3} className='headerGap'>
                                        <FormTypeSelect name='form_type_id' label='Form Type' isSelection={true} setData={setFormNumber} />
                                        <Field name='location' component={FormikInputComponent} label='Location' readOnly={true} value={showSegName || ""} className='sales_manager_name' />
                                        <Field name='ci_form_date' label='Date' isMandatory={true} component={FormikDateComponent} />
                                    </Form.Group>

                                    <Form.Group widths={3}>
                                        {isAutoVnum ?
                                            <Field name='form_no' component={FormikInputComponent} label='Form No' backgroundColor={true} readOnly={true} className="vnumGet" />
                                            :
                                            <Field name='form_no' component={FormikInputComponent} label='Form No' backgroundColor={true} />
                                        }

                                        <Field name='booking_date' label={bookingDateError ? "Booking Date Required" : 'Booking Date'} isMandatory={true} isError={bookingDateError} component={FormikDateComponent} isTxn={false} />
                                        <Field name='ex_delivery_date' label={expectedDateError ? 'Expected Delivery Date Required' : 'Expected Delivery Date'} isError={expectedDateError} isMandatory={true} component={FormikDateComponent} isTxn={false} extraCall={callCalculationOnChange} />
                                    </Form.Group>

                                    <Form.Group widths={3}>
                                        <SalesConsultantSelect name='sales_consultant_id' label='Sales Consultant' isTxn='false' isSelection={true} setData={setSalesManager} />
                                        <Field name='team_leader_name' component={FormikInputComponent} label='Team Leader' readOnly={true} value={teamLeaderName || ""} className='sales_manager_name' />
                                        <Field name='sales_manager_name' component={FormikInputComponent} label='Sales Manager' readOnly={true} value={salesmanagerName || ""} className='sales_manager_name' />
                                        <Field name='sales_manager_id' component={FormikHiddenInputComponent} label='Sales Manager' />
                                    </Form.Group>

                                    <Form.Group widths={3} className='headerGapDown'>
                                        <LeadSourceSelect name='lead_source_id' label='Lead Source' isSelection={true} isTxn='false' setOnCall={setLeadSrcId} />
                                        <Field name='lead_source_person' component={FormikInputComponent} label='Lead Source Name' />
                                        <SaleTypeSelect name='sale_type_id' label={saleTypeError ? 'Type Of Sale Required' : 'Type Of Sale'} isError={saleTypeError} isMandatory={true} isSelection={true} setOnCall={setTypeOfSale} setOnCall2={setTypeOfSaleId} />
                                        {/* <Field component={FormikDisplayLabelComponent} isLabel={false} label='Location' text={showSegName ? showSegName : ''} /> */}
                                    </Form.Group>
                                    <Form.Group widths={3} className='headerGapDown'>
                                        <Field name='lead_source_pan' component={FormikInputComponent} label={leadSrcError ? 'Lead Source PAN (Min 10 Char Needed)' : 'Lead Source PAN'} isError={leadSrcError} />
                                    </Form.Group>
                                </div>


                                <div ref={customer} className='paddingTop' id='customer' >
                                    <Header as='h3' className='headerBlue'>Customer Details</Header><br />
                                    {/* <Button type="button" basic color='green' size='small' onClick={() => { setCustomerModal(true) }} >New Customer</Button> */}
                                    <Form.Group widths={3} className='custHeaderGap'>
                                        <CustomerSearch name='customer_id'
                                            setvalue={customer_id}
                                            setChange={setcustomer_id}
                                            label={custIdError ? 'Customer Name Required' : 'Customer Name'}
                                            isError={custIdError}
                                            isMandatory={true}
                                            sefFocus={true} placeholder='Search Customer'
                                            isLabel={false} getValue={setCustObj} isTxn={true} isSelection={true}
                                            onBlurCall={onBlurOnCustomer}
                                            onFocusCall={onFocusOnCustomer}

                                        />
                                        {
                                            (showCustEditIcon || props.match.path === '/ciform/edit/:id') ?
                                                <Icon name='edit' color='blue' className='editCustomer' onClick={() => { editCustomer(custObjSave, custObj, customer_id) }} />
                                                : null
                                        }
                                        <Field
                                            name='customer_dob'
                                            label='Date of Birth'
                                            component={FormikDateComponent}
                                            isTxn={false}
                                            placeholder="Date of Birth"
                                        />

                                        <Field
                                            name='customer_cd'
                                            value={customer_cd || ""}
                                            defaultValue={customer_cd || ""}
                                            onChange={(e) => setcustomer_cd(e.target.value)}
                                            component={FormikInputComponent}
                                            label='Customer ID'
                                            readOnly={true}
                                            className='cust_id'
                                            setFieldValueM={customer_cd || ""}
                                        />
                                        <Field
                                            name='customer_name'
                                            value={customer_name || ""}
                                            defaultValue={customer_name || ""}
                                            onChange={(e) => setCustomer_name(e.target.value)}
                                            component={FormikHiddenInputComponent}
                                            readOnly={true}
                                            setFieldValueM={customer_name || ""}
                                        />

                                    </Form.Group>
                                    <p className='createCutomer' onClick={() => { setCustomerModal(true) }}>Create Customer Alt+C</p>
                                    <Form.Group widths={3}>
                                        <Field
                                            name='cust_email_id'
                                            defaultValue={cust_email_id ? cust_email_id || '' : ""}
                                            value={cust_email_id || ""}
                                            onChange={(e) => setCust_email_id(e.target.value)}
                                            component={FormikInputComponent}
                                            label='Email ID'
                                            readOnly={true}
                                            className='cust_email'
                                            setFieldValueM={cust_email_id || ""}
                                        />
                                        <Field
                                            name='cust_mobele_no'
                                            defaultValue={cust_mobele_no ? cust_mobele_no || '' : ""}
                                            value={cust_mobele_no || ""}
                                            onChange={(e) => setCust_mobele_no(e.target.value)}
                                            component={FormikInputComponent}
                                            label='Mobile No'
                                            readOnly={true}
                                            className='cust_mobile'
                                            setFieldValueM={cust_mobele_no || ""}
                                        />
                                        <Field
                                            name='contact_person'
                                            defaultValue={contact_person ? contact_person || '' : ""}
                                            value={contact_person || ""}
                                            onChange={(e) => setContactPerson(e.target.value)}
                                            component={FormikInputComponent}
                                            label='Contact Person'
                                            readOnly={true}
                                            className='cust_mobile'
                                            setFieldValueM={contact_person || ""}
                                        />

                                    </Form.Group>
                                    <Form.Group widths={3}>
                                        <Field name='gst_reg_type'
                                            defaultValue={gstRegtype || ''}
                                            value={gstRegtype || ""}
                                            onChange={(e) => setGstRegtype(e.target.value)}
                                            component={FormikInputComponent}
                                            label='GST Registration Type'
                                            readOnly={true}
                                            className='cust_pan'
                                            setFieldValueM={gstRegtype || ""}
                                        />
                                        <Field name='cust_gst_no'
                                            defaultValue={cust_gst_no || ''}
                                            value={cust_gst_no || ""}
                                            onChange={(e) => setCust_gst_no(e.target.value)}
                                            component={FormikInputComponent}
                                            label='GST No'
                                            readOnly={true}
                                            className='cust_gst'
                                            setFieldValueM={cust_gst_no || ""}
                                        />
                                        <Field name='cust_pan_no'
                                            defaultValue={cust_pan_no || ''}
                                            value={cust_pan_no || ""}
                                            onChange={(e) => setCust_pan_no(e.target.value)}
                                            component={FormikInputComponent}
                                            label='PAN No'
                                            readOnly={true}
                                            className='cust_pan'
                                            setFieldValueM={cust_pan_no || ""}
                                        />

                                    </Form.Group>
                                    <Form.Group widths={3}>
                                        <Field
                                            name='city'
                                            defaultValue={city ? city || '' : ""}
                                            value={city || ""}
                                            onChange={(e) => setCity(e.target.value)}
                                            component={FormikInputComponent}
                                            label='City'
                                            readOnly={true}
                                            className='cust_mobile'
                                            setFieldValueM={city || ""}
                                        />
                                        <Field name='pin'
                                            defaultValue={pin || ''}
                                            value={pin || ""}
                                            onChange={(e) => setPin(e.target.value)}
                                            component={FormikInputComponent}
                                            label='Pin'
                                            readOnly={true}
                                            className='cust_pan'
                                            setFieldValueM={pin || ""}
                                        />
                                        <Field name='state'
                                            defaultValue={state || ''}
                                            value={state || ""}
                                            onChange={(e) => setState(e.target.value)}
                                            component={FormikInputComponent}
                                            label='State'
                                            readOnly={true}
                                            isMandatory={true}
                                            className='cust_gst'
                                            setFieldValueM={state || ""}
                                        />

                                    </Form.Group>
                                    <Form.Group widths={3} className='headerGapDown'>
                                        <Field name="cust_registration_address"
                                            setvalue={cust_registration_address || ""}
                                            setChange={setCust_registration_address}
                                            readOnly={true}
                                            background={true}
                                            component={FormikTextAreaComponent} userProps={{ maxLength: 150, displayCount: true, height: 4 }} label='Registration Address' focus={true} />
                                        <Field name='cust_permanent_address'
                                            setvalue={cust_permanent_address || ""}
                                            setChange={setCust_permanent_address}
                                            readOnly={true}
                                            background={true}
                                            component={FormikTextAreaComponent} userProps={{ maxLength: 250, displayCount: true, height: 4 }} label='Permanant Address' focus={true} />

                                        <Field name='country'
                                            defaultValue={country || ''}
                                            value={country || ""}
                                            onChange={(e) => setCountry(e.target.value)}
                                            component={FormikInputComponent}
                                            label='Country'
                                            readOnly={true}
                                            isMandatory={true}
                                            className='cust_gst'
                                            setFieldValueM={country || ""}
                                        />


                                    </Form.Group>
                                </div>

                                <div ref={vehical} className='paddingTop' id='vehical'>
                                    <Header as='h3' className='headerBlue'  >Vehicle Details</Header>
                                    <Form.Group widths={3} className='headerGap'>
                                        <VehicalDetailsSearchBySelect name='vhcl_dtls_src_by' label='Vehicle Details Search By' placeholder="Select" isSelection={true} isTxn='false' setOnCall={setVehicleDtlsSrchByFunction} />
                                    </Form.Group>
                                    <Form.Group widths={3} className='headerGa'>
                                        {/* <Field name='vin_no' component={FormikInputComponent} label='VIN No' isMandatory={true} /> */}
                                        <VinSearch name='vin_on' label={vinNoError ? 'Chassis/VIN No. Required' : 'Chassis/VIN No.'} isError={vinNoError} isMandatory={true} sefFocus={true} placeholder='Search Chassis/VIN No' isLabel={false} fullData={values} getValue={setVinObj} isTxn={true} isSelection={true} vinOptByItemBatch={vinOptByItemBatch} />
                                        <Field name='model_no' component={FormikInputComponent} label='Model' className='model_no' readOnly={true} />
                                        <Field name='colour' component={FormikInputComponent} label='Color' className='color' readOnly={true} />
                                    </Form.Group>
                                    <Form.Group widths={3} className='headerGapDown' readOnly={true}>
                                        {
                                            (vhclDtlsSrcBy && vhclDtlsSrcBy !== null && vhclDtlsSrcBy === "va") ?
                                                <VariantSearch name='variant' label='Variant' sefFocus={true} placeholder='Search Model' isLabel={false} isTxn={true} isSelection={true} getValue={variantSetFunction} />
                                                :
                                                <Field name='variant' component={FormikInputComponent} label='Variant' className='variant' readOnly={true} />

                                        }

                                        <Field name='engine_no' component={FormikInputComponent} label='Engine No.' className='engine_no' readOnly={true} />
                                        <FuelTypeSelect name='fuel_type' label='Fuel Type' isSelection={true} isTxn='false' />
                                    </Form.Group>
                                </div>

                                <div ref={final} className='paddingTop' id='final'>
                                    <Header as='h3' className='headerBlue' >Final Deal Details</Header>
                                    <div ref={inflow} id='inflow' className='headerGap'  >
                                        <Header style={{ color: '#606060', fontSize: '16px' }} >Inflow Amount</Header>
                                        <Form.Group widths={4} className='headerGap'>
                                            <Field name='purchase_basic' label='Purchase Basic' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} background={true} readOnly={true} textFrom='purchase_basic' />
                                            <Field name='invoice_amt' component={FormikAmountComponent} label='Invoice Amount' readOnly={true} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} background={true} textFrom='invoice_amt' />
                                            <Field name='ex_showroom' component={FormikAmountComponent} label='EX Show Room' readOnly={true} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} background={true} textFrom='ex_showroom' />
                                            <Field name='ex_showroom_without_gst' label='EX Show Room Without GST' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='ex_showroom_without_gst' background={true} readOnly={true} />
                                        </Form.Group>
                                        <Form.Group widths={4}>
                                            {/* <Field name='ex_showroom_without_gst_new' label='EX Show Room (Excl. GST & Disc.)' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='ex_showroom_without_gst_new' addTextBelow={'Price List: ' + (priceListAmt ? displayAmtInLakh(priceListAmt) : '0.00')} /> */}
                                            <Field name='ex_shrm_wo_gst_n_disc' label='EX Show Room (Excl. GST & Disc.)' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='ex_shrm_wo_gst_n_disc' addTextBelow={'Price List: ' + (priceListAmt ? displayAmtInLakh(priceListAmt) : '0.00')} />
                                            <Field name='tcs' component={FormikAmountComponent} label='TCS' compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='tcs' readOnly={true} background={true} />
                                            <Field name='sot' component={FormikAmountComponent} label='AMC Plan' compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='sot' />
                                            <Field name='insurance' label='Insurance' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='insurance' />
                                        </Form.Group>
                                        <Form.Group widths={4}>
                                            {
                                                values.isMtaxChecked === true ?
                                                    <Checkbox className='mtaxCheckbox' checked={true} onClick={(e, { checked }) => callAndSetCheckBox(e, { checked }, values.m_tax, setFieldValue, values)} />
                                                    :
                                                    <Checkbox className='mtaxCheckbox' checked={false} onClick={(e, { checked }) => callAndSetCheckBox(e, { checked }, values.m_tax, setFieldValue, values)} />
                                            }

                                            <Field name='m_tax' label='M-TAX' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='m_tax' readOnly={true} background={true} />
                                            <Field name='passing_charges' label='Passing Charges' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='passing_charges' />
                                            <Field name='hypothecation_charges' label='Hypothecation Charges' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='hypothecation_charges' />
                                            <Field name='paid_acc' label='Paid Accessories' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='paid_acc' readOnly={true} background={true} />
                                        </Form.Group>
                                        <Form.Group widths={4}>
                                            <Field name='rsa' label='RSA' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='rsa' />
                                            <Field name='basic_kit' label='Basic Kit' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='basic_kit' />
                                            {
                                                typeOfSale === "CSD" ?
                                                    <Field name='price_diff' label='Price Difference' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='price_diff' />
                                                    : <Field name='price_diff' label='Price Difference' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='price_diff' />
                                            }
                                            <Field name='rto' label='RTO' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='rto' readOnly={true} background={true} />
                                        </Form.Group>
                                        <Form.Group widths={4}>
                                            <Field name='others_1' label='Others 1' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='others_1' />
                                            <Field name='others_2' label='Others 2' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='others_2' />
                                            <Field name='others_3' label='Others 3' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='others_3' />
                                            <Field name='others_4' label='Others 4' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='others_4' />
                                        </Form.Group>
                                        <Form.Group widths={4} >
                                            <Field name='hsrp' label='HSRP' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='hsrp' />
                                            <Field name='fastag' label='Fastag' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='fastag' />
                                            <Field name='ex_warranty' label='Ex-Warranty' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='ex_warranty' />
                                            {
                                                <Icon name='calculator' size='large' color='blue' className='calculatorOnCashDisc' onClick={() => setCalculatorOpen(!calculatorOpen)} />

                                            }
                                            {
                                                calculatorOpen ? <CalculatorComponent setCalculatorOpen={setCalculatorOpen} /> : null
                                            }

                                            <Field name='out_cash_disc' label='Cash Discount' component={FormikAmountComponent} compute={callCashDiscountCal} addTextBelow={'Excl. Tax: ' + (exCashDisc ? displayAmtInLakh(exCashDisc) : '0.00')} textFrom='out_cash_disc' />
                                        </Form.Group>
                                        <Form.Group widths={4} >

                                            <Field name='inflow_other_discount' label='Other Discount' component={FormikAmountComponent} compute={callInflowOtherDiscountCal} addTextBelow={'Excl. Tax: ' + (inflowOtherDisc ? displayAmtInLakh(inflowOtherDisc) : '0.00')} textFrom='inflow_other_discount' />
                                            {/* <Field name='inflow_insurance_discount' label='Insurance Discount' component={FormikAmountComponent} compute={callInflowInsuranceDiscountCal} addTextBelow={'Excl. Tax: ' + (inflowInsuranceDisc ? displayAmtInLakh(inflowInsuranceDisc) : '0.00')} textFrom='inflow_insurance_discount' /> */}
                                            {/* <Field name='out_foc_acc' label='FOC Accessories' component={FormikAmountComponent} compute={callFocAccDiscountCal} extraobj={mtaxObj} textFrom='out_foc_acc' readOnly={true} background={true} addTextBelow={'Excl. Tax: ' + (focAccDisc ? displayAmtInLakh(focAccDisc) : '0.00')} /> */}
                                            {setFocAccTotal(values.out_foc_acc)}
                                            {setTotalValue(values)}
                                            <Field name='on_road' label='On Road' component={FormikAmountComponent} readOnly={true} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} background={true} textFrom='on_road' />
                                        </Form.Group>
                                    </div>
                                    <div ref={outflow} className='headerGap' >
                                        <Header style={{ color: '#606060', fontSize: '16px' }}>Additional Details (Inflow)</Header>
                                        <Form.Group widths={4} className='headerGap'>
                                            <Field name='outflw_insb4_discount' label='Insurance Before Discount' component={FormikAmountComponent} />
                                        </Form.Group>
                                    </div>
                                    <div ref={outflow} className='headerGap' >
                                        <Header style={{ color: '#606060', fontSize: '16px' }}>Outflow Amount</Header>
                                        <Form.Group widths={4} className='headerGap'>
                                            <Field name='used_car_value' label='Used Car Value' component={FormikAmountComponent} compute={lfns.computeAllcalc} computeTwo={setUsedcarValue} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='used_car_value' />
                                            {leadSrc === 'DSA' ? <Field name='out_brokerage' label='Brokerage' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='out_brokerage' />
                                                : <Field name='out_brokerage' label='Brokerage' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='out_brokerage' />
                                            }
                                            <Field name='inflow_loyalty_discount' label='Loyalty Discount' component={FormikAmountComponent} compute={lfns.computeAllcalc} computeTwo={setUsedcarValue} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='inflow_loyalty_discount' />
                                            <Field name='out_exchange_disc' label='Exchange Discount' component={FormikAmountComponent} compute={lfns.computeAllcalc} computeTwo={setUsedcarValue} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='out_exchange_disc' />
                                        </Form.Group>
                                        <Form.Group widths={4} className='headerGap'>
                                            <Field name='inflow_corporate_discount' label='Corporate Discount' component={FormikAmountComponent} compute={callInflowCorporateDiscountCal} textFrom='inflow_corporate_discount' />
                                            <Field name='outflw_adsnl_discount' label='Additional Discount' component={FormikAmountComponent} compute={lfns.computeAllcalc} computeTwo={setUsedcarValue} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='outflw_adsnl_discount' />
                                            <Field name="remarks" component={FormikTextAreaComponent} userProps={{ maxLength: 200, displayCount: true, height: 3 }} label='Remarks' focus={true} />
                                        </Form.Group>
                                    </div>
                                    <div ref={usedCarAddDetails} className='headerGap' >
                                        <Header style={{ color: '#606060', fontSize: '16px', paddingBottom: "10px" }}>Used Car Additional Details
                                            {
                                                ciform ?
                                                    ciform.used_car_item || ciform.used_car_batch ?
                                                        <span style={{ marginLeft: "10px", top: "5px", position: "relative" }}> <Checkbox defaultChecked={true} toggle onClick={(e, { checked }) => setUsedCarToggleFunc(checked, setFieldValue)} /> </span>
                                                        :
                                                        <span style={{ marginLeft: "10px", top: "5px", position: "relative" }}> <Checkbox toggle onClick={(e, { checked }) => setUsedCarToggleFunc(checked, setFieldValue)} /> </span>
                                                    :
                                                    null
                                            }

                                        </Header>
                                        {/* {usedCarToggle ?
                                            <Button size='tiny' type="button" basic color='green' onClick={() => openModelToCreateItem(setFieldValue)} >New Item</Button>
                                            :
                                            null} */}
                                        <Form.Group widths={2} className='headerGap'>
                                            {usedCarToggle ?
                                                <>
                                                    <UsedCarItemSearch name='used_car_item' label='Used Car Item' sefFocus={true} placeholder='Search Item' isLabel={false} isTxn={true} isSelection={true} onBlurCall={onBlurOnUsedCarItem} onFocusCall={onFocusOnUsedCarItem} />
                                                    <Field name='used_car_batch' label='Used Car Batch' component={FormikInputComponent} boxwidth={'75%'} />

                                                </> : null
                                            }


                                        </Form.Group>
                                        {usedCarToggle ?
                                            <p className='createItem' onClick={() => openModelToCreateItem(setFieldValue)}>Create Item Alt+C</p> :
                                            null}
                                    </div>
                                    <div ref={support} id='support' className='headerGap'>
                                        <Header style={{ color: '#606060', fontSize: '16px' }}>Support Amount</Header>
                                        <Form.Group widths={4} className='headerGap'>
                                            <Field name='exchange_discount' label='Exchange' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='exchange_discount' />
                                            <Field name='corporate_discount' label='Corporate' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='corporate_discount' />
                                            <Field name='loyalty_discount' label='Loyalty' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='loyalty_discount' />
                                            <Field name='warranty_discount' label='Warranty' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='warranty_discount' />
                                        </Form.Group>
                                        <Form.Group widths={4} className='headerGapDown'>
                                            <Field name='retail_support_discount' label='Retail Support' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='retail_support_discount' />
                                            <Field name='rsa_discount' label='RSA' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='rsa_discount' />
                                            <Field name='insurance_discount' label='Insurance' component={FormikAmountComponent} compute={lfns.computeAllcalc} extraobj={mtaxObj} extraValue={typeOfSale} textFrom='insurance_discount' />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div ref={summary} className='paddingTop' id='summary'>
                                    <Header as='h3' className='headerBlue'>Summary Details</Header>
                                    <Form.Group widths={4} className='headerGap'>
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='INFLOW / ON ROAD' classExtra={"topExtra"} text={values.summaryInflow ? displayAmtInLakh(values.summaryInflow) : '-'} />
                                        <Field component={FormikDisplayLabelComponent} isLabel={false} label='Receivable' classExtra={"topExtra"} text={values.summaryRecivable ? displayAmtInLakh(values.summaryRecivable) : '-'} />
                                    </Form.Group>
                                </div>

                                <div ref={nominee} className='paddingTop'>
                                    <Header as='h3' className='headerBlue'>Nominee Details</Header>
                                    <Form.Group widths={3} className='headerGap'>
                                        <Field name='nominee_name' label={nomineeError ? 'Nominee Name Require' : 'Nominee Name'} isError={nomineeError} isMandatory={true} component={FormikInputComponent} />
                                        <Field name='nominee_relationship' label='Nominee Relationship' component={FormikInputComponent} />
                                        <Field name='nominee_dob' label='Nominee D.O.B' component={FormikDateComponent} callOnBlur={setNomineeAgeFunction} addTextBelow={'Nominee Age: ' + (values.nominee_age ? values.nominee_age : "")} isTxn={false} />
                                        {/* <Field name='nominee_age' label='Nominee Age' component={FormikAmountComponent} isTxn={false} /> */}
                                    </Form.Group>
                                </div>

                                <div ref={finance} className='paddingAcc' >
                                    <Header as='h3' className='headerBlue'>Finance Details</Header>
                                    <Form.Group widths={3} className='headerGap'>
                                        <ThroughUsSelect name='through_us' label='In House / Self / Cash' isSelection={true} isTxn='false' setOnCall={setThroughUsFunction} />
                                        {
                                            values.finc_bank_id === "" ? <Icon name='add' color='blue' className='addBankName' onClick={() => openModelToAddBank(setFieldValue)} />
                                                :
                                                <Icon name='edit' color='blue' className='editBankName' onClick={() => openModelToEditBank(setFieldValue)} />
                                        }

                                        <FinanceBankSelect name='finc_bank_id' label='Bank Name' isSelection={true} setOnCall={setBankId} />
                                        <Field name='finc_branch_name' label='Branch Name' component={FormikInputComponent} />
                                    </Form.Group>
                                    <Form.Group widths={3}>
                                        <Field name='loan_amount' label='Loan Amount' component={FormikAmountComponent} />
                                        {throughUs === "INH" || throughUs === "SEL" || throughUs === "inh" || throughUs === "sel" ?
                                            <>
                                                <FinanceConsultantSelect name='fin_sc_id' label='Finance Consultant' isSelection={true} />
                                                <ThroughUsTypeSelect name='through_us_type' label='Type' isSelection={true} isTxn='false' />
                                            </>
                                            :
                                            null
                                        }
                                        {throughUs === "CAS" || throughUs === "cas" ?
                                            <ThroughUsTypeSelect name='through_us_type' label='Type' isSelection={true} isTxn='false' />
                                            :
                                            null
                                        }
                                    </Form.Group>


                                </div>

                                <div ref={accessories} className='paddingAcc'>
                                    <Header as='h3' className='headerBlue'>Accessories Details</Header>
                                    <Form.Group widths={3}>
                                        <FieldArray name='accdetails' component={AccessoriesArray} />
                                    </Form.Group>
                                </div>
                                <Button type="submit" size="medium" color="blue" className="CustomeBTN headerGapDown"  >Submit</Button>
                                <>
                                    {ciFormDataId ?
                                        <CiFormPrintOnSave ciFormDataId={ciFormDataId} priceListAmt={priceListAmt
                                        } setCiFormDataId={setCiFormDataId} history={props.history} pageType={props.match.path === '/ciform/create' ? 'entry' : 'edit'} />
                                        : null
                                    }
                                </>
                                {savedCiFormId ?
                                    <Notification id={savedCiFormId} resetForm={resetForm} notifySelector={getNotification} notifyDoneAction={setNotifyDone} setCiFormDataId={setCiFormDataId} type='save' />
                                    :
                                    null}
                            </Form>
                        </Grid.Column>
                    </Grid>
                )}
            />
            <Modal size='fullscreen' open={customerModal} onClose={() => setCustomerModal(false)} >
                <Modal.Header>Create New Customer <Button basic color='red' floated='right' onClick={() => setCustomerModal(false)}>Close</Button></Modal.Header>
                <Modal.Content>
                    <CustomerForm
                        setCustomerModal={setCustomerModal}
                        preantCallBack={preantCallBack}
                        setErrorAlert={setErrorAlert}
                    />
                </Modal.Content>
            </Modal>
            <Modal size='fullscreen' open={customerEditModal} onClose={() => setCustomerEditModal(false)} >
                <Modal.Header>Update Customer <Button basic color='red' floated='right' onClick={() => setCustomerEditModal(false)}>Close</Button></Modal.Header>
                <Modal.Content>
                    <CustomerEditForm
                        customerEditObj={customerEditObj}
                        sameAddCheck={sameAddCheck}
                        setCustomerEditModal={setCustomerEditModal}
                        preantCallBack={preantCallBack}
                        setErrorAlert={setErrorAlert}
                    />
                </Modal.Content>
            </Modal>
            <Modal size='small' open={finBankModalOpen.isOpen} onClose={() => setFinBankModalOpen({ isOpen: false, id: "", setFieldValue: "" })} >
                <Modal.Header>{bankId === "" ? "Create New Finance Bank" : "Update Finance Bank"} <Button basic color='red' floated='right' onClick={() => setFinBankModalOpen({ isOpen: false, id: "", setFieldValue: "" })}>Close</Button> </Modal.Header>
                <Modal.Content>
                    <FinanceBankForm
                        setFinBankModalOpen={setFinBankModalOpen}
                        id={bankId}
                        setBankId={setBankId}
                        finBankPreantCallBack={finBankPreantCallBack}
                        setErrorAlert={setErrorAlert}
                    />
                </Modal.Content>
            </Modal>
            <Modal size='small' open={createItemModalOpen.isOpen} onClose={() => setCreateItemModalOpen({ isOpen: false, id: "", setFieldValue: "" })} >
                <Modal.Header>Create Item<Button size='tiny' basic color='red' floated='right' onClick={() => setCreateItemModalOpen({ isOpen: false, id: "", setFieldValue: "" })}>Close</Button> </Modal.Header>
                <Modal.Content>
                    <CreateItemForm
                        setCreateItemModalOpen={setCreateItemModalOpen}
                        createItemPreantCallBack={createItemPreantCallBack}
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
            <Modal size='mini' open={ageCalculatorOpen} onClose={() => setAgeCalculatorOpen(false)} >
                <Modal.Header>Age Calculator<Button size='tiny' basic color='red' floated='right' onClick={() => setAgeCalculatorOpen(false)}>Close</Button> </Modal.Header>
                <Modal.Content>
                    <AgeCalculator
                        setAgeCalculatorOpen={setAgeCalculatorOpen}
                    />
                </Modal.Content>
            </Modal>
            <Modal open={stockModal.open} size="mini" onClose={() => closeStockModalPopup()}>
                <Modal.Header>Batch Stock Info</Modal.Header>
                <Modal.Content>
                    <p>Stock is not Availabel for this Selected Batch</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type="button" color='red' onClick={() => closeStockModalPopup()}>Close</Button>
                </Modal.Actions>
            </Modal>
            {/* <Modal open={itemBatchModal.open} size="mini" onClose={() => setItemBatchModal({ open: false, msg: "" })}>
                <Modal.Header>Item Batch Info</Modal.Header>
                <Modal.Content>
                    <p>Vin No is Not Availabel for this seleted batch</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type="button" inverted color='red' onClick={() => setItemBatchModal({ open: false, msg: "" })}>Close</Button>
                </Modal.Actions>
            </Modal> */}
        </Container>
    )
}

export default CiForm;