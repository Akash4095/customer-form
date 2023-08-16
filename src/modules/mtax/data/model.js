import * as Yup from 'yup'
import v4 from 'uuid'
import axios from 'axios'
import { VEHICAL_URL } from '../../../store/path'
import userACL from '../../../store/access'
import { debounce, merge } from 'lodash'
import moment from 'moment'

export const mtax = () => ({
    id: v4(),
    city: "",
    status: 1,
    segid: "",
    cid: "",
    dt_create: moment().format("YYYY-MM-DD"),
    dt_update: moment().format("YYYY-MM-DD"),
    uid_create: "",
    uid_update: "",
    taxetails: "",
})

export const mtaxArray = () => ({
    id: v4(),
    sr_no: null,
    valid_from: "",
    valid_to: "",
    from_amount: null,
    to_amount: null,
    app_rate: null,
    add_amount: null,
    status: 1,
    segid: "",
    cid: "",
    dt_create: moment().format("YYYY-MM-DD"),
    dt_update: moment().format("YYYY-MM-DD"),
    uid_create: "",
    uid_update: "",
})

export const mtaxSchema = Yup.object().shape({
    id: Yup.string()
        .required('Id is Required Field'),
    city: Yup.string()
        .required('City Name (Required Field)'),
    status: Yup.number().integer().nullable(),
    segid: Yup.string().nullable(),
    cid: Yup.string().nullable(),
    txnid: Yup.string().nullable(),
    dt_create: Yup.string().nullable(),
    dt_update: Yup.string().nullable(),
    uid_create: Yup.string().nullable(),
    uid_update: Yup.string().nullable(),
    taxetails: Yup.array()
        .of(Yup.object().shape({
            valid_from: Yup.string().required('From Date Required'),
            valid_to: Yup.string().required('To Date Required'),
        }))

})



export const duplicateCheckMtax = debounce(checkMtax, 800)
function checkMtax(value, values) {
    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.segid
    obj.city = values.city
    if (value && value !== null && value !== undefined && value !== "" && value.length > 2)
        return axios.post(VEHICAL_URL + '/m-tax/exists-check', obj)
            .then(response => {
                if (response.data === 'duplicate') {
                    return 'Duplicate'
                }
            }).catch(error => "")
}

