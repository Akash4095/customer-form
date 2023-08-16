import * as Yup from 'yup'
import { v4 } from 'uuid'
import moment from 'moment'
import userACL from '../../../store/access'
import axios from 'axios'
import { VEHICAL_URL } from '../../../store/path'
import { debounce, merge } from 'lodash'


export const vtnum = () => ({
    id: v4(),
    vth_name: "",
    status: 1,
    segid: "",
    cid: "",
    dt_create: "",
    dt_update: "",
    uid_create: "",
    uid_update: "",
    vnumdetails: "",
})

export const voucherTypeArray = () => ({
    id: null,
    vt_id: "",
    vt_name: "",
    frmdt: null,
    todt: null,
    prefix: "",
    sufix: "",
    num: null,
    num_count: null,
    segid: "",
    cid: "",
    status: 1,
    dt_create: "",
    dt_update: "",
    uid_create: "",
    uid_update: "",
})

export const vtnumSchema = Yup.object({
    vth_name: Yup.string()
        .min(3, 'Voucher Type Name (Min 3 Characters Needed)')
        .max(200, 'Voucher Type Name (Max 200 Characters allowed)')
        .required('Voucher Type Name (Required)'),
    status: Yup.number().integer().nullable(),
    segid: Yup.string().nullable(),
    cid: Yup.string().nullable(),
    txnid: Yup.string().nullable(),
    dt_create: Yup.string().nullable(),
    dt_update: Yup.string().nullable(),
    uid_create: Yup.string().nullable(),
    uid_update: Yup.string().nullable(),
    vnumdetails: Yup.array()
        .of(Yup.object().shape({
            frmdt: Yup.string().required('From Date Required').nullable(),
            todt: Yup.string().required('To Date Required').nullable(),
            status: Yup.number().integer().nullable(),
            segid: Yup.string().required('Segment (Required)'),
            cid: Yup.string().nullable(),
            txnid: Yup.string().nullable(),
            dt_create: Yup.string().nullable(),
            dt_update: Yup.string().nullable(),
            uid_create: Yup.string().nullable(),
            uid_update: Yup.string().nullable(),
        }))


})


export const duplicateCheckVtNum = debounce(checkVtNum, 800)

function checkVtNum(value, values, props) {

    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.segid
    obj.vth_name = values.vth_name

    if (value && value !== null && value !== undefined && value !== "" && value.length > 2)
        return axios.post(VEHICAL_URL + "/vt-num/exists-check", obj)
            .then(response => {
                if (response.data === 'duplicate') {
                    return "Duplicate"
                }
            })
            .catch(error => "")

}
