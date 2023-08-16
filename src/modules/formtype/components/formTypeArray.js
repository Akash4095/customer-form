import React, { useState, useEffect } from 'react'
import { Container, Form, Header, Button, Icon, Modal, TableHeader, Table, } from 'semantic-ui-react'
import { FormikInputComponent, FormikAmountComponent, FormikDateComponent, FormikHiddenInputComponent, FormikDateFromComponent } from '../../../utilities/formUtils';
import { getFormType } from '../data/selectors';
import { numdetailsArray } from '../data/model';
import { Field } from 'formik'
import userACL from '../../../store/access';
import SegmentSearch from '../../ciform/components/segmentSelect';
import moment from 'moment';

const FormTypeArray = ({ name, move, swap, push, insert, unshift, remove, pop, form: { initialValues, values, errors },
    ...props }) => {

    const [isModalOpen, setIsModalOpen] = useState({ status: false, msg: '' })
    const [dateModalOpen, setDateModalOpen] = useState(false)
    const [nextLineDateModalOpen, setNextLineDateModalOpen] = useState(false)
    const [newLineAlert, setNewLineAlert] = useState(false)
    const [index, setIndex] = useState(0)
    const [fromDate, setValidFrom] = useState(null)
    const [toDate, setValidToDate] = useState(null)


    let arrKeys = []
    const fieldName = name

    if (values[fieldName] && values[fieldName].length) {
        arrKeys = Object.keys(values[fieldName])

    }


    const [rank, setRank] = useState(1)

    if (values.numdetails.length === 1) {
        values.numdetails[0].sr_no = 1
    }

    const getNewLine = (index) => {
        let numbering = numdetailsArray()
        userACL.atCreate(numbering)
        numbering.sr_no = parseInt(values.numdetails[values.numdetails.length - 1].sr_no) + 1
        numbering.formt_id = values.id
        numbering.segid = ""
        push(numbering)
        setRank(rank + 1)
        setIndex(parseInt(index) + 1)
    }

    const getNewLineItem = (index) => {
        if (values[fieldName][index].from_date && values[fieldName][index].to_date && values[fieldName][index].number_prefix && values[fieldName][index].number_suffix) {
            getNewLine(index)
        } else {
            setNewLineAlert(true)
        }
    }



    const callToRemove = (index, remove) => {
        if (values[fieldName].length > 1) {
            remove(index);
        } else {
            setIsModalOpen({ status: true, msg: 'You are not allowed to delete remaining last row' })
        }

    }

    useEffect(() => {
        if (values.numdetails[index]) {
            if (fromDate && toDate) {
                let check = moment(fromDate).isAfter(toDate)
                if (check === true) {
                    setDateModalOpen(true)
                    setTimeout(() => {
                        values.numdetails[index].to_date = ""
                        check = false
                    }, 300)
                }
            }
        }

        if (index > 0) {
            if (values.numdetails[index]) {
                if (values.numdetails[index].from_date && values.numdetails[index].to_date) {
                    let check = moment(values.numdetails[index].from_date).isAfter(values.numdetails[index].to_date)
                    if (check === true) {
                        setDateModalOpen(true)
                        setTimeout(() => {
                            values.numdetails[index].to_date = ""
                            check = false
                        }, 300)
                    }
                }
            }

        }
        if (index > 0) {
            let sameRow = {}

            for (var i = 0; i < values.numdetails.length - 1; i++) {
                if (values.numdetails[i].segid === values.numdetails[index].segid) {
                    sameRow = values.numdetails[i]
                    if (values.numdetails[index].from_date && sameRow) {
                        let fDate = (values.numdetails[index].from_date)
                        let tDate = moment(sameRow.to_date).format("YYYY-MM-DD")
                        let check = moment(tDate).isAfter(fDate)
                        if (check === true) {
                            setNextLineDateModalOpen(true)
                            setTimeout(() => {
                                values.numdetails[index].from_date = ""
                                check = false
                            }, 300)

                        }
                    }
                }
            }
        }
        return () => null
    }, [fromDate, toDate])



    return (
        <>


            <Table basic='very'>
                <Table.Header className="TableHeader">
                    <Table.Row key="header" className="stickyHead">
                        <Table.HeaderCell width={1}>Segment</Table.HeaderCell>
                        <Table.HeaderCell width={1}>From Date</Table.HeaderCell>
                        <Table.HeaderCell width={1}>To Date</Table.HeaderCell>
                        <Table.HeaderCell width={1}>Number Prefix</Table.HeaderCell>
                        <Table.HeaderCell width={1}>Number Suffix</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Next Number</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Number Count</Table.HeaderCell>
                        <Table.HeaderCell >Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>

                    {
                        values[fieldName] && values[fieldName].length > 0 ? (
                            arrKeys.map((index) => (
                                <Table.Row key={`${fieldName}[${index}]`} className="AccessoriesInputPanel">
                                    <Table.Cell width={1} className="border-bottom">
                                        {/* <Field name={`${fieldName}[${index}].segid`} isLabel='false' component={FormikInputComponent} focus={true} isTxn='true' ></Field> */}
                                        <SegmentSearch name={`${fieldName}[${index}].segid`} isLabel='false' isTxn='false' isSelection={true} />
                                    </Table.Cell>
                                    <Field name={`${fieldName}[${index}].sr_no`} component={FormikHiddenInputComponent} isTxn='true' />
                                    <Table.Cell width={2}>
                                        <Field name={`${fieldName}[${index}].from_date`} component={FormikDateFromComponent} setValidFrom={setValidFrom} isLabel='false' isTxn='true' placeholder='From Date' />
                                    </Table.Cell>

                                    <Table.Cell width={2}>
                                        <Field name={`${fieldName}[${index}].to_date`} component={FormikDateFromComponent} setValidFrom={setValidToDate} isLabel='false' isTxn='true' placeholder='To Date' />
                                    </Table.Cell>

                                    <Table.Cell width={1}>
                                        <Field name={`${fieldName}[${index}].number_prefix`} component={FormikInputComponent} isLabel='false' isTxn='true' />
                                    </Table.Cell>

                                    <Table.Cell width={1}>
                                        <Field name={`${fieldName}[${index}].number_suffix`} component={FormikInputComponent} isLabel='false' isTxn='true' />
                                    </Table.Cell>

                                    <Table.Cell width={1}>
                                        <Field name={`${fieldName}[${index}].next_number`} component={FormikAmountComponent} isLabel='false' isTxn='true' />
                                    </Table.Cell>

                                    <Table.Cell width={1}>
                                        <Field name={`${fieldName}[${index}].number_count`} component={FormikAmountComponent} isLabel='false' isTxn='true' />
                                    </Table.Cell>

                                    <Table.Cell >
                                        <Icon title='Add Row' className="fontSizeAddDeleteIcon AddIcon" name='add' color='green' onClick={() => getNewLineItem(index)} style={{ cursor: 'pointer' }} />
                                        <Icon title='Delete Row' className="fontSizeAddDeleteIcon" name='cancel' color='red' onClick={(e) => callToRemove(index, remove)} style={{ cursor: 'pointer' }} />
                                    </Table.Cell>

                                </Table.Row>
                            ))
                        ) : null
                    }

                </Table.Body>
            </Table>


            <Modal open={isModalOpen.status} size="mini">
                <Modal.Header>Error</Modal.Header>
                <Modal.Content>
                    <p>{isModalOpen.msg}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type="button" negative icon='thumbs down outline' content='Okay' labelPosition='right' onClick={() => { setIsModalOpen({ status: false, msg: '' }) }} />
                </Modal.Actions>
            </Modal>
            <Modal open={dateModalOpen} size="mini">
                <Modal.Header>Error</Modal.Header>
                <Modal.Content>
                    <p>To Date Should be Greater than From Date</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type="button" negative icon='thumbs down outline' content='Okay' labelPosition='right' onClick={() => setDateModalOpen(false)} />
                </Modal.Actions>
            </Modal>
            <Modal open={nextLineDateModalOpen} size="mini">
                <Modal.Header>Error</Modal.Header>
                <Modal.Content>
                    <p>Please check the combination already exist with these Date Range</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type="button" negative icon='thumbs down outline' content='Okay' labelPosition='right' onClick={() => setNextLineDateModalOpen(false)} />
                </Modal.Actions>
            </Modal>
            <Modal open={newLineAlert} size="mini">
                <Modal.Header>Error</Modal.Header>
                <Modal.Content>
                    <p>Please Fill All Row Fields</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type="button" negative icon='thumbs down outline' content='Okay' labelPosition='right' onClick={() => setNewLineAlert(false)} />
                </Modal.Actions>
            </Modal>
        </>
    )
}

export default FormTypeArray

