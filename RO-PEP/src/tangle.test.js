const TangleInteractor = require('./IOTA/TangleInteractor')
const { trytesToAscii } = require('@iota/converter');
jest.setTimeout(10000);

test('Publishing message to the tangle, and fetching yields unchanged indexation payload, input "ABCDEFGHIJKLMNOP"', async () => {
    const messageId = await TangleInteractor.CreateGrantAccessToken("ABCDEFGHIJKLMNOP")
    const result = await TangleInteractor.VerifyGrantAccessToken("ABCDEFGHIJKLMNOP", messageId)
    expect(result).toBe(true);
})

test('Publishing message to the tangle, and fetching yields unchanged indexation payload, input ""', async () => {
    const messageId = await TangleInteractor.CreateGrantAccessToken("")
    const result = await TangleInteractor.VerifyGrantAccessToken("", messageId)
    expect(result).toBe(true);
})

test('Publishing message to the tangle, and fetching yields unchanged indexation payload, input "32340u1208jd1290+uihfje892hr7912h3r9782hf179h2d37812gd182gbf8y123gfb12836r612g8fb1428ofawdasddadjnsjc ndlaskmfn9"', async () => {
    const messageId = await TangleInteractor.CreateGrantAccessToken("32340u1208jd1290+uihfje892hr7912h3r9782hf179h2d37812gd182gbf8y123gfb12836r612g8fb1428ofawdasddadjnsjc ndlaskmfn9")
    const result = await TangleInteractor.VerifyGrantAccessToken("32340u1208jd1290+uihfje892hr7912h3r9782hf179h2d37812gd182gbf8y123gfb12836r612g8fb1428ofawdasddadjnsjc ndlaskmfn9", messageId)
    expect(result).toBe(true);
})

test(`Publishing message to the tangle, and fetching yields unchanged indexation payload, input "${"9".repeat(100)}"`, async () => {
    const messageId = await TangleInteractor.CreateGrantAccessToken("9".repeat(100))
    const result = await TangleInteractor.VerifyGrantAccessToken("9".repeat(100), messageId)
    expect(result).toBe(true);
})


test('Publishing MAM transaction to the tangle, and fetching yields unchanged data, input "ABCDEFGHIJKLMNOP"', async () => {
    const root = await TangleInteractor.publish({
        message: "ABCDEFGHIJKLMNOP"
    })
    var finalMessage = ""
    const result = await TangleInteractor.fetch(root)
    result.messages.forEach(message => 
        finalMessage = finalMessage + JSON.parse(trytesToAscii(message)).message)
    expect(finalMessage).toBe("ABCDEFGHIJKLMNOP");
})

test('Publishing MAM transaction to the tangle, and fetching yields unchanged data, input ""', async () => {
    const root = await TangleInteractor.publish({
        message: ""
    })
    var finalMessage = ""
    const result = await TangleInteractor.fetch(root)
    result.messages.forEach(message => 
        finalMessage = finalMessage + JSON.parse(trytesToAscii(message)).message)
    expect(finalMessage).toBe("");
})

test('Publishing MAM transaction to the tangle, and fetching yields unchanged data, input "32340u1208jd1290+uihfje892hr7912h3r9782hf179h2d37812gd182gbf8y123gfb12836r612g8fb1428ofawdasddadjnsjc ndlaskmfn9"', async () => {
    const root = await TangleInteractor.publish({
        message: "32340u1208jd1290+uihfje892hr7912h3r9782hf179h2d37812gd182gbf8y123gfb12836r612g8fb1428ofawdasddadjnsjc ndlaskmfn9"
    })
    var finalMessage = ""
    const result = await TangleInteractor.fetch(root)
    result.messages.forEach(message => 
        finalMessage = finalMessage + JSON.parse(trytesToAscii(message)).message)
    expect(finalMessage).toBe("32340u1208jd1290+uihfje892hr7912h3r9782hf179h2d37812gd182gbf8y123gfb12836r612g8fb1428ofawdasddadjnsjc ndlaskmfn9");
})

test(`Publishing MAM transaction to the tangle, and fetching yields unchanged data, input "${"9".repeat(100)}"`, async () => {
    const root = await TangleInteractor.publish({
        message: "9".repeat(100)
    })
    var finalMessage = ""
    const result = await TangleInteractor.fetch(root)
    result.messages.forEach(message => 
        finalMessage = finalMessage + JSON.parse(trytesToAscii(message)).message)
    expect(finalMessage).toBe("9".repeat(100));
})