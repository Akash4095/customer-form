import { Field } from 'formik'
import moment from 'moment'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Icon, Modal, Table } from 'semantic-ui-react'
import userACL from '../../../store/access'
import { FormikAmountComponent, FormikDateComponent, FormikDateFromComponent, FormikHiddenInputComponent, FormikInputComponent } from '../../../utilities/formUtils'
import SegmentSearch from '../../ciform/components/segmentSelect'
import { voucherTypeArray } from '../data/model'

const VoucherTypeArray = ({ name, move, swap, pop, push, insert, unshift, remove, form: { initialValues, values, errors },
    ...props }) => {

    const [isModalOpen, setIsModalOpen] = useState({ status: false, msg: '' })
    const [dateModalOpen, setDateModalOpen] = useState(false)
    const [nextLineDateModalOpen, setNextLineDateModalOpen] = useState(false)
    const [newLineAlert, setNewLineAlert] = useState(false)
    const [index, setIndex] = useState(0)
    const [fromDate, setValidFrom] = useState(null)
    const [toDate, setValidToDate] = useState(null)



    let arrKeys = []
    let fieldName = name

    if (values[fieldName] && values[fieldName].length) {
        arrKeys = Object.keys(values[fieldName])
    }

    if (values.vnumdetails.length === 1) {
        values.vnumdetails[0].vt_name = values.vth_name
        values.vnumdetails[0].vt_id = values.id
    }

    const [rank, setRank] = useState(1)

    const getNewLine = (index) => {
        let numbering = voucherTypeArray()
        userACL.atCreate(numbering)
        numbering.vt_name = values.vth_name
        numbering.vt_id = values.id
        numbering.segid = ""
        push(numbering)
        setRank(rank + 1)
        setIndex(parseInt(index) + 1)

    }
    const getNewLineItem = (index) => {
        if (values[fieldName][index].segid && values[fieldName][index].frmdt && values[fieldName][index].todt && values[fieldName][index].prefix && values[fieldName][index].sufix) {
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
        if (values.vnumdetails[index]) {
            if (fromDate && toDate) {
                let check = moment(fromDate).isAfter(toDate)
                if (check === true) {
                    setDateModalOpen(true)
                    setTimeout(() => {
                        values.vnumdetails[index].todt = ""
                    }, 2000)
                }
            }
        }

        if (index > 0) {
            if (values.vnumdetails[index]) {
                if (values.vnumdetails[index].frmdt && values.vnumdetails[index].todt) {
                    let check = moment(values.vnumdetails[index].frmdt).isAfter(values.vnumdetails[index].todt)
                    if (check === true) {
                        setDateModalOpen(true)
                        setTimeout(() => {
                            values.vnumdetails[index].todt = ""
                        }, 2000)
                    }
                }
            }

        }
        if (index > 0) {
            console.log(values.vnumdetails, '-values')
            let sameRow = {}

            for (var i = 0; i < values.vnumdetails.length - 1; i++) {
                if (values.vnumdetails[i].segid === values.vnumdetails[index].segid) {
                    sameRow = values.vnumdetails[i]
                    console.log(sameRow, '--sameRow')
                    if (values.vnumdetails[index].frmdt && sameRow) {
                        let fDate = (values.vnumdetails[index].frmdt)
                        let tDate = moment(sameRow.todt).format("YYYY-MM-DD")
                        let check = moment(tDate).isAfter(fDate)
                        if (check === true) {
                            setNextLineDateModalOpen(true)
                            setTimeout(() => {
                                values.vnumdetails[index].frmdt = ""
                            }, 2000)

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
                        <Table.HeaderCell width={2}>Prefix</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Suffix</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Upcoming Number</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Number Count</Table.HeaderCell>
                        <Table.HeaderCell >Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        values[fieldName] && values[fieldName].length > 0 ? (
                            arrKeys.map((index) => (
                                <Table.Row key={`${fieldName}[${index}]`} className="AccessoriesInputPanel">
                                    <Table.Cell width={1} className="border-bottom">
                                        <SegmentSearch name={`${fieldName}[${index}].segid`} isLabel='false' isTxn='false' isSelection={true} />
                                    </Table.Cell>

                                    <Table.Cell width={2}>
                                        <Field name={`${fieldName}[${index}].frmdt`} component={FormikDateFromComponent} setValidFrom={setValidFrom} isLabel='false' isTxn='true' placeholder='From Date' />
                                    </Table.Cell>

                                    <Table.Cell width={2}>
                                        <Field name={`${fieldName}[${index}].todt`} component={FormikDateFromComponent} setValidFrom={setValidToDate} isLabel='false' isTxn='true' placeholder='To Date' />
                                    </Table.Cell>

                                    <Table.Cell width={1}>
                                        <Field name={`${fieldName}[${index}].prefix`} component={FormikInputComponent} isLabel='false' isTxn='true' />
                                    </Table.Cell>

                                    <Table.Cell width={1}>
                                        <Field name={`${fieldName}[${index}].sufix`} component={FormikInputComponent} isLabel='false' isTxn='true' />
                                    </Table.Cell>

                                    <Table.Cell width={1}>
                                        <Field name={`${fieldName}[${index}].num`} component={FormikAmountComponent} isLabel='false' isTxn='true' />
                                    </Table.Cell>

                                    <Table.Cell width={1}>
                                        <Field name={`${fieldName}[${index}].num_count`} component={FormikAmountComponent} isLabel='false' isTxn='true' />
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
                    <Button type="button" negative icon="thumbs down outline" content="Okay" labelPosition='right' onClick={() => { setIsModalOpen({ status: false, msg: '' }) }} />
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
                    <p>Please check the combination already exist</p>
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

export default VoucherTypeArray