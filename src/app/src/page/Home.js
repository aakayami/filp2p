import React, {useState} from 'react'
import './home.css'
import { Button, Modal, Input } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [visible, setVisible] = useState(false);
    const [privateKey, setPrivateKey] = useState('');
    const navigate = useNavigate();

    const handleCancel = () => {
        setVisible(false);
    }
    const handleOk = async () => {
        console.log(privateKey)
        const wallet = await axios.get(`http://localhost:8000/import_wallet?privateKey=${privateKey}`);
        console.log(wallet)
        localStorage.setItem('wallet', wallet.data)
        setVisible(false);
        navigate('/dashboard');
    }

    const importWallet = () => {
        setVisible(true);
    }

    const createWallet = async() => {
        const wallet = await axios.get('http://localhost:8000/create_wallet')
        console.log(wallet)
        localStorage.setItem('wallet', wallet.data)
        navigate('/dashboard');
    }

  return (
    <div className='login-container'>
      <div className='login-box'>
        <strong><p style={{fontSize: '20px'}}>Welcome to FilP2P</p></strong>
        <Button className='import-button' onClick={importWallet} type="primary">Import Wallet</Button>
        <Button className='create-button' onClick={createWallet} type="primary">Create Wallet</Button>
      </div>
      <Modal
            title="Enter Private Key"
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Input value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="Enter private key" />
        </Modal>
    </div>
  )
}

export default Home
