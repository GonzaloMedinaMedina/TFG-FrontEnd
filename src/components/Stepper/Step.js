import React from 'react'

const Step = ({ title, descImgURL, children }) => {
  return (
    <div className="step step-container">
      <p className="step-container--title">{title}</p>
      <div className="step-container--description">
        <img src={descImgURL} alt={`alt-for-${title}`} />
      </div>
      {children}
    </div>
  )
}

export default Step;
