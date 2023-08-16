import * as Yup from 'yup'
import { v4 } from 'uuid'
import moment from 'moment'
import { merge, debounce } from 'lodash'
import axios from 'axios'
import { VEHICAL_URL } from '../../../store/path'
import userACL from '../../../store/access'


export const customer = () => ({
    id: v4(),
    customerCd: null,
    customerName: "",
    registration_address: null,
    permanent_address: null,
    pan_no: null,
    gst_no: "",
    email_id: null,
    pin: null,
    city: null,
    state: null,
    mobile: null,
    contact_person: null,
    gst_reg_type: null,
    country: 'India',
    pa_city: null,
    pa_pin: null,
    pa_state: null,
    pa_country: 'India',
    res_permanent: "n",
    government_agency: "n",
    first_vehicle: "n",
    address_verification: "n",
    permit_required: "n",
    status: "1",
    segid: "",
    cid: "",
    dt_create: moment().format("YYYY-MM-DD"),
    dt_update: moment().format("YYYY-MM-DD"),
    uid_create: "",
    uid_update: "",
})

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const customerSchema = Yup.object({
    id: Yup.string().required('This (Required Field)'),
    customerCd: Yup.string()
        .min(3, 'Customer Id (Min 3 Characters Needed)')
        .max(45, 'Customer Id (Max 45 Characters allowed)')
        .nullable(),
    customerName: Yup.string()
        .min(3, 'Customer Name (Min 3 Characters Needed)')
        .max(200, 'Customer Name (Max 200 Characters allowed)')
        .required('Customer Name (Required Field)'),
    country: Yup.string()
        .required('Registration Country (Required)')
        .nullable(),
    state: Yup.string()
        .required('Registration State (Required)')
        .nullable(),
    pa_country: Yup.string()
        .required('Permanent Country (Required)')
        .nullable(),
    gst_reg_type: Yup.string()
        .required('GST Registration Type (Required)')
        .nullable(),
    pa_state: Yup.string()
        .required('Permanent State (Required)')
        .nullable(),
    pan_no: Yup.string()
        .min(10, 'PAN NO (Min 10 Characters Needed)')
        .max(10, 'PAN NO (Max 10 Characters allowed)')
        .nullable(),
    gst_no: Yup.string()
        .min(15, 'GST NO (Min 15 Characters Needed)')
        .max(15, 'GST NO (Max 15 Characters allowed)')
        .nullable(),
    email_id: Yup.string().email().nullable(),
    mobile: Yup.string().matches(phoneRegExp, 'Mobile number is not valid')
        .min(10, 'Mobile NO (Min 10 Characters Needed)')
        .max(10, 'Mobile NO (Max 10 Characters allowed)')
        .nullable(),
    status: Yup.number().integer().nullable(),
    segid: Yup.string().nullable(),
    cid: Yup.string().nullable(),
    txnid: Yup.string().nullable(),
    dt_create: Yup.string().nullable(),
    dt_update: Yup.string().nullable(),
    uid_create: Yup.string().nullable(),
    uid_update: Yup.string().nullable()
})

export const duplicateCheckCustomer = debounce(checkCustomer, 800)


function checkCustomer(value, values) {
    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.cid
    obj.customerCd = values.customerCd
    obj.customerName = values.customerName

    if (value && value !== null && value !== undefined && value !== "" && value.length > 2)
        return axios.post(VEHICAL_URL + '/customer/exists-check', obj)
            .then(response => {
                if (response.data === "duplicate") {
                    return "Duplicate"
                }

            })
            .catch(error => console.log(error))

}

export const saveCustomerNext = debounce(saveCustomerNextWait, 800)
function saveCustomerNextWait(values, setCustomerModal, setErrorAlert, preantCallBack, resetForm) {
    return axios.post(VEHICAL_URL + '/customer/add', values)
        .then(response => {
            if (response.data.type === "success" || response.data.type === "Success") {
                setErrorAlert({ isOpen: true, type: "Success", msg: response.data.msg })
                resetForm()
                setCustomerModal(false)
                preantCallBack(response.data.data)
            } else {
                let msgG = response.data.msg
                let getMsg = (typeof msgG === 'string' || msgG instanceof String) ? response.data.msg : response.data.msg.msg
                setErrorAlert({ isOpen: true, type: "Error", msg: getMsg })
            }
        })
        .catch(error => console.log(error))
}

export const updateCustomerNext = debounce(updateCustomerNextWait, 800)
async function updateCustomerNextWait(values, setCustomerEditModal, setErrorAlert, preantCallBack, resetForm) {
    try {
        const response = await axios.post(VEHICAL_URL + '/customer/update', values)
        if (response.data.type === "success" || response.data.type === "Success") {
            setErrorAlert({ isOpen: true, type: "Success", msg: response.data.msg })
            resetForm()
            setCustomerEditModal(false)
            preantCallBack({ name: values.customerName, id: values.rlb_lid })
        } else {
            let msgG = response.data.msg
            let getMsg = (typeof msgG === 'string' || msgG instanceof String) ? response.data.msg : response.data.msg.msg
            setErrorAlert({ isOpen: true, type: "Error", msg: getMsg })
        }
    } catch (error) {
        return console.log(error)
    }
}