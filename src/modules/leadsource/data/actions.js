import * as type from './types'

export function createLeadSource(props) {
    return {
        type: type.CREATE_LEAD_SOURCE,
        payload: props,
        txn: 'initiated'
    };
}

export function savedLeadSource(props, res) {
    return {
        type: type.SAVED_LEAD_SOURCE,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    }
}

export function editLeadSource(props) {
    return {
        type: type.EDIT_LEAD_SOURCE,
        payload: props,
        txn: 'initiated'
    }
}

export function fetchLeadSource() {
    return {
        type: type.FETCH_LEAD_SOURCE,
    }
}

export function fetchedLeadSource(props) {
    return {
        type: type.FETCHED_LEAD_SOURCE,
        payload: props,
    }
}

export function deleteLeadSource(props) {
    return {
        type: type.DELETE_LEAD_SOURCE,
        payload: props
    }
}

export function deletedLeadSource(msg) {
    return {
        type: type.DELETED_LEAD_SOURCE,
        payload: msg
    }
}

export function setNotifyDone(props){
    return {
        type: type.NOTIFICATION_DONE_LEAD_SOURCE,
        payload:props
    }
}

export function downloadLeadSourceExcel(props) {
    return {
        type: type.DOWNLOAD_LEAD_SOURCE_EXCEL,
        payload: props
    }
}