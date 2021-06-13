
const Mam = require('@iota/mam');

const { asciiToTrytes, trytesToAscii } = require('@iota/converter');

const mode = 'restricted';
const sideKey = 'VERYSECRETKEY';
const provider = 'https://nodes.devnet.iota.org';

var policyRoot = '';

// Initialise MAM State
let mamState = Mam.init(provider);

// Set channel mode
mamState = Mam.changeMode(mamState, mode, sideKey);

module.exports = {
    UpdatePolicyRoot: root => {
      policyRoot = root;
    },

    Fetchpolicy: async () => {
      try {
        const result = await Mam.fetch(policyRoot, mode, sideKey)
        result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))
        return result.messages
      }
      catch(err) {
        console.log(err);
      }
    }
}