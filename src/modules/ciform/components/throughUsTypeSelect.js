import { Field } from 'formik'
import React from 'react'
import { FormikSelectComponent } from '../../../utilities/formUtils'

const ThroughUsTypeSelect = ({ name, isTxn, isLabel, label, setOnCall, isSelection, focus, placeholder, width, validation, isMandatory, passFunct, getValue: callback }, props) => {


    const getSelectedValue = (values) => {
        // console.log(values,'---values')      
    }

    const opt = [
        {
            key: 'cash',
            value: 'Cash',
            text: 'Cash'
        },
        {
            key: 'dsa',
            value: 'DSA',
            text: 'DSA'
        }

    ]
    return (
        <>
            <Field name={name} isLabel={isLabel} label={label} isTxn={isTxn} isSelection={isSelection} component={FormikSelectComponent} isMandatory={isMandatory} userProps={{ options: opt, getValue: getSelectedValue, placeholder }} placeholder={placeholder} focus={focus} width={width} />
        </>
    )
}

export default ThroughUsTypeSelect;