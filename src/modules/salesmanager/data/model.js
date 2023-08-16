import * as Yup from 'yup'
import { v4 } from 'uuid'
import moment from 'moment'
import { merge, lodash, debounce } from 'lodash'
import axios from 'axios'
import userACL from '../../../store/access'
import { VEHICAL_URL } from '../../../store/path'


export const salesmanager = () => ({
    id: v4(),
    emp_code: "",
    emp_name: "",
    prnt_id: null,
    designation: null,
    smType: "Sales Manager",
    mobile: null,
    pin: null,
    PAN_NO: null,
    cid: "",
    segid: "",
    status: 1,
    dt_create: moment().format("YYYY-MM-DD"),
    dt_update: moment().format("YYYY-MM-DD"),
    uid_create: "",
    uid_update: "",
    history: ""
})


const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


export const salesmanagerSchema = Yup.object({
    id: Yup.string().required('This (Required Field)'),
    emp_name: Yup.string()
        .min(3, 'Sales Manager Name (Min 3 Characters Needed)')
        .max(200, 'Sales Manager Name (Max 200 Characters allowed)')
        .required('Sales Manager Name is (Required)'),
    emp_code: Yup.string()
        .min(3, 'Sales Manager Code (Min 3 Characters Needed)')
        .max(45, 'Sales Manager Code (Max 45 Characters allowed)')
        .nullable(),
    PAN_NO: Yup.string()
        .min(10, 'PAN NO (Min 10 Characters Needed)')
        .max(10, 'PAN NO (Max 10 Characters allowed)')
        .nullable(),
    mobile: Yup.string().matches(phoneRegExp, 'Mobile Number is not valid')
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

export const duplicateCheckItem = debounce(checkItemCode, 800)

function checkItemCode(value, values) {

    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.cid
    obj.emp_name = values.emp_name
    obj.emp_code = values.emp_code
    obj.smType = values.smType
    if (value && value !== null && value !== undefined && value !== "" && value.length > 2)
        return axios.post(VEHICAL_URL + "/salesman/exists-check", obj)
            .then(response => {
                if (response.data === 'duplicate') {
                    return "Duplicate"
                }
            })
            .catch(error => "")
}

