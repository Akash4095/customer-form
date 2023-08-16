import React from 'react'
import { Calculator } from 'react-mac-calculator'
import { Button, Grid, Icon, Segment } from 'semantic-ui-react'

const CalculatorComponent = (props) => {
  return (

    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", marginTop: "70px", marginLeft: "88px" }}>
        <Icon name='close' size='large' color='red' onClick={()=>{props.setCalculatorOpen(false)}} style={{marginLeft: "90%"}} ></Icon>
        <Calculator />
      </div>
    </div>

  )
}

export default CalculatorComponent