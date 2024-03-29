const { execute } = require("../utils");

exports.import_wallet = async(privateKey) =>{
  const data = await execute(`boost wallet import ${privateKey}`)
  return data.trim()
}

exports.export_wallet = async(publicKey) =>{
  const data = await execute(`boost wallet export ${publicKey}`)
  return data.trim()
}

exports.create_wallet = async() =>{
    const data = await execute(`boost wallet new`)
    return data.trim()
}

exports.delete_wallet = async(address) =>{
    const data = await execute(`boost wallet delete ${address}`)
    return data.trim()
}

exports.getWalletBalance = async() =>{
    const data = await execute(`boost wallet list`);
    const split = data.split('\n')
    let wallet = []
    for(let i=1; i<split.length-1; i++) {
      const further_split = split[i].split(' ')
      let temp = {
        address: further_split[0],
        balance: '',
        dataCap: '',
        default: ''
      }
      for(let j=1; j<further_split.length; j++) {
        if(further_split[j]!=='') {
          temp.balance = further_split[j]
          break
        }
      }
  
      let count = 0
      for(let j=further_split.length-1; j>0; j--) {
        if(further_split[j]!=='') {
          if(count===0){
            temp.dataCap = further_split[j]
            count++
          }
          if(count===1) {
            if(further_split[j]==='X') {
              temp.default = true
            }
          }
        }
      }
      wallet.push(temp)
    }
    return(wallet)
}

