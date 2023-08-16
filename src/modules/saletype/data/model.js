import * as Yup from 'yup'
import v4 from 'uuid'
import axios from 'axios'
import { VEHICAL_URL } from '../../../store/path'
import { debounce, merge } from 'lodash'
import userACL from '../../../store/access'

export const saletype = () => ({
    id: v4(),
    saletype_name: "",
    status: 1,
    segid: "",
    cid: "",
    dt_create: "",
    dt_update: "",
    uid_create: "",
    uid_update: "",
    price_list: ""
})

export const saleTypeSchema = Yup.object().shape({
    id: Yup.string()
        .required('Id is Required Field'),
    saletype_name: Yup.string()
        .min(3, 'Sales Type Name (Min 3 Characters Needed)')
        .max(200, 'Sales Type Name (Max 200 Characters allowed)')
        .required('Sale Type Name (Required Field)'),
    price_list: Yup.string()
        .min(3, 'Price List Name (Min 3 Characters Needed)')
        .max(100, 'Price List Name (Max 100 Characters allowed)')
        .required('Price List Name (Required Field)'),
    status: Yup.number().integer().nullable(),
    segid: Yup.string().nullable(),
    cid: Yup.string().nullable(),
    txnid : Yup.string().nullable(),
    dt_create: Yup.string().nullable(),
    dt_update: Yup.string().nullable(),
    uid_create: Yup.string().nullable(),
    uid_update: Yup.string().nullable()

})


export const duplicateCheckSaleType = debounce(checkSaleType, 800)
function checkSaleType(value, values) {
    const data = merge({}, userACL.atFetch())
    let obj = {}
    obj.cid = data.cid
    obj.segid= data.segid
    obj.saletype_name = values.saletype_name
    // console.log(obj,'--obj')
    if (value && value !== null && value !== undefined && value !== "" && value.length > 2)
        return axios.post(VEHICAL_URL + '/sale-type/exists-check', obj)
            .then(response => {
                // console.log(response,'-----response')
                if (response.data === 'duplicate') {
                    return 'Duplicate'
                }
            }).catch(error => "")
}

