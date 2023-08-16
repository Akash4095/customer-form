import moment  from 'moment'
import v4 from 'uuid';

const _data = {
    domain : '',
    cid : '0',
    segid : '0',
    uid : '0',
    fromdt: '01-04-2019',
    todt: '31-03-2020'
};

function setValues(values) {
    _data.domain = values.domain
    _data.cid = values.cid
    _data.segid = values.segid
    _data.uid = values.uid
    _data.fromdt = values.fromdt
    _data.todt = values.todt
}

function create(values) {
    values.cid = _data.cid
    values.segid = _data.segid
    // values.txnid = v4();
    values.dt_create =moment().format("YYYY-MM-DD hh:mm:ss")
    values.dt_update = moment().format("YYYY-MM-DD hh:mm:ss")
    values.uid_create = _data.uid
    values.uid_update = _data.uid
}

function update(values) {
    values.cid = _data.cid
    values.segid = _data.segid
    // values.txnid = v4();
    values.dt_update =moment().format("YYYY-MM-DD hh:mm:ss")
    values.uid_update = _data.uid
}

function vpdetails(values) {
    values.fromdt = _data.cid
    values.todt = _data.segid
}

const userACL = {
    init: values => setValues(values),
    add: item => _data.push(item),
    atCreate: values => create(values),
    atUpdate: values => update(values),
    atvpdetails: values => vpdetails(values),
    atFetch: () => _data
}

Object.freeze(userACL);
export default userACL;