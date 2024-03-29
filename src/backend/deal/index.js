const fs = require('fs');
const path = require('path');
const { execute } = require("../utils");

exports.find_miners = async() =>{
    const minerList = [
        {
            address: 't017840',
            location: 'USA'
        },
        {
            address: 't017387',
            location: 'Unknown'
        }
    ]
    return minerList
}

exports.deal_data = async() =>{
    const tempFilePath = path.resolve(__dirname, '../temp.json')
    const jsonData = JSON.parse(fs.readFileSync(tempFilePath, 'utf8'));
    return jsonData
}

exports.initiate_deal = async(miner, fileName, commp, carS, pieceS, payloadCid) =>{
    const ngrokURL = 'https://closing-humble-hermit.ngrok-free.app'
    const command = `
        boost deal --verified=false \
        --provider=${miner} \
        --http-url=${ngrokURL}/download_file?file_name=${fileName} \
        --commp=${commp} \
        --car-size=${carS} \
        --piece-size=${pieceS} \
        --storage-price=391000000 \
        --payload-cid=${payloadCid}
    `
    const dealResponse = await execute(command)
    const splitResponse = dealResponse.split('\n')
    const dealRecord = {
        dealUUID: splitResponse[1].split(':')[1].trim(),
        storageProvider: splitResponse[2].split(':')[1].trim(),
        startEpoch: splitResponse[7].split(':')[1].trim(),
        endEpoch: splitResponse[8].split(':')[1].trim(),
        providerCollateral: splitResponse[9].split(':')[1].trim(),
        publishCID: '',
        chainDealID: '',
        dealStatus: ''
    }

    const tempFilePath = path.resolve(__dirname, '../temp.json')
    const tempData = JSON.parse(fs.readFileSync(tempFilePath))
    const initiatedRecord = tempData.find(record => record.payloadCid === payloadCid)
    initiatedRecord.dealInfo = dealRecord
    console.log(dealRecord)
    initiatedRecord.dealInitiated = true
    fs.writeFileSync(tempFilePath, JSON.stringify(tempData, null, 2))
    return dealRecord
}

exports.refresh_deal_status = async(miner, dealUUID, payloadCid) =>{
    const command = `
        boost deal-status --provider=${miner} --deal-uuid=${dealUUID}
    `
    const statusResponse = await execute(command)
    const splitResponse = statusResponse.split('\n')

    const tempFilePath = path.resolve(__dirname, '../temp.json')
    const tempData = JSON.parse(fs.readFileSync(tempFilePath))
    const initiatedRecord = tempData.find(record => record.payloadCid === payloadCid)
    initiatedRecord.dealInfo.dealStatus = splitResponse[2].split(':')[1].trim()
    if(splitResponse[2].split(':')[1].trim().includes('sealing')) {
        initiatedRecord.dealInfo.publishCID = splitResponse[4].split(':')[1].trim()
        initiatedRecord.dealInfo.chainDealID = splitResponse[5].split(':')[1].trim()
    }
    fs.writeFileSync(tempFilePath, JSON.stringify(tempData, null, 2))
    return statusResponse
}
