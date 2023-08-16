import React from 'react';
import { Field } from 'formik'
import { FormikSelectComponent } from '../../../utilities/formUtils'


const NumberTypeSelect = ({ name, isTxn, isLabel, label, isSelection, getSelectedDDVal, computeValue, index, fieldName, fromField, otherList, setOnCall }, props) => {

    const getSelectedValue = (values) => {
        setOnCall(values)
    }

    const opt = [{
        key : "manual",
        value : "manual",
        text : "Manual"
    },{
        key : "auto",
        value : "auto",
        text : "Auto"
    }]
    
    return (
        <Field name={name} isLabel={isLabel} isTxn={isTxn} label={label} isSelection={isSelection} component={FormikSelectComponent} computeValue={computeValue} index={index} fieldName={fieldName} fromField={fromField} otherList={otherList} userProps={{ options: opt, getValue: getSelectedDDVal ? getSelectedDDVal : getSelectedValue }}> </Field>
    )
}


export default NumberTypeSelect;