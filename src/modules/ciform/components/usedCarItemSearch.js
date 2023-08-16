import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as select from "../data/selectors";
import { Field } from "formik";
import { searchUsedCarItem } from "../data/actions";
import userACL from "../../../store/access";
import { merge } from "lodash";
import { FormikAsyncSelectComponent } from "../../../utilities/formUtils";

const UsedCarItemSearch = (
  {
    name,
    isTxn,
    isLabel,
    label,
    values,
    focus,
    className,
    onBlurCall,
    onFocusCall,
    isSelection,
    isMandatory,
    type,
    placeholder,
    appendLabel,
    appendLabelText,
    isFetching,
    width,
    sefFocus,
    getValue: callback,
  },
  props
) => {
  const searchOptions = useSelector((state) =>
    select.selectUsedCarItem(state, props)
  );
  let options = [];
  const dispatch = useDispatch();

  const data = merge({}, userACL.atFetch());

  const getInputValue = (value, setFieldValue) => {
    if (value.length > 2) {
      let values = {
        srchStr: value,
      };
      values.segid = data.segid;
      values.cid = data.cid;
      if (values.cid !== 0) {
        dispatch(searchUsedCarItem(values));
      }
    }
  };

  const getValue = (value, setFieldValue) => {
    if (callback) {
      callback(value, setFieldValue);
    }
  };

  return (
    <Field
      name={name}
      sefFocusCalled={sefFocus}
      onFocusCall={onFocusCall}
      onBlurCall={onBlurCall}
      className={appendLabel ? "goRelative" : className}
      isLabel={isLabel}
      placeholder={placeholder}
      isTxn={isTxn}
      label={label}
      isFetching={isFetching}
      tabindex={5}
      width={width}
      appendLabel={appendLabel}
      appendLabelText={appendLabelText}
      isMandatory={isMandatory}
      isSelection={isSelection}
      focus={focus}
      component={FormikAsyncSelectComponent}
      userProps={{ options, searchOptions, getInputValue, getValue }}
    >
    </Field>
  );
};

export default UsedCarItemSearch;
