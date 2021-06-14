var tokens = [];

module.exports = {
    // Store token in memory, with associated filename.
    StoreToken: token => {
      tokens.push(token)
      tokens.forEach(token => console.log("messageId: " + token.messageId + " Filename: " + token.filename));
    },

    // Find token with associated filename, and return the messageId
    GetToken: filename => {
        var messageId = '';
        tokens.forEach(token => {
            if (token.filename == filename) {
                messageId = token.messageId;
            }
        })
        if (messageId != '') {
            return messageId;
        } else {
            return 'No token found';
        }
    }
}