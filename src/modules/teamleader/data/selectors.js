import { createSelector } from "reselect";
import { startsWith, cloneDeep } from "lodash";
import { teamleader } from './model'


export const getIsFetchingTeamleader = (state, props) => state.teamleader.params.isFetching;
export const getIsTeamleaderFetched = (state, props) => state.teamleader.params.teamleaderFetched;
export const getTeamleaderList = (state, props) => state.teamleader.byId
export const getNotification = (state, id) => state.teamleader.notifications[id]
export const getNotificationList = (state, props) => {
    return state.teamleader.notifications
}

export const getTeamleader = (state, props) => {
    if (props.match.path === '/teamleader/create') {
        return teamleader()
    }
    if (props.match.path === '/teamleader/edit/:id') {
        let _id = props.match.params.id
        let obj = cloneDeep(state.teamleader.byId[_id]);
        return obj
    }
}

export const getTeamleaderParams = (state, props) => {
    const params = {}

    if (startsWith(state.router.location.pathname, '/teamleader/create')) {
        params.title = state.teamleader.params.createTitle
        params.submitButtonText = state.teamleader.params.createSubmitButtonText
    };

    if (startsWith(state.router.location.pathname, '/teamleader/edit/')) {
        params.title = state.teamleader.params.editTitle
        params.submitButtonText = state.teamleader.params.editSubmitButtonText
    }
    return params
}


export const selectTeamleader = createSelector(
    getTeamleaderList,
    teamleader => {
        const keys = Object.keys(teamleader)
        const obj = keys.map((key) => {
            return { key: key, value: key, text: (teamleader[key].smType === 'Team Leader') ? teamleader[key].emp_name.concat(teamleader[key].emp_code ? ` [ ${teamleader[key].emp_code} ]` : "") : "", code: teamleader[key].emp_code }

        }).filter((item) => {
            return item.text !== ''
        })
        return obj
    }
)