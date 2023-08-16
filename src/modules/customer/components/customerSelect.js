import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as select from "../data/selectors";
import { Field } from "formik";
import {
  FormikSelectComponent,
  FormikAsyncSelectComponent,
} from "../../../utilities/formUtils"; //FormikAsyncSelectComponent
import { searchCustomer } from "../data/actions";
import userACL from "../../../store/access";
import { filter, find, matches, merge } from "lodash";
import moment from "moment";

const CustomerSearch = (
  {
    name,
    isTxn,
    isLabel,
    label,
    fullData,
    isError,
    setvalue,
    isMandatory,
    setChange,
    values,
    focus,
    isSelection,
    type,
    placeholder,
    appendLabel,
    appendLabelText,
    isFetching,
    width,
    getLabelClass,
    ledgerSearchBy,
    sefFocus,
    onBlurCall,
    onFocusCall,
    getValue: callback,
  },
  props
) => {
  const searchOptions = useSelector((state) =>
    select.selectCustomerName(state, props)
  );
  // const searchOptions = {}
  let options = [];
  const dispatch = useDispatch();

  const data = merge({}, userACL.atFetch());

  const getInputValue = (value, setFieldValue) => {
    if (value.length > 2) {
      let values = {
        srchlName: value,
      };
      values.segid = data.cid;
      values.cid = data.cid;
      if (values.cid !== 0) {
        dispatch(searchCustomer(values));
      }
    }
  };

  const custObj = useSelector((state) => state.customer.storeSearchedCustomer);
  const getValue = (value, setFieldValue) => {
    if (callback) {
      // let obj = filter(custObj, matches({ 'srchlName': value }));
      callback(value, setFieldValue, custObj);
    }
  };

  // Loading Logic if tasks not fetched
  return (
    <Field
      name={name}
      sefFocusCalled={sefFocus}
      className={appendLabel ? "goRelative" : ""}
      isLabel={isLabel}
      isTxn={isTxn}
      label={label}
      isFetching={isFetching}
      tabindex={5}
      width={width}
      appendLabel={appendLabel}
      appendLabelText={appendLabelText}
      setvalue={setvalue}
      setChange={setChange}
      isError={isError}
      isSelection={isSelection}
      isMandatory={isMandatory}
      focus={focus}
      onBlurCall={onBlurCall}
      onFocusCall={onFocusCall}
      component={FormikAsyncSelectComponent}
      userProps={{ options, searchOptions, getInputValue, getValue }}
      getLabelClass={getLabelClass}
    >
    </Field>
    //component={FormikAsyncSelectComponent}
  );
};

export default CustomerSearch;
