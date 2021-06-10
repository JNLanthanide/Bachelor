const Mam = require('@iota/mam');
const Iota = require('@iota/core');
//const MultiSigIota = require('iota.crypto.js');
const { asciiToTrytes, trytesToAscii } = require('@iota/converter');
const converter = require('@iota/converter');
const { ClientBuilder } = require('@iota/client')
const CryptoJS = require("crypto-js");

const mode = 'restricted'
const sideKey = 'VERYSECRETKEY'
const iotaProvider = 'https://nodes.devnet.iota.org'
const tokenKey = 'VERYSECRETKEY2'

const iota = Iota.composeAPI({
  provider: 'https://nodes.devnet.iota.org'
  });

const client = new ClientBuilder()
  .node('https://api.lb-0.testnet.chrysalis2.com')
  .build()

// Initialise MAM State
let mamState = Mam.init(iotaProvider)

// Set channel mode
mamState = Mam.changeMode(mamState, mode, sideKey)

// Publish to tangle
module.exports = {
    publish: async packet => {
        // Create MAM Payload - STRING OF TRYTES
        const trytes = asciiToTrytes(packet)
        const message = Mam.create(mamState, trytes)

        // Save new mamState
        mamState = message.state

        // Attach the payload
        await Mam.attach(message.payload, message.address, 3, 9)

        console.log('Published', packet, '\n');
        return message.root
	}
}

function hex2a(hexx) {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

// Create GrantAccessToken message
module.exports = {
    CreateGrantAccessToken: async filename => {
      const ciphertext = CryptoJS.AES.encrypt(filename, tokenKey).toString();
      const token = await client.message()
      .index('Filename')
      .data(ciphertext)
      .submit();
      return token.messageId;
    }
}

module.exports = {
    VerifyGrantAccessToken: async (filename, messageId) => {
      const getToken = await client.getMessage().data(messageId);
      const tokenDataHex = getToken.message.payload.data
      const tokenData = hex2a(tokenDataHex)
      const bytes = CryptoJS.AES.decrypt(tokenData, tokenKey)
      const result = bytes.toString(CryptoJS.enc.Utf8);
      if (result == filename) return true;
      else return false;
    }
}