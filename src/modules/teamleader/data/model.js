import * as Yup from "yup";
import { v4 } from "uuid";
import moment from 'moment'
import { debounce, merge } from "lodash";
import axios from 'axios';
import { VEHICAL_URL } from '../../../store/path'
import userACL from "../../../store/access";


export const teamleader = () => ({
    id: v4(),
    emp_code: "",
    emp_name: "",
    prnt_id: null,
    designation: null,
    smType: "Team Leader",
    mobile: null,
    pin: null,
    PAN_NO: null,
    cid: "",
    segid: "",
    status: 1,
    dt_create: moment().format("YYYY-MM-DD"),
    dt_update: moment().format("YYYY-MM-DD"),
    uid_create: "",
    uid_update: "",
    history: ""

});

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const teamleaderSchema = Yup.object({
    id: Yup.string().required('This (Required Field)'),
    emp_code: Yup.string()
        .min(3, 'TeamLeader Code (Min 3 Characters Needed)')
        .max(45, 'TeamLeader Code (Max 45 Characters allowed)')
        .nullable(),
    prnt_id: Yup.string().required('SalesManager (Required Field)')
        .nullable(),
    emp_name: Yup.string()
        .min(3, 'TeamLeader Name (Min 3 Characters Needed)')
        .max(200, 'TeamLeader Name (Max 200 Characters allowed)')
        .required('TeamLeader Name (Required)'),
    PAN_NO: Yup.string()
        .min(10, 'PAN NO (Min 10 Characters Needed)')
        .max(10, 'PAN NO (Max 10 Characters allowed)')
        .nullable(),
    mobile: Yup.string().matches(phoneRegExp, 'Mobile Number is not valid')
        .min(10, 'Mobile NO (Min 10 Characters Needed)')
        .max(10, 'Mobile NO (Max 10 Characters allowed)')
        .nullable(),
    status: Yup.number().integer().nullable(),
    segid: Yup.string().nullable(),
    cid: Yup.string().nullable(),
    txnid: Yup.string().nullable(),
    dt_create: Yup.string().nullable(),
    dt_update: Yup.string().nullable(),
    uid_create: Yup.string().nullable(),
    uid_update: Yup.string().nullable()
});


export const duplicateTeamleader = debounce(checkTeamleader, 100);
function checkTeamleader(value, values, type) {
    let empName = type === "name" ? value : values.emp_name,
        empCode = type === "code" ? value : values.emp_code
    if (empName && empName !== null && empName !== undefined && empName !== "" && empName.length > 2) {
        if (empCode && empCode !== null && empCode !== undefined && empCode !== "" && empCode.length > 2) {
            const data = userACL.atFetch()
            let obj = {}
            obj.cid = data.cid
            obj.segid = data.cid
            obj.emp_name = empName
            obj.emp_code = empCode
            obj.smType = values.smType
            return axios
                .post(VEHICAL_URL + '/salesman/exists-check', obj)
                .then(response => {
                    if (response.data === 'duplicate') {
                        return "Duplicate"
                    }
                })
                .catch(error => "")
        }
    }
}


