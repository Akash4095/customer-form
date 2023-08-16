import * as type from './types'

export function createCustomer(props) {
    return {
        type: type.CREATE_CUSTOMER,
        payload: props,
        txn: 'initiated'
    };
}

export function savedCustomer(props, res) {
    return {
        type: type.SAVED_CUSTOMER,
        payload: props,
        txn: res.type,
        msg: res.msg,
        diff: true
    }
}

export function editCustomer(props) {
    return {
        type: type.EDIT_CUSTOMER,
        payload: props,
        txn: 'initiated'
    }
}

export function fetchCustomer() {
    return {
        type: type.FETCH_CUSTOMER,
    }
}

export function fetchedCustomer(props) {
    return {
        type: type.FETCHED_CUSTOMER,
        payload: props,
    }
}

export function deleteCustomer(props) {
    return {
        type: type.DELETE_CUSTOMER,
        payload: props
    }
}

export function deletedCustomer(msg) {
    return {
        type: type.DELETED_CUSTOMER,
        payload: msg
    }
}

export function setNotifyDone(props){
    return {
        type: type.NOTIFICATION_DONE_CUSTOMER,
        payload:props
    }
}

export function searchCustomer(props) {
    return {
        type: type.SEARCH_CUSTOMER,
        payload: props
    }
}

export function storeSearchedCustomer(props) {
    return {
        type: type.STORE_SEARCHED_CUSTOMER,
        payload: props
    }
}


export function fetchXmlCountry(props) {
    return {
        type: type.FETCH_COUNTRY_XML,
        payload: props
    }
}
export function fetchedXmlCountry(props) {
    return {
        type: type.FETCHED_COUNTRY_XML,
        payload: props
    }
}

export function fetchXmlState(props) {
    return {
        type: type.FETCH_STATE_XML,
        payload: props
    }
}
export function fetchedXmlState(props) {
    return {
        type: type.FETCHED_STATE_XML,
        payload: props
    }
}