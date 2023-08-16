import React, { useState } from "react";
import { Button, Icon, Modal, Table } from "semantic-ui-react";
import userACL from "../../../store/access";
import { Field } from "formik";
import {
  FormikDisplayLabelRowComponent,
  FormikAmountComponent,
} from "../../../utilities/formUtils";
import { displayAmtInLakh } from "../../../utilities/listUtils";
import { ciFormAccessories } from "../data/model";

let rank = 1;
const AccessoriesArrayView = ({
  name,
  move,
  swap,
  push,
  insert,
  unshift,
  remove,
  pop,
  form: { initialValues, values, errors },
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = useState({ status: false, msg: "" });

  let arrKeys = [];
  const fieldName = name;

  if (values[fieldName] && values[fieldName].length) {
    arrKeys = Object.keys(values[fieldName]);
  }

  const [rank, setRank] = useState(1);
  const getNewLineItem = () => {
    let ciformAcc = ciFormAccessories();
    userACL.atCreate(ciformAcc);
    ciformAcc.txn_id = initialValues.id;
    push(ciformAcc);
    setRank(rank + 1);
  };

  const callToRemove = (index, remove) => {
    if (values[fieldName].length > 1) {
      remove(index);
    } else {
      setIsModalOpen({
        status: true,
        msg: "You are not allowed to delete remaining last row",
      });
    }
  };

  return (
    <>
      <Table className="accessoriesPanel">
        <Table.Header className="TableHeader">
          <Table.Row key="header" className="stickyHead">
            <Table.HeaderCell width={1}>SR NO</Table.HeaderCell>
            <Table.HeaderCell width={5}>ACCESSORIES</Table.HeaderCell>
            <Table.HeaderCell width={3}>Amount</Table.HeaderCell>
            <Table.HeaderCell width={2}>PAID (inflow)</Table.HeaderCell>
            <Table.HeaderCell width={2}>FOC (outflow)</Table.HeaderCell>
            <Table.HeaderCell width={1}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {values[fieldName] && values[fieldName].length > 0
            ? arrKeys.map((index) => (
                <Table.Row
                  key={`${fieldName}[${index}]`}
                  className="AccessoriesInputPanel"
                >
                  {/* <Table.Cell> <label>{(parseInt(index) + 1)}</label></Table.Cell> */}

                  <Table.Cell width={1} className="input-text-left ">
                    <label className="leftPadd">{rank}</label>
                  </Table.Cell>
                  <Table.Cell width={4} className="">
                    <Field
                      component={FormikDisplayLabelRowComponent}
                      isLabel={false}
                      text={
                        values[fieldName][index].accessories
                          ? values[fieldName][index].accessories
                          : ""
                      }
                    />
                  </Table.Cell>
                  <Table.Cell width={3} className="input-text-left ">
                    <Field
                      component={FormikDisplayLabelRowComponent}
                      isLabel={false}
                      text={
                        values[fieldName][index].amount
                          ? displayAmtInLakh(values[fieldName][index].amount)
                          : ""
                      }
                    />
                  </Table.Cell>
                  <Table.Cell width={2} className="input-text-left ">
                    <Field
                      component={FormikDisplayLabelRowComponent}
                      isLabel={false}
                      text={
                        values[fieldName][index].paid_inflow == 1 ? "Yes" : "No"
                      }
                    />
                  </Table.Cell>
                  <Table.Cell width={2} className="input-text-left ">
                    <Field
                      component={FormikDisplayLabelRowComponent}
                      isLabel={false}
                      text={
                        values[fieldName][index].foc_outflow == 1 ? "Yes" : "No"
                      }
                    />
                  </Table.Cell>
                  <Table.Cell width={1}></Table.Cell>
                </Table.Row>
              ))
            : null}
        </Table.Body>
      </Table>
    </>
  );
};

export default AccessoriesArrayView;
