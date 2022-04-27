import React, { useState, useEffect } from 'react'
import Step from './Step'
import './Stepper'

const Stepper = (steps, props) => {

  const [activeData, setActiveData] = useState(steps);

  useEffect(() => {
    setActiveData(steps.steps[0])
  }, [])

  const handleClick = (e, step) => {
    e.target.classList.add('current')
    setActiveData(step)
  }

  const StepsButtons = () => {
    return steps.steps.map((step, index) => {
      return (
        <>
          <button className="step--button" onClick={(e) => { handleClick(e, step) }} onMouseOver={(e) => { handleClick(e, step) }} key={index}>{index + 1}</button>
        </>
      )
    });
  }
  return (
    <div className="stepper stepper-container">
      <div className="flex-wrapper">
        <StepsButtons />
      </div>
      <Step title={activeData.title} descImgURL={activeData.descImgURL} ></Step>
    </div>
  );
}

export default Stepper