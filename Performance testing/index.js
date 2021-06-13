const Mam = require('@iota/mam')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const { performance } = require('perf_hooks');
var fs = require('fs');
const { ClientBuilder } = require('@iota/client')
const CryptoJS = require("crypto-js");

const mode = 'restricted'
const sideKey = 'VERYSECRETKEY'
const provider = 'https://nodes.devnet.iota.org'
const tokenKey = 'VERYSECRETKEY2'

const client = new ClientBuilder()
  .node('https://api.lb-0.testnet.chrysalis2.com')
  .build()

// Initialise MAM State
let mamState = Mam.init(provider)

// Set channel mode
mamState = Mam.changeMode(mamState, mode, sideKey)

let times = 'Create,Attach,Fetch\n'
let maskTimes = 'Mask,Unmask\n'

let tokenTimes = 'GrantAccess,GetAccess\n'

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }
// Publish to tangle
const publish = async packet => {
    var finalMessage = ''
    t0 = performance.now()
    const trytes = asciiToTrytes(JSON.stringify(packet))
    t1 = performance.now()
    const message = Mam.create(mamState, trytes)
    t2 = performance.now()

    mamState = message.state

    t3 = performance.now()
    await Mam.attach(message.payload, message.address, 3, 9)
    t4 = performance.now()
    const result = await Mam.fetch(message.root, mode, sideKey)
    t5 = performance.now()
    result.messages.forEach(message => 
        finalMessage += JSON.parse(trytesToAscii(message)).message)
    t6 = performance.now()
    console.log("Mask: " + (t1 - t0) + " ms")
    console.log("UnMask: " + (t6 - t5) + " ms")
    maskTimes += (t1 - t0) + ","
    maskTimes += (t6 - t5) + "\n"
    
    console.log("Creation: " + (t2 - t1) + " ms")
    times += (t2 - t1) + ","
    console.log("Attaching: " + (t4 - t3) + " ms")
    times += (t4 - t3) + ","
    console.log("Fetching: " + (t5 - t4) + " ms")
    times += (t5 - t4) + "\n"
}

async function GrantAccess(filename) {
    t0 = performance.now()
    const ciphertext = CryptoJS.AES.encrypt(filename, tokenKey).toString();
    const token = await client.message()
    .index('Filename')
    .data(ciphertext)
    .submit();
    t1 = performance.now()
    console.log("Result", t1 - t0)
    tokenTimes += (t1 - t0) + ","
    return token.messageId;
  }

async function GetAccess(filename, messageId) {
    t0 = performance.now()
    const getToken = await client.getMessage().data(messageId);
    const tokenDataHex = getToken.message.payload.data
    const tokenData = hex2a(tokenDataHex)
    const bytes = CryptoJS.AES.decrypt(tokenData, tokenKey)
    const result = bytes.toString(CryptoJS.enc.Utf8);
    t1 = performance.now()
    tokenTimes += (t1 - t0) + "\n"
    if (result == filename) return true;
    else return false;
}
async function performanceTestPolicy(){
    var i;
    for (i = 0; i < 50; i++) {
        await publish({
            message: '9'.repeat(3000)
        })
    }

    fs.writeFile(__dirname + '/Data.txt', times, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    })

    fs.writeFile(__dirname + '/MaskData.txt', maskTimes, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    })
}

async function performanceTestToken(){
    var i;
    for (i = 0; i < 50; i++) {
        const messageId = await GrantAccess('Performance')
        const result = await GetAccess('Performance', messageId) 
        if(!result)
        {
            console.log(result)
            console.log("ERROR")
            break
        }
    }

    fs.writeFile(__dirname + '/TokenData.txt', tokenTimes, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    })
}

performanceTestPolicy()