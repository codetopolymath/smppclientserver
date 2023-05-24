var smpp = require('smpp');
const https = require('https');

// call API for sms.maverick server
function callSMSApi(to) {
  const url = `https://sms.maverick-dk.com/app/smpp-call?to=${to}`;

  https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      console.log(data);
    });
  }).on('error', (error) => {
    console.error(error);
  });
}

var server = smpp.createServer({
	debug: true, host:'0.0.0.0', system_id:"rohitSMPPSever"
}, function(session) {

	// ERROR
	session.on('error', function (err) {
		console.log(err)
  	});

	// SUBMIT_SM
	session.on("submit_sm", function(pdu) {
	callSMSApi(pdu.destination_addr);
});

	// BIND_TRANSCEIVER
	session.on('bind_transceiver', function(pdu) {
		//console.log(pdu);
		// we pause the session to prevent further incoming pdu events,
		// untill we authorize the session with some async operation.
		//session.pause();
		// commenting code for USERNAME and PASSWORD check

		/*checkAsyncUserPass(pdu.system_id, pdu.password, function(err) {
			if (err) {
				session.send(pdu.response({
					command_status: smpp.ESME_RBINDFAIL
				}));
				session.close();
				return;
			} */
			session.send(pdu.response());
			//session.resume();
		});
	});
//});

console.log("SMPPServer live on 8000...")
server.listen(8000);

