var smpp = require('smpp');
var urlencode = require('urlencode');
var https = require('https');
var http = require('http');

// call API for sms.maverick server
function callSMSApi(to) {
  //const url = `https://sms.maverick-dk.com/app/smpp-call?to=${to}`;
  //const url = `https://sms.demosimplicity.com/app/smpp-call?shootID=0123456789ABCD26&number=${number}&peid=${peid}&cid=${cid}&message=this%20is%20test%20message%20by%20V-Conn&header=BulkAr&ip=${ip}&reportURL=http://143.110.242.221:8080/report&na=0`;
  const url = `https://sms.demosimplicity.com/app/smpp-call?shootID=0123456789ABCD89&number=${number}&peid=${peid}&cid=${cid}&message=This+is+a+Test+Message+by+V-Con&header=BulkAr&ip=${ip}&reportURL=http://143.110.242.221:8080/report&na=0`;
  console.log(url);
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
	const payload_data = pdu.message_payload.message;
	var message_payload = JSON.parse(payload_data);
	console.log(message_payload);
	//callSMSApi(number=pdu.destination_addr, peid=message_payload.peid, cid=message_payload.cid, ip=message_payload.ip);
	params = {"number": pdu.destination_addr, "peid": message_payload.peid , "cid": message_payload.cid, "message": urlencode(pdu.short_message.message), "ip": message_payload.ip}
	console.log(params)
	callSMSApi(number=params.number, peid=params.peid, cid=params.cid, ip=params.ip);
});

	// BIND_TRANSCEIVER
	session.on('bind_transceiver', function(pdu) {
	    
	    // maintain live connections
	        const ipv4Regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
	        var remoteAddress = session.socket.remoteAddress
	        var IPV4remoteAddress = remoteAddress.match(ipv4Regex)[0];
	        console.log(`system_id: ${pdu.system_id}, username: ${pdu.password}, remoteAddress: ${IPV4remoteAddress}`);
	
		console.log(pdu);
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

