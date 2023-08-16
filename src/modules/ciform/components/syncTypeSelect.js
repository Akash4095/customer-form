import { Field } from 'formik'
import React from 'react'
import { FormikSelectComponent } from '../../../utilities/formUtils'
import { toLower } from 'lodash'

const SyncTypeSelect = ({name, isTxn, isLabel, label, isSelection, focus, placeholder, width, validation, isMandatory,  nextOption, getValue : callback }, props) => {


const getStatus = (txn) => {
    let status = "n/a"
    if(nextOption && nextOption !== undefined && nextOption !== null && nextOption.length > 0){
        let getObj = nextOption.filter((obj)=> {
            return (toLower(obj.txnType) === toLower(txn))
        })
        if(getObj.length > 0){
            status = getObj[0].txnStatus ? getObj[0].txnStatus : "n/a"
        }
    }    
    return status
}

const  opt =[
    {
        key:'car_sale',
        value:'car_sale',
        text:'Car Sale',
        status: getStatus("ex_showroom_without_gst")
    },
    {
        key:'rto',
        value:'rto',
        text:'RTO',
        status: getStatus("rto")
    },
    {
        key:'rsa',
        value:'rsa',
        text:'RSA',
        status: getStatus("rsa")
    },
    {
        key:'insurance',
        value:'insurance',
        text:'Insurance',
        status: getStatus("Insurance")
    },

    {
        key:'m_tax',
        value:'m_tax',
        text:'M Tax',
        status: getStatus("m_tax")
    },
    {
        key:'ex_warranty',
        value:'ex_warranty',
        text:'Ex Warranty',
        status: getStatus("ex_warranty")
    },
    {
        key:'sot',
        value:'sot',
        text:'AMC Plan',
        status: getStatus("sot")
    },
    {
        key:'hsrp',
        value:'hsrp',
        text:'HSRP',
        status: getStatus("hsrp")
    },

    {
        key:'fastag',
        value:'fastag',
        text:'Fastag',
        status: getStatus("fastag")
    },
    {
        key:'others_1',
        value:'others_1',
        text:'Others 1',
        status: getStatus("others_1")
    },
    {
        key:'others_2',
        value:'others_2',
        text:'Others 2',
        status: getStatus("others_2")
    },
    {
        key:'others_3',
        value:'others_3',
        text:'Others 3',
        status: getStatus("others_3")
    },
    {
        key:'others_4',
        value:'others_4',
        text:'Others 4',
        status: getStatus("others_4")
    },
    {
        key:'disc',
        value:'disc',
        text:'Disc',
        status: getStatus("disc")
    },
    {
        key:'passing_charges',
        value:'passing_charges',
        text:'Passing Charges',
        status: getStatus("passing_charges")
    },
    {
        key:'hypothecation_charges',
        value:'hypothecation_charges',
        text:'Hypothecation Charges',
        status: getStatus("hypothecation_charges")
    },
    {
        key:'used_car_value',
        value:'used_car_value',
        text:'Used Car Value',
        status: getStatus("used_car_value")
    },
]

const getSelectedValue = (values, setFieldValue) => {
    if(callback){
        let getObj = opt.filter((obj)=> {
            return (toLower(obj.value) === toLower(values))
        })
        callback(values, setFieldValue, getObj[0])
    }
}



    return (
        <>
            <Field name={name} isLabel={isLabel} label={label} isTxn={isTxn} isSelection={isSelection} component={FormikSelectComponent} isMandatory={isMandatory} userProps={{ options: opt, getValue: getSelectedValue, placeholder }} placeholder={placeholder} focus={focus} width={width} />
        </>
    )
}

export default SyncTypeSelect