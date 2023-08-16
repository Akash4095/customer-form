import * as Yup from 'yup'
import { v4 } from 'uuid'
import moment from 'moment'
import userACL from '../../../store/access'
import axios from 'axios'
import { VEHICAL_URL } from '../../../store/path'
import { debounce, merge } from 'lodash'


export const segmap = () => ({
    id: v4(),
    cid: "",
    segid: "",
    status: 1,
    name: "",
    company_name: "",
    secretKey: "",
    accessKey: "",
    emailid: "",
    gstin: "",
    account: "",
    godown: "",
    rto_vtype: "",
    rto_ledger: "",
    rto_ledger_cd: "",
    insurance_vtype: "",
    insurance_ledger: "",
    insurance_ledger_cd: "",
    m_tax_vtype: "",
    m_tax_ledger: "",
    m_tax_ledger_cd: "",
    rsa_vtype: "",
    rsa_ledger: "",
    rsa_ledger_cd: "",
    ex_warranty_vtype: "",
    ex_warranty_ledger: "",
    ex_warranty_ledger_cd: "",
    sot_vtype: "",
    sot_ledger: "",
    sot_ledger_cd: "",
    hsrp_vtype: "",
    hsrp_ledger: "",
    hsrp_ledger_cd: "",
    fastag_vtype: "",
    fastag_ledger: "",
    fastag_ledger_cd: "",
    others_1_vtype: "",
    others_1_ledger: "",
    others_1_ledger_cd: "",
    others_2_vtype: "",
    others_2_ledger: "",
    others_2_ledger_cd: "",
    others_3_vtype: "",
    others_3_ledger: "",
    others_3_ledger_cd: "",
    others_4_vtype: "",
    others_4_ledger: "",
    others_4_ledger_cd: "",
    disc_vtype: "",
    car_sale_vtype: "",
    car_sale_ledger: "",
    car_sale_ledgerCd: "",
    tcs_ledger: "",
    tcs_ledgerCd: "",
    round_off: "",
    round_offCd: "",
    passing_charges_vtype: "",
    passing_charges_ledger: "",
    passing_charges_ledger_cd: "",
    hypothecation_charges_vtype: "",
    hypothecation_charges_ledger: "",
    hypothecation_charges_ledger_cd: "",
    used_car_vtype: "",
    used_car_ledger: "",
    used_car_ledger_cd: "",
    dt_create: moment().format("YYYY-MM-DD"),
    dt_update: moment().format("YYYY-MM-DD"),
    uid_create: "",
    uid_update: "",
    others: [],

})


export const othersArrayValues = () => ({
    id: "",
    key: "",
    value: "",
    segid: null,
    cid: "",
    status: 1,
    uid_create: "",
    uid_update: "",
})

export const segmapSchema = Yup.object({
    id: Yup.string().required('This (Required Field)'),
    name: Yup.string().required('Segment Name (Required Field)'),
    company_name: Yup.string().required('Company Name (Required Field)'),
    status: Yup.number().integer().nullable(),
    segid: Yup.string().nullable(),
    cid: Yup.string().nullable(),
    txnid: Yup.string().nullable(),
    dt_create: Yup.string().nullable(),
    dt_update: Yup.string().nullable(),
    uid_create: Yup.string().nullable(),
    uid_update: Yup.string().nullable()

})

export const othersSchema = Yup.object({
    others: Yup.array()
        .of(Yup.object().shape({
            value: Yup.string().required("Others Name Required"),
            status: Yup.number().integer().nullable(),
            segid: Yup.string().nullable(),
            cid: Yup.string().nullable(),
            uid_create: Yup.string().nullable(),
            uid_update: Yup.string().nullable(),
        })),

})

export const duplicateCheckSegmap = debounce(checkSegmap, 800)

function checkSegmap(value, values) {

    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid = data.segid
    obj.name = values.name

    if (value && value !== null && value !== undefined && value !== "" && value.length > 2) {
        return axios.post(VEHICAL_URL + "/seg-map/exists-check", obj)
            .then(response => {
                if (response.data === "duplicate") {
                    return "Duplicate"
                }
            })
            .catch(error => "")
    }

}

export const callSegmap = debounce(callSegmapAPI, 800)

function callSegmapAPI(setCompany) {
    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    axios.post(VEHICAL_URL + "/ciform/get-segmap", obj)
        .then(response => {
            let item = response.data.data[0]
            setCompany(item.company_name)
            return response.data.data
        }).catch(error => "")

}

export const saveOthersNext = debounce(saveOthersNextWait, 800)
async function saveOthersNextWait(values, setOthersModal, setOthersResponseModal, resetForm) {
    try {
        const response = await axios.post(VEHICAL_URL + '/seg-map/otrsadd', values)
        // console.log('response', response)
        if (response.data.type === "success" || response.data.type === "Success") {
            setOthersResponseModal({ open: true, msg: response.data.msg, type: "success", headerContent: "Success", icon: "check circle", color: "green" })
            resetForm()
            setOthersModal(false)
        } else {
            let msgG = response.data.msg
            let getMsg = (typeof msgG === 'string' || msgG instanceof String) ? response.data.msg : response.data.msg.msg
            setOthersResponseModal({ open: true, msg: response.data.msg, type: "error", headerContent: "Error", icon: "warning sign", color: "red" })
            setOthersModal(false)
        }
    } catch (error) {
        return console.log(error)
    }
}

export const updateOthersNext = debounce(updateOthersNextWait, 800)
async function updateOthersNextWait(values, setOthersModal, setOthersResponseModal, resetForm) {
    try {
        const response = await axios.post(VEHICAL_URL + '/seg-map/otrsaUpdate', values)
        // console.log('update-response', response)
        if (response.data.type === "success" || response.data.type === "Success") {
            setOthersResponseModal({ open: true, msg: response.data.msg, type: "success", headerContent: "Others Response", icon: "check circle", color: "green" , payload : values })
            resetForm()
            setOthersModal(false)
        } else {
            let msgG = response.data.msg
            let getMsg = (typeof msgG === 'string' || msgG instanceof String) ? response.data.msg : response.data.msg.msg
            setOthersResponseModal({ open: true, msg: response.data.msg, type: "error", headerContent: "Others Response", icon: "warning sign", color: "red" })
            setOthersModal(false)
        }
    } catch (error) {
        return console.log(error)
    }
}