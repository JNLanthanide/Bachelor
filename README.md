# How to run the code for Attaining privacy preservation in decentralized access control systems using blockchain by Jasper Neo Lassen.

Prerequisites:

Node.js:
https://nodejs.org/en/download/

Chrome CORS plugin:
https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf

recommended:
Live server (visual studio code extension).


Guide:

1. Run: "npm i" inside RO-PEP, SR-PEP and PDP folders.

2. Run "node index.js" inside RO-PEP, SR-PEP and PDP folders.

3. Host Hospital locally on port :5501. This is automatically set up if done though the visual studio code live server extension.

You are now ready to use the access control system.

Functionality:

Publishing a policy:
    To publish a policy, a http post request to "127.0.0.1:3000/UploadPolicy" is required. This can be done through programs such as Postman. The body should be raw input, and in the xml format. An example xacml policy can be found in this directory.


Requesting access:
    Go to http://127.0.0.1:3000 - this is the RO-PEP. From here you can initialize the grant access request, by clicking request resource. When you hit the login page, the username is "admin" and the password is "admin".

Getting access:
    After you have requested access and received a token, go to http://127.0.0.1:3000. Click access, and the file HeartJournal.txt will appear in the SR-PEP/src directory


Tests:
    To run the unit tests, write "npm test" inside either the RO-PEP or SR-PEP directory.

PerformanceTests:
    The performance test can be run by entering "node index.js" inside the Performance testing environment.