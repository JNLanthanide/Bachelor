var tokens = [];

module.exports = {
    StoreToken: token => {
      tokens.push(token)
      tokens.forEach(token => console.log("messageId: " + token.messageId + " Filename: " + token.filename));
    },

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