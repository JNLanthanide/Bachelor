//var AttributeCreator = require('./AttributeCreator')
function createAttribute(attributeId, value) {
	return { AttributeId: attributeId, Value: value };

}

function GeneratePolicyRequest() {
    var jsonRequest = new Object();
    jsonRequest.Request = new Object();
    //jsonRequest.Request.ReturnPolicyIdList = true;
    jsonRequest.Request.AccessSubject = new Object();
    jsonRequest.Request.AccessSubject.Attribute = [];
    jsonRequest.Request.AccessSubject.Attribute.push(createAttribute("user.location", "Chicago"));

    return jsonRequest;
}

function validate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username == "admin" && password == "admin") {
        const urlParams = new URLSearchParams(window.location.search);
        const PEP = urlParams.get('PEP');
        const PDP = `${urlParams.get('PDP')}/EvaluatePolicy`;
        const Filename = urlParams.get('Filename');
        const Website = `${PDP}?PEP=${PEP}&Filename=${Filename}`;
        alert('login successful')
        var userAttributes = GeneratePolicyRequest();
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.withCredentials = false;
        xmlHttp.open("POST", Website)
        //xmlHttp.setRequestHeader("Access-Control-Allow-Origin", website)
        xmlHttp.setRequestHeader("Content-Type", "application/json")
        xmlHttp.send(JSON.stringify(userAttributes));
    }
}