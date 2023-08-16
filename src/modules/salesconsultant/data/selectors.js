import { createSelector } from "reselect";
import { startsWith, cloneDeep, at } from "lodash";
import { salesConsultant, teamleaderArray } from './model'
import userACL from '../../../store/access'
import moment from "moment";


export const getIsFetchingSalesConsultant = (state, props) => state.salesConsultant.params.isFetching;
export const getIsSalesConsultantFetched = (state, props) => state.salesConsultant.params.salesManFetched;
export const getSalesConsultantList = (state, props) => state.salesConsultant.byId
export const getNotification = (state, id) => state.salesConsultant.notifications[id]
export const getNotificationList = (state, props) => {
    return state.salesConsultant.notifications
}

export const getSalesConsultant = (state, props) => {
    if (props.match.path === '/salesconsultant/create') {
        let object = salesConsultant()
        let teamleaderNum = teamleaderArray()
        userACL.atCreate(teamleaderNum)
        object.prnt_id = teamleaderNum.prnt_id
        object.history = [teamleaderNum]
        object.pageType = "entry"
        return object
    }
    if (props.match.path === '/salesconsultant/edit/:id') {
        let _id = props.match.params.id
        let obj = cloneDeep(state.salesConsultant.byId[_id]);
        obj.pageType = "edit"
        let sortedArr = []
        if (parseInt(obj.history.length, 10) === 0) {
            let teamleaderNum = teamleaderArray()
            userACL.atCreate(teamleaderNum)
            obj.history = [teamleaderNum]
        } else {
            sortedArr = obj.history.filter((item) => {
                return (parseInt(item.status, 10) === 1)
            }).sort((a, b) => {
                return (parseInt(a.sr_no, 10) - parseInt(b.sr_no, 10))
            })
        }
        if (sortedArr.length > 0) {
            obj.history = sortedArr
        }
        return obj
    }
}

export const getTeamleaderNumbering = (state, tlId) => {
    let teamleaderNum = at(state.teamleader.ById, tlId)
    if (teamleaderNum[0] === undefined)
        teamleaderNum = [teamleaderArray()]
    return teamleaderNum
}

export const getSalesConsultantParams = (state, props) => {
    const params = {}

    if (startsWith(state.router.location.pathname, '/salesconsultant/create')) {
        params.title = state.salesConsultant.params.createTitle
        params.submitButtonText = state.salesConsultant.params.createSubmitButtonText
    };

    if (startsWith(state.router.location.pathname, '/salesconsultant/edit/')) {
        params.title = state.salesConsultant.params.editTitle
        params.submitButtonText = state.salesConsultant.params.editSubmitButtonText
    }
    return params
}


export const selectSalesConsultant = createSelector(
    getSalesConsultantList,
    salesconsultant => {
        const keys = Object.keys(salesconsultant)
        const obj = keys.map((key) => {
            return { key: key, value: key, text: (salesconsultant[key].smType === 'Sales Consultant') ? salesconsultant[key].emp_name.concat(salesconsultant[key].emp_code ? ` [ ${salesconsultant[key].emp_code} ]` : "") : "", code: salesconsultant[key].emp_code }

        }).filter((item) => {
            return item.text !== ''
        })
        return obj
    }
)