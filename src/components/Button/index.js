import React from 'react'
import "./styles.css"
function Button({text,onCLick,blue,disabled}) {
  return (
    <div className={blue? "btn btn-blue" : 'btn'} 
    onClick={onCLick}
    disabled={disabled}
    >
        {text}
      
    </div>
  )
}

export default Button