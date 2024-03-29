const fs = require('fs');
const path = require('path');
const { execute } = require("../utils");

exports.retrieve_files = async(miner, outPath, payloadCid) =>{
    const command = `
        boost retrieve --provider ${miner}  --output ${outPath} ${payloadCid}
    `
    const response = await execute(command)
}
