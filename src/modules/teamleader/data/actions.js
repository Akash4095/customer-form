import * as type from './types'

export function createTeamleader(props) {
    return {
        type: type.CREATE_TEAMLEADER,
        payload: props,
        txn: 'initiated'
    };

}

export function savedTeamleader(props, res) {

    return {
        type: type.SAVED_TEAMLEADER,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    };
}

export function editTeamleader(props) {
    return {
        type: type.EDIT_TEAMLEADER,
        payload: props,
        txn: 'initiated'
    };
}

export function fetchTeamleader() {
    return {
        type: type.FETCH_TEAMLEADER,
        // payload: data
    };
}

export function fetchedTeamleader(props) {
    return {
        type: type.FETCHED_TEAMLEADER,
        payload: props,
    };
}

export function requestOptionsTeamleader(props) {
    return {
        type: type.OPTIONS_REQUESTED_TEAMLEADER,
        payload: props,
    };
}

export function receivedOptionsTeamleader(props) {
    return {
        type: type.OPTIONS_RECEIVED_TEAMLEADER,
        payload: props
    };
}

export function deleteTeamleader(props) {
    return {
        type: type.DELETE_TEAMLEADER,
        payload: props
    };
}

export function deletedTeamleader(msg) {
    return {
        type: type.DELETED_TEAMLEADER,
        payload: msg
    };
}

export function setNotifyDone(props) {
    return {
        type: type.NOTIFICATION_DONE_TEAMLEADER,
        payload: props
    };
}

export function downloadTeamleaderExcel(props) {
    return {
        type: type.DOWNLOAD_TEAMLEADER_EXCEL,
        payload: props
    }
}