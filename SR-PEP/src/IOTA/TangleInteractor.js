const Mam = require('@iota/mam');
const { asciiToTrytes } = require('@iota/converter');
const { ClientBuilder } = require('@iota/client')
const CryptoJS = require("crypto-js");

const mode = 'restricted';
const sideKey = 'VERYSECRETKEY';
const provider = 'https://nodes.devnet.iota.org';
const tokenKey = 'VERYSECRETKEY2'

const client = new ClientBuilder()
  .node('https://api.lb-0.testnet.chrysalis2.com')
  .build()

// Initiate MAMstate in restricted mode with sidekey
let mamState = Mam.init(provider);
mamState = Mam.changeMode(mamState, mode, sideKey);

// Merkle Root at the beginning of policy channel
var policyRoot = '';

// Hex to ascii converter
function hex2a(hexx) {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

module.exports = {
  // Create message with encrypted filename in indexation payload
  CreateGrantAccessToken: async filename => {
    const ciphertext = CryptoJS.AES.encrypt(filename, tokenKey).toString();
    const token = await client.message()
    .index('Filename')
    .data(ciphertext)
    .submit();
    return token.messageId;
  },

  // Get access token, decrypt it and check whether filename is equal to request file
  VerifyGrantAccessToken: async (filename, messageId) => {
    const getToken = await client.getMessage().data(messageId);
    const tokenDataHex = getToken.message.payload.data
    const tokenData = hex2a(tokenDataHex)
    const bytes = CryptoJS.AES.decrypt(tokenData, tokenKey)
    const result = bytes.toString(CryptoJS.enc.Utf8);
    if (result == filename) return true;
    else return false;
  },

  // Publish package to MAM channel
  publish: async packet => {
    // Create MAM message as a string of trytes
    const trytes = asciiToTrytes(JSON.stringify(packet));
    const message = Mam.create(mamState, trytes);

    // Save your new mamState
    mamState = message.state;
    // Attach the message to the Tangle
    try {
      await Mam.attach(message.payload, message.address, 3, 9);
    }
    catch(err) {
      console.log(err);
    }

    console.log('Published', packet, '\n');
    policyRoot = message.root;
    return message.root;
  },

  fetch: async root => { // Included for testing
    return await Mam.fetch(root, mode, sideKey);
  }
}