import { Field } from 'formik'
import React from 'react'
import { FormikSelectComponent } from '../../../utilities/formUtils'

const FuelTypeSelect = ({ name, isTxn, isLabel, label, setOnCall, isSelection, focus, placeholder, width, validation, isMandatory, passFunct, getValue: callback }, props) => {


    const getSelectedValue = (values) => {
        // console.log(values,'---values')      
    }

    const opt = [
        {
            key: 'Petrol',
            value: 'Petrol/Gasoline',
            text: 'Petrol/Gasoline'
        },
        {
            key: 'Diesel',
            value: 'Diesel',
            text: 'Diesel'
        },
        {
            key: 'CNG',
            value: 'CNG',
            text: 'CNG'
        },
        {
            key: 'LPG',
            value: 'LPG',
            text: 'LPG'
        },
        {
            key: 'EV',
            value: 'EV',
            text: 'EV'
        },
        {
            key: 'Hybrid',
            value: 'Hybrid',
            text: 'Hybrid'
        },
        {
            key: 'Others',
            value: 'Others',
            text: 'Others'
        },

    ]
    return (
        <>
            <Field name={name} isLabel={isLabel} label={label} isTxn={isTxn} isSelection={isSelection} component={FormikSelectComponent} isMandatory={isMandatory} userProps={{ options: opt, getValue: getSelectedValue, placeholder }} placeholder={placeholder} focus={focus} width={width} />
        </>
    )
}

export default FuelTypeSelect;