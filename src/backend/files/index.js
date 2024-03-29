const fs = require('fs');
const path = require('path');
const { execute } = require("../utils");

exports.prepare_files = async(inputPath, outputPath) =>{
    const car = await execute(
        `generate-car --single -i ${inputPath} -o ${outputPath} -p ${inputPath}`
    )
    const jsonResponse = JSON.parse(car)
    const carSize = await execute(
        `stat --format="%s" ${outputPath}/${jsonResponse['PieceCid']}.car`
    )
    const fileRecord = {
        carSize: parseInt(carSize.trim()),
        pieceCid: jsonResponse['PieceCid'],
        pieceSize: jsonResponse['PieceSize'],
        payloadCid: jsonResponse['DataCid'],
        contains: jsonResponse['CidMap'],
        dealInfo: null,
        dealInitiated: false,
        createdAt: Date.now(),
    }

    const tempFilePath = path.resolve(__dirname, '../temp.json');
    const tempData = JSON.parse(fs.readFileSync(tempFilePath))
    tempData.push(fileRecord)
    fs.writeFileSync(tempFilePath, JSON.stringify(tempData, null, 2))
    await execute(
        `rm ${inputPath}/*`
    )
    return fileRecord
}
