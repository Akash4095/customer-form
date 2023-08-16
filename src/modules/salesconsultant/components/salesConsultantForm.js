import React, { useState, useEffect } from 'react'
import { Container, Form, Header, Button, Modal } from 'semantic-ui-react'
import { Formik, Field, Form as FormikForm, FieldArray } from 'formik'
import { FormikDateComponent, FormikInputComponent } from '../../../utilities/formUtils';
import { useDispatch, useSelector } from 'react-redux';
import { duplicateSalesConsultant, salesConsultantSchema } from '../data/model';
import { getNotification, getSalesConsultant, getSalesConsultantParams, getTeamleaderNumbering } from '../data/selectors';
import { setNotifyDone, createSalesConsultant, editSalesConsultant } from '../data/actions';
import Notification from '../../../utilities/notificationUtils'
import TeamLeaderSelect from '../../teamleader/components/teamLeaderSelect'
import v4 from 'uuid'
import userACL from '../../../store/access';
import TeamleaderArray from './teamleaderArray';
import moment from 'moment';



const SalesConsultantForm = (props) => {

  const salesConsultant = useSelector(state => getSalesConsultant(state, props))
  const params = useSelector(state => getSalesConsultantParams(state, props))
  const dispatch = useDispatch()
  const teamleaderNumbering = useSelector(state => getTeamleaderNumbering(state, salesConsultant ? salesConsultant.id : 0))
  const [dateModalOpen, setDateModalOpen] = useState(false)

  const [savedSalesConsultantId, setSavedSalesConsultantId] = useState(false)


  const saveSalesConsultant = (values, resetForm) => {

    if (props.match.path === "/salesconsultant/create") {
      values.emp_code = (values.emp_code === "") ? null : values.emp_code
      values.id = v4();
      userACL.atCreate(values);
      values.segid = values.cid;
      values.smType = 'Sales Consultant'
      delete values.pin
      delete values.txnid
      delete values.pageType
      values.history.map((vd) => {
        userACL.atCreate(vd)
        values.prnt_id = vd.prnt_id

      })
      let fDate = moment(values.history[0].team_lead_4mdate).format("YYYY-MM-DD")
      let tDate = moment(values.history[0].team_lead_2date).format("YYYY-MM-DD")
      let check = moment(fDate).isSameOrAfter(tDate)
      if (check === true) {
        setDateModalOpen(true)
      }
      if (values.cid !== 0 && check === false) {
        dispatch(createSalesConsultant(values));
        setSavedSalesConsultantId(values.id)
      
      }


    }

    if (props.match.path === "/salesconsultant/edit/:id") {
      userACL.atUpdate(values);
      values.segid = values.cid;
      values.smType = 'Sales Consultant'
      delete values.pin
      delete values.txnid
      delete values.pageType
      let check = false
      values.history.map((vd) => {
        userACL.atCreate(vd)
        values.prnt_id = vd.prnt_id
        let fDate = moment(vd.team_lead_4mdate).format("YYYY-MM-DD")
        let tDate = moment(vd.team_lead_2date).format("YYYY-MM-DD")
        check = moment(fDate).isSameOrAfter(tDate)
        if (check === true) {
          setDateModalOpen(true)
        }
      })
      if (values.cid !== 0 && check === false) {
        dispatch(editSalesConsultant(values));
        setSavedSalesConsultantId(values.id)
        setTimeout(function () {
          props.history.push(`/salesconsultant/list`);
        }, 2000)
      }

    }
  };

  useEffect(() => {
    if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
      if(document.getElementsByClassName("markedMenuOpt")[0].classList){
        document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
      }
    }
    let obj = document.getElementById("salesconsultant");
    obj.classList.add("markedMenuOpt");
  }, [])

  return (
    <Container >
      <Header as="h2">
        {params.title}
      </Header>
      <Formik
        initialValues={salesConsultant}
        validationSchema={salesConsultantSchema}
        onSubmit={(values, { resetForm }) => saveSalesConsultant(values, resetForm)}
        render={({ values, handleSubmit, errors, resetForm, onChange, handleChange, setFieldValue }) => (

          <Form as={FormikForm} onSubmit={handleSubmit} size='small' className="CustomeForm">
            <Form.Group widths={4}>
              {
                props.match.path === "/salesconsultant/create" ?
                  <Field name="emp_name" label="Sales Consultant Name" isMandatory={true} component={FormikInputComponent} validate={(val) => duplicateSalesConsultant(val, values, "name")} />
                  : <Field name="emp_name" label="Sales Consultant Name" isMandatory={true} component={FormikInputComponent} />
              }
            </Form.Group>
            <Form.Group widths={4}>
              {
                props.match.path === "/salesconsultant/create" ?
                  <Field name="emp_code" label="Sales Consultant Code" component={FormikInputComponent} validate={(val) => duplicateSalesConsultant(val, values, "code")} />
                  : <Field name="emp_code" label="Sales Consultant Code" component={FormikInputComponent} />
              }
            </Form.Group>
            <Form.Group widths={4}>
              <Field name='mobile' label='Mobile No' component={FormikInputComponent} />
            </Form.Group>

            <Form.Group widths={4}>
              <Field name='PAN_NO' label='PAN No' component={FormikInputComponent} />
            </Form.Group>

            <br />
            <Form.Group>
              <FieldArray name='history' component={TeamleaderArray} />
            </Form.Group>


            <Button type="submit" size="medium" color="blue" className="CustomeBTN">
              {params.submitButtonText}
            </Button>

            {console.log(errors)}
            {savedSalesConsultantId ?
              <Notification id={savedSalesConsultantId} resetForm={resetForm} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='save' />
              :
              null}
          </Form>
        )}
      />
      <Modal open={dateModalOpen} size="mini">
        <Modal.Header>Error</Modal.Header>
        <Modal.Content>
          <p>To Date Should be Greater than From Date</p>
        </Modal.Content>
        <Modal.Actions>
          <Button type="button" negative icon='thumbs down outline' content='Okay' labelPosition='right' onClick={() => setDateModalOpen(false)} />
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default SalesConsultantForm;