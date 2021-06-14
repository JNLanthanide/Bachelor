// Start grant access flow by redirecting to PDP
function requestResource(filename) {
    const PDP = "http://127.0.0.1:3001"
    const PEP = "127.0.0.1"
    location.replace(`${PDP}?PEP=${PEP}&Filename=${filename}`)
}

var xmlHttp = new XMLHttpRequest();
// start get access flow by requesting access token
function accessResource(filename) {
    xmlHttp.open("POST", "http://127.0.0.1:3002/GetAccessToken")
    xmlHttp.setRequestHeader("Content-Type", "text/plain")
    xmlHttp.send(filename);
}