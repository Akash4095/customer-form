import * as Yup from 'yup'
import { v4 } from 'uuid'
import moment from 'moment'
import { debounce, merge } from 'lodash'
import { VEHICAL_URL } from '../../../store/path'
import axios from 'axios'
import userACL from '../../../store/access'


export const financeConsultant = () => ({
    id: v4(),
    emp_code: "",
    emp_name: "",
    prnt_id: null,
    designation: null,
    smType: "Finance Consultant",
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

export const financeConsultantSchema = Yup.object({
    id: Yup.string().required('This (Required Field)'),
    emp_name: Yup.string()
        .min(3, 'Finance Consultant Name (Min 3 Characters Needed)')
        .max(200, 'Finance Consultant Name (Max 200 Characters allowed)')
        .required('Finance Consultant Name is (Required)'),
    emp_code: Yup.string()
        .min(3, 'Finance Consultant Code (Min 3 Characters Needed)')
        .max(45, 'Finance Consultant Code (Max 45 Characters allowed)')
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

