http = require('http')
const Bot = require('messenger-bot')
const Token = 'EAACceGmDZCd4BALwdz2Yi0YecQyWzT0QuLSLlOXyqVIClws1gXZCun1mSuHHM0MMC4720poxpkAeV1vlnSXcZATH92CbKtVHXz7yu4tiUpnPW3i25dP49N5mFOOESZAYzbGHktjD3hByLr4ktjHo2C3akHqBZBKJZA4jHtY8TnagZDZD'

const REQUEST_NEED = "You have been registered as someone in need of help! We will match you with a responder soon!"
const REQUEST_RESPOND = "Thank you! You are being registered as a respondent and will soon receive a mission!";

const port = 3000;
var bot = new Bot({
    token: Token,
    verify: 'tuxedo_cat',
    app_secret: ''
})

bot.on('error', (err) => {
    console.log('Error 1: ', err.message)
})

bot.on('message', (payload, reply) => {
    sendMessage(payload)
    console.log(payload)
})

http.createServer(bot.middleware()).listen(5000)
console.log('Init: ','Echo bot server running at port 5000.')

const request = require('request');
const apiaiApp = require('apiai')('4ae9913945c14cac91644104feff9b6b');

function getData() {    
    request({
	url: 'http://localhost:'+port+'/responders',
	method: 'GET'
    }, (error2, response2, body2) => {
	if (error2) {
	    console.log('Error sending message: ', error2);
	} else {
	    console.log("FAM");
	    responders = body2;
	}
    })
    
    request({
    	url: 'http://localhost:'+port+'/tin',
	method: 'POST',
    	json: JSON.parse(body0)
    }, (error, response, body) => {
	if (error) {
	    console.log('Error sending message: ', error);
	} else if (response.body.error) {
	    console.log('Error: ', response.body.error);
	} else {
	    console.log("Body1: ", responders);
	    responders.forEach((obj) => {
		if(obj.status === 0){
		    obj.status = 1;
		    console.log("Pair: ", data, obj);
		}
	    })
	}
    })

    request({
    	url: 'http://localhost:'+port+'/responder',
	method: 'POST',
    	json: JSON.parse(body)
    }, (error, response, body) => {
	if (error) {
	    console.log('Error sending message: ', error);
	} else if (response.body.error) {
	    console.log('Error: ', response.body.error);
	} else {
	    console.log("Body: ", body);
	    responders.append(body);
	}
    });

    
}

function sendMessage(event) {
    var sender = event.sender.id;
    var text = event.message.text;
    var responders = []

    console.log(responders)
    
    var apiai = apiaiApp.textRequest(text, {
	sessionId: 'tabby_cat' // use any arbitrary id
    });

    console.log("sender: ", sender," text: ", text);
 
    apiai.on('response', function(response) {	
	var aiText = response.result.fulfillment.speech;

	if(aiText === REQUEST_NEED) {
	    // GET https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=<PAGE_ACCESS_TOKEN>
	    console.log('Log 1: ', 'REQUEST_NEED')
	    request({
		url: 'https://graph.facebook.com/v2.6/'+sender+'?fields=first_name,last_name,location&access_token='+Token,
                qs: {access_token: Token},
		method: 'GET'
	    }, (error0, response0, body0) => {
		if (error0) {
		    console.log('Error sending message: ', error0);
		} else if (response0.body.error) {
		    console.log('Error: ', response0.body.error);
		} else {
		    console.log(body0);
		    
		} 
	    });
	    
	}
	
	if(aiText === REQUEST_RESPOND) {
	    // GET https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=<PAGE_ACCESS_TOKEN>
	    
	    console.log('Log 2: ', 'REQUEST_RESPOND')
	    request({
		url: 'https://graph.facebook.com/v2.6/'+sender+'?fields=first_name,last_name,location&access_token='+Token,
                qs: {access_token: Token},
		method: 'GET'
	    }, (error, response, body) => {
		if (error) {
		    console.log('Error sending message: ', error);
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error);
		} else {
		    console.log(body);
		} 
	    });
	    
	    console.log(request.body)
	}

	request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: Token},
            method: 'POST',
            json: {
		recipient: {id: sender},
		message: {text: aiText}
            }
	}, (error, response) => {
            if (error) {
		console.log('Error sending message: ', error);
            } else if (response.body.error) {
		console.log('Error: ', response.body.error);
            }
	});
    });
    
    apiai.on('error', (error) => {
	console.log(error);
    });
    
    apiai.end();
}
