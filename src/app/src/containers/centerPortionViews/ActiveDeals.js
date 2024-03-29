import React, {useEffect} from 'react'
import axios from 'axios'
import {
    FileFilled
  } from '@ant-design/icons'
import './activedeals.css'
import { Button } from 'antd'
import { Space, Table, Tag } from 'antd';

const ActiveDeals = () => {
  const [files, setFiles] = React.useState([])
  const [data, setData] = React.useState([])
  const allFiles = async() => {
      const fileList = await axios.get('http://localhost:8000/deal_data')
      console.log(fileList.data)
      const data = []
      let count = 1
      for(let i=0; i<files.length; i++) {
        for(let j=0; j<Object.keys(files[i].contains).length; j++) {
          // if(Object.keys(files[i].contains)[j]===""){
          //   continue
          // }
            data.push({
              key: count,
              filename: Object.keys(files[i].contains)[j]===""?'root':Object.keys(files[i].contains)[j],
              dealstatus: files[i].dealInfo.dealStatus?files[i].dealInfo.dealStatus:'',
              action: 'Download',
            })
        }
        count++
      }
      setFiles(fileList.data)
      console.log(data)
      setData(data)
  }
  useEffect(() => {
      allFiles()
  }, [])

  const retrieveFile = async(key) => {
    const response = await axios.get(
      `http://localhost:8000/retrieve_file?fileName=pexels-pixabay-33109.jpg&miner=t017840&payloadCid=bafybeiconwmig7xtsl3pdp57obyutj7poda4wjgmfciz7pmeymhjbetnmq`
    )
    console.log(response)
  }

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'filename',
      key: 'filename',
    },
    {
      title: 'Deal Status',
      dataIndex: 'dealstatus',
      key: 'dealstatus',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, rr) => <a onClick={(rr)=>{console.log(rr);retrieveFile(rr)}}>{rr.action}</a>,
    },
  ]

  const refreshdeal = async() => {
    for(let i=0; i<files.length; i++) {
      if(files[i].dealInfo.chainDealID==="")(
        await axios.get(
          `http://localhost:8000/refresh_deal?miner=${files[i].dealInfo.storageProvider}&dealUUID=${files[i].dealInfo.dealUUID}&payloadCid=${files[i].payloadCid}`
        )
      )
    }
    allFiles()
  }

return (
  <div>
    <div className='show-files-top'>
      <Button className='prepare-button' onClick={refreshdeal} type="primary">Refresh</Button>
    </div>
    <Table columns={columns} dataSource={data} />
  </div>
)
}

export default ActiveDeals
