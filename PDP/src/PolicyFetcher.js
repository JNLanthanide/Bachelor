/*
const Mam = require('@iota/mam');

const { asciiToTrytes, trytesToAscii } = require('@iota/converter');

const mode = 'restricted';
const sideKey = 'VERYSECRETKEY';
const provider = 'https://nodes.devnet.iota.org';

const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&key=${sideKey.padEnd(81, '9')}&root=`;

// Initialise MAM State
let mamState = Mam.init(provider);

// Set channel mode
mamState = Mam.changeMode(mamState, mode, sideKey);

//Log fetched policy
const logData = data => console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n');

// Get policy from tangle
const GetPolicy = async root => {
        await Mam.fetch(root, mode, sideKey, logData);
        console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
}
*/

const GetPolicyStub = async () => {
  return 1;
}

//exports.GetPolicy = GetPolicy;
exports.GetPolicyStub = GetPolicyStub;

/*
const publish = async packet => {
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
*/

/*
const publishAll = async () => {
  const root = await publish({
    message: 'Message from Alice',
    timestamp: (new Date()).toLocaleString()
  })

  await publish({
    message: 'Message from Bob',
    timestamp: (new Date()).toLocaleString()
  })

  await publish({
    message: 'Message from Charlie',
    timestamp: (new Date()).toLocaleString()
  })

  await publish({
    message: 'Message from JN',
    timestamp: (new Date()).toLocaleString()
  })

  return root
}

// Callback used to pass data out of the fetch
const logData = data => console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')

publishAll()
  .then(async root => {

    // Output asyncronously using "logData" callback function
    await Mam.fetch(root, mode, sideKey, logData)

    // Output syncronously once fetch is completed
    const result = await Mam.fetch(root, mode, sideKey)
    result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))

    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
  })
  */