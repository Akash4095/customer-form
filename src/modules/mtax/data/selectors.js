import { startsWith, cloneDeep, at, values } from 'lodash';
import { mtax, mtaxArray } from './model'
import userACL from '../../../store/access';
import moment from 'moment';


export const getIsFetchingMtax = (state, props) => state.mtax.params.isFetching;
export const getIsMtaxFetched = (state, props) => state.mtax.params.mtaxFetched;
export const getMtaxList = (state, prop) => state.mtax.byId
export const getMtaxObj = (state, id) => state.mtax.byId[id]

export const getNotification = (state, id) => state.mtax.notifications[id]


export const getMtax = (state, props) => {
    if (props.match.path === '/mtax/create') {
        let object = mtax()
        let mtaxNum = mtaxArray()
        userACL.atCreate(mtaxNum)
        object.taxetails = [mtaxNum]
        object.modelOpenEdit = true
        return object
    }
    if (props.match.path === '/mtax/edit/:id') {
        let _id = props.match.params.id
        let obj = cloneDeep(state.mtax.byId[_id]);
        let sortedArr = []
        if (parseInt(obj.taxetails.length, 10) === 0) {
            let mtaxNum = mtaxArray()
            userACL.atCreate(mtaxNum)
            obj.taxetails = [mtaxNum]
        } else {
            sortedArr = obj.taxetails.filter((item) => {
                return (parseInt(item.status, 10) === 1)
            }).sort((a, b) => {
                return (parseInt(a.sr_no, 10) - parseInt(b.sr_no, 10))
            })
        }
        if(sortedArr.length > 0){
            obj.taxetails = sortedArr
        }
        obj.modelOpenEdit = false
        return obj

    }
}


export const getMtaxNumbering = (state, mId) => {
    let mtaxNum = at(state.mtax.ById, mId)
    if (mtaxNum[0] === undefined)
        mtaxNum = [mtaxArray()]
    return mtaxNum
}

export const getMtaxParams = (state, props) => {
    const params = {}

    if (startsWith(state.router.location.pathname, '/mtax/create')) {
        params.title = state.mtax.params.createTitle
        params.submitButtonText = state.mtax.params.createSubmitButtonText
    };

    if (startsWith(state.router.location.pathname, '/mtax/edit/')) {
        params.title = state.mtax.params.editTitle
        params.submitButtonText = state.mtax.params.editSubmitButtonText
    };

    return params
}



export const selectMtax = (state, props) => {
    const mtax = state.mtax.byId
    const keys = Object.keys(mtax)
    const obj = keys.map((key) => {
        return { key: key, value: key, text: mtax[key].city }
    });
    return obj

}