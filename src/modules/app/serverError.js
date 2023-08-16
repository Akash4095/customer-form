
export const parseError = (err) => {
    return  {
        url : err.config.url,
        headers : err.config.headers,
        data : err.response.data,
        status : err.status,
        statusText : err.statusText,
        message : err.message,
        stack : err.stack
    };
}

export const handlError = (action, err) => {
    return ({
        type : 'SERVER_ERROR',
        payload : action.payload,
        fromAction : action.type,
        txn : 'err',
        err : err
    })
}

