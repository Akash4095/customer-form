import * as Yup from 'yup'
import { v4 } from 'uuid'
import moment from 'moment'
import userACL from '../../../store/access'
import axios from 'axios'
import { VEHICAL_URL } from '../../../store/path'
import { debounce, merge } from 'lodash'


export const financebank = () => ({
    id: v4(),
    finbank_name: "",
    finbank_code: "",
    cid: "",
    segid: "",
    status: 1,
    dt_create: moment().format("YYYY-MM-DD"),
    dt_update: moment().format("YYYY-MM-DD"),
    uid_create: "",
    uid_update: ""

})

export const financeBankSchema = Yup.object({
    id: Yup.string().required('This (Required Field)'),
    finbank_name: Yup.string()
        .min(3, 'Finance Bank Name (Min 3 Characters Needed)')
        .max(200, 'Finance Bank Name (Max 200 Characters allowed)')
        .required('Finance Bank Name (Required)'),
    finbank_code: Yup.string()
        .min(3, 'Finance Bank Code (Min 3 Characters Needed)')
        .max(45, 'Finance Bank Code (Max 45 Characters allowed)')
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

function checkItemCode(value, values, props) {

    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.cid
    obj.finbank_name = values.finbank_name
    obj.finbank_code = values.finbank_code


    if (value && value !== null && value !== undefined && value !== "" && value.length > 2)
        return axios.post(VEHICAL_URL + "/financeBank/exists-check", obj)
            .then(response => {
                if (response.data === 'duplicate') {
                    return "Duplicate"
                }
            })
            .catch(error => "")

}


export const saveFinBankNext = debounce(saveFinBankNextWait, 800)
function saveFinBankNextWait(values, setFinBankModalOpen, setErrorAlert, finBankPreantCallBack, resetForm, id) {
    return axios.post(VEHICAL_URL + '/financeBank/add', values)
        .then(response => {
            if (response.data.type === "success" || response.data.type === "Success") {
                setErrorAlert({ isOpen: true, type: "Success", msg: response.data.msg })
                resetForm()
                setFinBankModalOpen({ isOpen: false, id:"" })
                finBankPreantCallBack(values)
            } else {
                let msgG = response.data.msg
                let getMsg = (typeof msgG === 'string' || msgG instanceof String) ? response.data.msg : response.data.msg.msg
                setErrorAlert({ isOpen: true, type: "Error", msg: getMsg })
            }
        })
        .catch(error => console.log(error))
}



export const updateFinBankNext = debounce(updateFinBankNextWait, 800)
function updateFinBankNextWait(values, setFinBankModalOpen, setErrorAlert, finBankPreantCallBack, resetForm, id) {
    return axios.post(VEHICAL_URL + '/financeBank/update/' + id, values)
        .then(response => {
            if (response.data.type === "success" || response.data.type === "Success") {
                setErrorAlert({ isOpen: true, type: "Success", msg: response.data.msg })
                resetForm()
                setFinBankModalOpen({ isOpen: false, id:""})
                finBankPreantCallBack(values)
            } else {
                let msgG = response.data.msg
                let getMsg = (typeof msgG === 'string' || msgG instanceof String) ? response.data.msg : response.data.msg.msg
                setErrorAlert({ isOpen: true, type: "Error", msg: getMsg })
            }
        })
        .catch(error => console.log(error))
}