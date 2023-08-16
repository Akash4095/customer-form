import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSaleType } from "../data/actions";
import * as select from "../data/selectors";
import { Field } from "formik";
import { FormikSelectComponent } from "../../../utilities/formUtils";
import { merge } from "lodash";
import userACL from "../../../store/access";

const SaleTypeSelect = (
  {
    name,
    isTxn,
    isLabel,
    label,
    setOnCall,
    isMandatory,
    setOnCall2,
    isError,
    isSelection,
    focus,
    placeholder,
    validation,
    computeValue,
    index,
    fieldName,
    fromField,
    otherList,
    passFunct,
    classNameGet,
    setOnCall3,
    getValue: callback,
  },
  props
) => {
  const saleTypeObj = useSelector((state) => state.saletype.byId);
  const saleTypeFetched = useSelector((state) =>
    select.getIsSaleTypeFetched(state, props)
  );
  const options = useSelector((state) => select.selectSaleType(state, props));
  const dispatch = useDispatch();

  const data = merge({}, userACL.atFetch());
  useEffect(() => {
    if (!saleTypeFetched && data.cid !== 0) dispatch(fetchSaleType());
  }, []);

  const getValue = (value, setFieldValue, values) => {
    if (setOnCall) {
      setOnCall(saleTypeObj[value] ? saleTypeObj[value].saletype_name : "");
    }
    if (setOnCall2) {
      setOnCall2(value);
    }
    if (setOnCall3) {
      setOnCall3(
        saleTypeObj[value] ? saleTypeObj[value].saletype_name : "",
        values,
        setFieldValue
      );
    }

    if (passFunct) {
      passFunct(values);
    }
  };

  return (
    <Field
      name={name}
      isLabel={isLabel}
      isTxn={isTxn}
      label={label}
      isMandatory={isMandatory}
      classNameGet={classNameGet}
      validation={validation}
      isSelection={isSelection}
      isError={isError}
      component={FormikSelectComponent}
      computeValue={computeValue}
      index={index}
      fieldName={fieldName}
      fromField={fromField}
      otherList={otherList}
      userProps={{ options, getValue }}
      focus={focus}
      placeholder={placeholder}
    >
      {" "}
    </Field>
  );
};

export default SaleTypeSelect;
