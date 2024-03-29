import React, { useState } from 'react'
import './topbar.css'
import axios from 'axios'
import { Modal, Button } from 'antd'

const TopBar = () => {
  const [visible, setVisible] = useState(false);
  const wallet = localStorage.getItem('wallet');
  const [walletDetails, setWalletDetails] = useState(null)
  const truncatedWallet = wallet.length > 10 ? wallet.slice(0, 10) + '...' : wallet;
  const users = ['t017840 - USA', 't017387 - USA']; // List of users

  const handleCancel = () => {
    setVisible(false);
  }
  const handleOk = async () => {
    setVisible(false);
  }

  const getBalance = async() =>{
    const walletInfo = await axios.get(
      `http://localhost:8000/list_wallet`
    )
    for(let i=0; i<walletInfo.data.length; i++) {
      if(parseInt(walletInfo.data[i].balance)>0) {
        setWalletDetails(walletInfo.data[i])
        break
      }
    }
  }
  React.useEffect(()=>{
    getBalance()
  }, [])

  return (
    <div className='top-bar'>
      <p onClick={()=>setVisible(true)}>{truncatedWallet}</p>&nbsp;&nbsp;&nbsp;&nbsp;
      <select style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', paddingRight: '10px' }}>
        {users.map(user => (
          <option key={user} value={user}>{user}</option>
        ))}
      </select>
      <Modal
          title="Profile"
          open={visible}
          onOk={handleOk}
          onCancel={handleCancel}
      >
        <div className='profile-modal'>
          {walletDetails?
          <>
            <span>Wallet:&nbsp;{walletDetails.address}</span><br/>
            <span>Wallet Balance:&nbsp;{walletDetails.balance}&nbsp;FIL</span>
            <br/><br/>
            <Button type='primary'>Recharge using Fiat</Button>
          </>
          :<></>
          }
        </div>
      </Modal>
    </div>
  )
}

export default TopBar
