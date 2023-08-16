import React, { useEffect, useState } from 'react'
import { Container, Form, Header, Button } from 'semantic-ui-react'
import { Formik, Field, Form as FormikForm } from 'formik'
import { FormikInputComponent } from '../../../utilities/formUtils';
import { useDispatch, useSelector } from 'react-redux';
import { duplicateTeamleader, teamleaderSchema } from '../data/model';
import { getNotification, getTeamleader, getTeamleaderParams } from '../data/selectors';
import { setNotifyDone, createTeamleader, editTeamleader } from '../data/actions';
import Notification from '../../../utilities/notificationUtils'
import SalesManagerSelect from '../../salesmanager/components/salesManagerSelect'
import v4 from 'uuid'
import userACL from '../../../store/access';

const TeamLeaderForm = (props) => {

  const teamleader = useSelector(state => getTeamleader(state, props))
  const params = useSelector(state => getTeamleaderParams(state, props))
  const dispatch = useDispatch()
 
  useEffect(() => {
      if(document.getElementsByClassName("markedMenuOpt") && document.getElementsByClassName("markedMenuOpt").length){
          if(document.getElementsByClassName("markedMenuOpt")[0].classList){
            document.getElementsByClassName("markedMenuOpt")[0].classList.remove("markedMenuOpt")
          }
      }
      let obj = document.getElementById("teamleader");
      obj.classList.add("markedMenuOpt");
  }, [])


  const [savedTeamleaderId, setSavedTeamleaderId] = useState(false)


  const saveTeamleader = (values, resetForm) => {

    if (props.match.path === "/teamleader/create") {
      values.emp_code = (values.emp_code === "") ? null : values.emp_code
      values.id = v4();
      userACL.atCreate(values);
      values.segid = values.cid;
      values.smType = 'Team Leader'
      delete values.pin
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(createTeamleader(values));
        setSavedTeamleaderId(values.id)
        
      }


    }

    if (props.match.path === "/teamleader/edit/:id") {
      userACL.atUpdate(values);
      values.segid = values.cid;
      values.smType = 'Team Leader'
      delete values.pin
      delete values.txnid
      if (values.cid !== 0) {
        dispatch(editTeamleader(values));
        setSavedTeamleaderId(values.id)
        setTimeout(function () {
          props.history.push(`/teamleader/list`);
        }, 2000)
      }

    }
  };


  return (
    <Container >
      <Header as="h2">
        {params.title}
      </Header>
      <Formik
        initialValues={teamleader}
        validationSchema={teamleaderSchema}
        onSubmit={(values, { resetForm }) => saveTeamleader(values, resetForm)}
        render={({ values, handleSubmit, resetForm, errors, onChange, handleChange, setFieldValue }) => (

          <Form as={FormikForm} onSubmit={handleSubmit} size='small' className="CustomeForm">
            <Form.Group widths={3}>
              {
                props.match.path === "/teamleader/create" ?
                  <Field name="emp_name" label="TeamLeader Name" isMandatory={true} component={FormikInputComponent} validate={(val) => duplicateTeamleader(val, values, "name")} />
                  : <Field name="emp_name" label="TeamLeader Name" isMandatory={true} component={FormikInputComponent} />
              }
            </Form.Group>

            <Form.Group widths={3}>
              {
                props.match.path === "/teamleader/create" ?
                  <Field name="emp_code" label="TeamLeader Code" component={FormikInputComponent} validate={(val) => duplicateTeamleader(val, values, "code")} />
                  : <Field name="emp_code" label="TeamLeader Code" component={FormikInputComponent} />
              }
            </Form.Group>

            <Form.Group widths={3}>
              <SalesManagerSelect name='prnt_id' isSelection={true} isMandatory={true} isTxn='false' label='Sales Manager' />
            </Form.Group>
            <Form.Group widths={3}>
              <Field name='mobile' label='Mobile No' component={FormikInputComponent} />
            </Form.Group>
            <Form.Group widths={3}>
              <Field name='PAN_NO' label='PAN No' component={FormikInputComponent} />
            </Form.Group>


            <Button type="submit" size="medium" color="blue" className="CustomeBTN">
              {params.submitButtonText}
            </Button>

            {console.log(errors)}
            {savedTeamleaderId ?
              <Notification id={savedTeamleaderId} resetForm={resetForm} notifySelector={getNotification} notifyDoneAction={setNotifyDone} type='save' />
              :
              null}
          </Form>
        )}
      />
    </Container>
  )
}

export default TeamLeaderForm