import { Field } from "formik";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as select from "../data/selectors";
import { FormikSelectComponent } from "../../../utilities/formUtils";

const StateSelect = (
  {
    name,
    isTxn,
    isLabel,
    label,
    setOnCall,
    country,
    isSelection,
    setFieldValueM,
    focus,
    placeholder,
    width,
    validation,
    isMandatory,
    passFunct,
    getValue: callback,
  },
  props
) => {
  const stateNames = useSelector((state) => select.getStateNames(state, props));

  let opt = stateNames.filter((item) => {
    let splitCode = item.stateId.split("_");
    if (splitCode[0] === country) {
      return item;
    }
  });

  const getSelectedValue = (values) => { };

  return (
    <>
      <Field
        name={name}
        isLabel={isLabel}
        label={label}
        isTxn={isTxn}
        isSelection={isSelection}
        setFieldValueM={setFieldValueM}
        component={FormikSelectComponent}
        isMandatory={isMandatory}
        userProps={{ options: opt, getValue: getSelectedValue, placeholder }}
        placeholder={placeholder}
        focus={focus}
        width={width}
      />
    </>
  );
};

export default StateSelect;
