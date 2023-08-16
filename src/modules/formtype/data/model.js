import * as Yup from 'yup'
import v4 from 'uuid'
import axios from 'axios'
import { VEHICAL_URL } from '../../../store/path'
import userACL from '../../../store/access'
import { debounce, merge } from 'lodash'
import moment from 'moment'

export const formtype = () => ({
    id: v4(),
    stype_name: "",
    numbering: "",
    status: 1,
    segid: "",
    cid: "",
    dt_create: "",
    dt_update: "",
    uid_create: "",
    uid_update: "",
    numdetails: ""
})

export const numdetailsArray = () => ({
    id: v4(),
    formt_id: "",
    sr_no: null,
    from_date: null,
    to_date: null,
    number_prefix: "",
    number_suffix: "",
    next_number: null,
    number_count: null,
    segid: null,
    cid: "",
    status: 1,
    dt_create: "",
    dt_update: "",
    uid_create: "",
    uid_update: "",
})

export const formTypeSchema = Yup.object().shape({
    id: Yup.string()
        .required('Id is Required Field'),
    stype_name: Yup.string()
        .min(3, 'Form Type Name (Min 3 Characters Needed)')
        .max(200, 'Form Type Name (Max 200 Characters allowed)')
        .required('Form Type Name Required'),

    numbering: Yup.string()
        .required('Numbering Required Field'),
    status: Yup.number().integer().nullable(),
    segid: Yup.string().nullable(),
    cid: Yup.string().nullable(),
    txnid: Yup.string().nullable(),
    dt_create: Yup.string().nullable(),
    dt_update: Yup.string().nullable(),
    uid_create: Yup.string().nullable(),
    uid_update: Yup.string().nullable()

})

export const formTypeSchemaNumber = Yup.object().shape({
    id: Yup.string()
        .required('Id is Required Field'),
    stype_name: Yup.string()
        .min(3, 'Form Type Name (Min 3 Characters Needed)')
        .max(200, 'Form Type Name (Max 200 Characters allowed)')
        .required('Form Type Name is Required'),
    numbering: Yup.string()
        .required('Numbering (Required)'),
    numdetails: Yup.array()
        .of(Yup.object().shape({
            from_date: Yup.string().required('From Date Required').nullable(),
            to_date: Yup.string().required('To Date Required').nullable(),
            status: Yup.number().integer().nullable(),
            segid: Yup.string().required('Segment Required'),
            cid: Yup.string().nullable(),
            txnid: Yup.string().nullable(),
            dt_create: Yup.string().nullable(),
            dt_update: Yup.string().nullable(),
            uid_create: Yup.string().nullable(),
            uid_update: Yup.string().nullable(),
        })),

})

export const duplicateCheckFormType = debounce(checkFormType, 800)
function checkFormType(value, values, type) {
    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.stype_name = values.stype_name
    if (value && value !== null && value !== undefined && value !== "" && value.length > 2)
        return axios.post(VEHICAL_URL + '/form-type/exists-check', obj)
            .then(response => {
                if (response.data === 'duplicate') {
                    return 'Duplicate'
                }
            }).catch(error => "")
}

