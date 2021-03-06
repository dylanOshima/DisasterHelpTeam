const http = require('http');
const Bot = require('messenger-bot');
const Token = 'EAACceGmDZCd4BAOQuBCUd8IBZC92pV7joTSQ8HOWZCCWi9oi3HpfnpZA7Tx2PhmUww6GvhSZBdZAEUjFLaj0oEwgFUAjUJ5vCbdIrTPDIdY1q1IqQL1Ka8UTGX6pgLF7gHatTJ7SMqP1rbqZCw0TsbW6WCNKqFE3rIo55BG4ZBaiRgZDZD'

const port = 3000;
var bot = new Bot({token: Token, verify: 'tuxedo_cat', app_secret: ''})
var responders = []
var human = {}

bot.on('error', (err) => {
  console.log('Error 1: ', err.message)
})

bot.on('message', (payload, reply) => {
  sendMessage(payload)
  console.log(payload)
})

http.createServer(bot.middleware()).listen(5000)
console.log('Init: ', 'Echo bot server running at port 5000.')

const apiaiApp = require('apiai')('4ae9913945c14cac91644104feff9b6b');

const REQUEST_NEED = "You have been registered as someone in need of help! We will match you with a responder soon!"
const REQUEST_RESPOND = "Thank you! You are being registered as a respondent and will soon receive a mission!";

var sender, text, apiai, aiText;

function getFBInfo() {
    request({
	url: 'https://graph.facebook.com/v2.6/' + sender + '?fields=first_name,last_name,location&access_token=' + Token,
	qs: {
            access_token: Token
	},
	method: 'GET'
    }, (error0, response0, body0) => {
	if (error0) {
	    console.log('Error sending message: ', error0);
	} else if (response0.body.error) {
	    console.log('Error: ', response0.body.error);
	} else {
	    console.log("body0:", body0);
	    return  body0;
	}
    }).then((dt) => { human = dt });
}

function getData(callback) {
    request({
	url: 'http://localhost:' + port + '/responders',
	method: 'GET'
    }, (error2, response2, body2) => {
	if (error2) {
	    console.log('Error sending message: ', error2);
	} else {
	    return body2;
	}
    }).then((dt) => {
	responders = dt[1];
	callback();
    });
}

function aiNeeds() {
    console.log('Log 1: ', 'REQUEST_NEED');
    
    request({
  	url: 'http://localhost:' + port + '/tin',
   	method: 'POST',
  	json: JSON.parse(human)
    }, (error, response, body) => {
  	if (error) {
     	    console.log('Error sending message: ', error);
  	} else if (response.body.error) {
  	    console.log('Error: ', response.body.error);
	} else if(responders !== undefined){ 
	    let resp;
	    responders.forEach((obj) => {
    	    	if (obj.status === 0) {
  	       	    obj.status = 1;
		    resp = obj;
		    return resp;
       	 	}
     	    })
	}
    }).then((resp) => {
	request({
            url: 'http://localhost:' + port + '/makePair',
            method: 'POST',
            json: {"responder_id":obj.id, "tin_id":human.id}
	}, (err, res, bd) => {
            if (err) {
		console.log('Error sending message: ', error);
            } else if (res.body.error) {
		console.log('Error: ', res.body.error);
            } else {
		console.log("Success")
            }
	})	
    });
}

function aiResponds() {
    console.log('Log 2: ', 'REQUEST_RESPOND');
    
    request({
	url: 'http://localhost:' + port + '/responder',
	method: 'POST',
	json: JSON.parse(human)
    }, (error, response, body) => {
	if (error) {
	    console.log('Error sending message: ', error);
	} else if (response.body.error) {
	    console.log('Error: ', response.body.error);
	}
    }).then((dt) => { });
}

function sendMessageToFB() {
    request({
	url: 'https://graph.facebook.com/v2.6/me/messages',
	qs: {
	    access_token: Token
	},
	method: 'POST',
	json: {
	    recipient: {
		id: sender
	    },
	    message: {
		text: aiText
	    }
	}
    }, (error, response) => {
	if (error) {
	    console.log('Error sending message: ', error);
	} else if (response.body.error) {
	    console.log('Error: ', response.body.error);
	}
    });
}

function sendMessage(event) {
    sender = event.sender.id;
    text = event.message.text;
    
    apiai = apiaiApp.textRequest(text, {
	sessionId: 'tabby_cat' // use any arbitrary id
    });
    
    console.log("sender: ", sender, " text: ", text);
    
    apiai.on('response', function(response) {
	aiText = response.result.fulfillment.speech;

	getData(function(){});
	if (aiText === REQUEST_NEED) {
	    aiNeeds();
	}
	
	if (aiText === REQUEST_RESPOND) {
	    aiResponds();
	}

	sendMessageToFB(sender, aiText);
    });
    
    apiai.on('error', (error) => {
	console.log(error);
    });
    
    apiai.end();
}
