function requestResource(filename) {
    const PDP = "http://127.0.0.1:3001"
    const PEP = "127.0.0.1"
    location.replace(`${PDP}?PEP=${PEP}&Filename=${filename}`)
}

var xmlHttp = new XMLHttpRequest();

function accessResource(filename) {
    xmlHttp.open("POST", "http://127.0.0.1:3002/GetAccessToken")
    xmlHttp.setRequestHeader("Content-Type", "text/plain")
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        console.log("YEEEEEES")
        console.log(xhttp.responseText);
        }
    };
    xmlHttp.send(filename);
}