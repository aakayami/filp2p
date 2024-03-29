import React, {useEffect} from 'react'
import axios from 'axios'
import {
  FileFilled
} from '@ant-design/icons'
import './allfiles.css'
import { Button } from 'antd'

const AllFiles = () => {
    const [files, setFiles] = React.useState([])
    const allFiles = async() => {
        const fileList = await axios.get('http://localhost:8000/list_staging_files')
        console.log(fileList)
        setFiles(fileList.data)
    }
    useEffect(() => {
        allFiles()
    }, [])

    const prepareFiles = async() => {
      const prep = await axios.get('http://localhost:8000/prepare_files')
      await allFiles()
    }

  return (
    <div>
      <div className='show-files-top'>
        <Button className='prepare-button' onClick={prepareFiles} type="primary">Prepare Files</Button>
      </div>
      <div className='show-files'>
        {files.map((file, index) => (
            <div className='icon-box-files' key={index} style={{paddingLeft: '20px'}}>
                <FileFilled style={{fontSize: '50px', color: '#08c'}} />
                <p>{file}</p>
            </div>
        ))}
      </div>
    </div>
  )
}

export default AllFiles
