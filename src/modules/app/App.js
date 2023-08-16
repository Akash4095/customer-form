import React from 'react';
import {Route} from 'react-router';
import { Link } from "react-router-dom";
import { Provider } from 'react-redux';
import { ConnectedRouter} from 'connected-react-router'
import { history } from '../../configureStore'
import { menu } from './menu'
import SalesConsultant from '../salesconsultant/index'
import CiForm from '../ciform/index'
import SaleType from '../saletype/index'
import SalesManager from '../salesmanager/index';
import FinanceBank from '../financebank/index'
import FinanceConsultant from '../financeconsultant/index';
import LeadSource from '../leadsource/index';
import Customer from '../customer/index'
import FormType from '../formtype/index';
import crashCar from "../app/18_car-accident-r-256.png"
import TeamLeader from '../teamleader/index';
import Mtax from '../mtax/index'
import Segmap from '../segmap/index'
import VtNum from '../vtnum/index';
import userACL from '../../store/access';

import 'semantic-ui-less/semantic.less'
import { Container, Dropdown, Menu, Image, Icon } from 'semantic-ui-react'

// import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./rlb.png";



const App = ({ store }) => (
    <Provider store = {store}>
      <ConnectedRouter history={history} >        
        <Container className="paddingTopOnly">
        {
          userACL.atFetch().cid === 0 ? 
          <center>
            <div style={{paddingTop: '150px', color: 'red', fontSize: '25px'}}>Please check the configuration, Company not configured in Vehicle Sale</div>
            <br/><br/><br/>
            <Image src={crashCar} width="256" height="256" />
          </center>  
        :
          <>
            <Menu icon='labeled' id='menuContent'>
                <Menu.Item as={Link} to="/">
                  <Image src={logo} size='mini' className="logo"/>
                </Menu.Item>
                { menu.map((m, index) => {
                  return(
                    <Dropdown style={(m.id === "mtax") ? {position: 'relative', top: 'px'} : {}} as={Icon} id={m.id} item color="blue" title={m.title} text={<div className='iconNames'>{m.text}</div>} icon={m.icon} key={index} >
                    <Dropdown.Menu className="MenuFont">
                      {m.createPath ? <Dropdown.Item as={Link} to={m.createPath}>{m.createLabel}</Dropdown.Item>: ""}
                      {m.listPath ? <Dropdown.Item as={Link} to={m.listPath}>{m.listLabel}</Dropdown.Item>: ""}
                      {m.billPath ? <Dropdown.Item as={Link} to={m.billPath}>{m.billLabel}</Dropdown.Item> : ""}
                      {m.receiptPath ? <Dropdown.Item as={Link} to={m.receiptPath}>{m.receiptLabel}</Dropdown.Item> : ""}
                    </Dropdown.Menu>
                  </Dropdown>              
                  )
                })}
            </Menu>
            <Route path="/salesconsultant" component={SalesConsultant } /> 
            <Route path="/ciform" component={CiForm} /> 
            <Route path="/sale-type" component={SaleType} />
            <Route path='/salesmanager' component={SalesManager} />
            <Route path='/financebank' component={FinanceBank} />
            <Route path='/financeconsultant' component={FinanceConsultant} />
            <Route path='/leadsource' component={LeadSource} />
            <Route path='/customer' component={Customer} />
            <Route path='/form-type' component={FormType}  />
            <Route path='/teamleader' component={TeamLeader} />
            <Route path='/mtax' component={Mtax} />
            <Route path="/segmap" component={Segmap} />
            <Route path="/vt-num" component={VtNum} />
          </>
        }
        </Container> 
      </ConnectedRouter>
     </Provider>
    );

export default App;

