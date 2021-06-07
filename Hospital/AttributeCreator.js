function createAttribute(attributeId, value) {
	return { AttributeId: attributeId, Value: value };

}

module.exports = {
    GeneratePolicyRequest() {
        var jsonRequest = new Object();
        jsonRequest.Request = new Object();
        //jsonRequest.Request.ReturnPolicyIdList = true;
        jsonRequest.Request.AccessSubject = new Object();
        jsonRequest.Request.AccessSubject.Attribute = [];
        jsonRequest.Request.AccessSubject.Attribute.push(createAttribute("user.location", "Chicago"))
    
        return jsonRequest;
    }
}