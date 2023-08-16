import { startsWith, cloneDeep, at } from 'lodash';
import { formtype, numdetailsArray } from './model'
import userACL from '../../../store/access';


export const getIsFetchingFormType = (state, props) => state.formtype.params.isFetching;
export const getIsFormTypeFetched = (state, props) => state.formtype.params.formTypeFetched;
export const getFormTypeList = (state, prop) => state.formtype.byListId
export const getFormTypeObj = (state, id) => state.formtype.byListId[id]

export const getNotification = (state, id) => state.formtype.notifications[id]


export const getFormType = (state, props) => {
    if (props.match.path === '/form-type/create') {
        let formType = cloneDeep(formtype())
        return formType
    }
    if (props.match.path === '/form-type/edit/:id') {
        let _id = props.match.params.id
        let obj = cloneDeep(state.formtype.byListId[_id]);
        let sortedArr = []
        if (parseInt(obj.numdetails.length, 10) === 0) {
            let formTypeNum = numdetailsArray()
            userACL.atCreate(formTypeNum)
            obj.numdetails = [formTypeNum]
        } else {
            sortedArr = obj.numdetails.filter((item) => {
                return (parseInt(item.status, 10) === 1)
            }).sort((a, b) => {
                return (parseInt(a.sr_no, 10) - parseInt(b.sr_no, 10))
            })
        }
        if(sortedArr.length > 0){
            obj.numdetails = sortedArr
        }
        return obj
    }
}


export const getFormTypeNumbering = (state, ftId) => {
    let formTypeNum = at(state.formtype.ById, ftId)
    if (formTypeNum[0] === undefined)
        formTypeNum = [numdetailsArray()]
    return formTypeNum
}

export const getFormTypeParams = (state, props) => {
    const params = {}

    if (startsWith(state.router.location.pathname, '/form-type/create')) {
        params.title = state.formtype.params.createTitle
        params.submitButtonText = state.formtype.params.createSubmitButtonText
    };

    if (startsWith(state.router.location.pathname, '/form-type/edit/')) {
        params.title = state.formtype.params.editTitle
        params.submitButtonText = state.formtype.params.editSubmitButtonText
    };

    return params
}



export const selectFormType = (state, props) => {
    const formtype = state.formtype.byListId
    const keys = Object.keys(formtype)
    const obj = keys.map((key) => {
        return { key: key, value: key, text: formtype[key].stype_name }
    });
    return obj

}