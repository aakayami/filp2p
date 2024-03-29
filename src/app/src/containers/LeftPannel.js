import React from 'react'
import './leftpannel.css'
import { useDispatch, useSelector } from 'react-redux'
import {setValue} from '../redux/viewComponent'

const LeftPannel = () => {
  const dispatch = useDispatch()
  const { selected } = useSelector((state) => state.selectedOption)

  return (
    <div className='leftpannel'>
      <div className={`pannelbutton ${selected === 1 ? 'selected' : ''}`} onClick={() => dispatch(setValue(1))}>
        Files
      </div>
      <div className={`pannelbutton ${selected === 2 ? 'selected' : ''}`} onClick={() => dispatch(setValue(2))}>
        Staging
      </div>
      <div className={`pannelbutton ${selected === 3 ? 'selected' : ''}`} onClick={() => dispatch(setValue(3))}>
        Active Deals
      </div>
      <div className={`pannelbutton ${selected === 4 ? 'selected' : ''}`} onClick={() => dispatch(setValue(4))}>
        Expired Deals
      </div>      
    </div>
  )
}

export default LeftPannel
