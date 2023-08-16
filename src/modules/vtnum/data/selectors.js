import { startsWith, cloneDeep } from 'lodash'
import { vtnum, voucherTypeArray } from './model'
import userACL from '../../../store/access'
import moment from 'moment'

export const getIsFetchingVtNum = (state, props) => state.vtnum.params.isFetching
export const getIsVtNumFetched = (state, props) => state.vtnum.params.vtnumFetched
export const getVtNumList = (state, props) => state.vtnum.byId
export const getNotification = (state, id) => state.vtnum.notifications[id]

export const getVtNum = (state, props) => {
    if (props.match.path === '/vt-num/create') {
        let object = vtnum()
        let voucherTypeNum = voucherTypeArray()
        userACL.atCreate(voucherTypeNum)
        voucherTypeNum.vt_name = object.vth_name
        voucherTypeNum.vt_id = object.id
        voucherTypeNum.segid = ""
        object.vnumdetails = [voucherTypeNum]
        return object
    }
    if (props.match.path === '/vt-num/edit/:id') {
        let _id = props.match.params.id
        let obj = cloneDeep(state.vtnum.byId[_id]);

        let segidArr = obj.vnumdetails.map((item) => {
            item.segid = item.segid.toString()
            return item
        })
        let sortedArray = []
        if (parseInt(obj.vnumdetails.length, 10) === 0) {
            let voucherTypeNum = voucherTypeArray()
            userACL.atCreate(voucherTypeNum)
            voucherTypeNum.segid = ""
            obj.vnumdetails = [voucherTypeNum]
        }
        else {
            sortedArray = segidArr.filter((item) => {
                return (parseInt(item.status, 10) === 1)
            }).sort((a, b) => {
                return (moment(a.todt).diff(b.todt))
            })
        }
        if (sortedArray.length > 0) {
            obj.vnumdetails = sortedArray
        }
        return obj
    }
}

export const getVtNumParams = (state, props) => {
    const params = {}

    if (startsWith(state.router.location.pathname, '/vt-num/create')) {
        params.title = state.vtnum.params.createTitle
        params.submitButtonText = state.vtnum.params.createSubmitButtonText
    }
    if (startsWith(state.router.location.pathname, '/vt-num/edit')) {
        params.title = state.vtnum.params.editTitle
        params.submitButtonText = state.vtnum.params.editSubmitButtonText
    };

    return params
}

export const selectVtNum = (state, props) => {
    const vtnum = state.vtnum.byId
    const keys = Object.keys(vtnum)
    const obj = keys.map((key) => {
        return { key: key, value: key, text: vtnum[key].vt_name }
    });
    return obj

}