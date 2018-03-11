const http = require('http')
const Bot = require('messenger-bot')
const Token = 'EAACceGmDZCd4BALwdz2Yi0YecQyWzT0QuLSLlOXyqVIClws1gXZCun1mSuHHM0MMC4720poxpkAeV1vlnSXcZATH92CbKtVHXz7yu4tiUpnPW3i25dP49N5mFOOESZAYzbGHktjD3hByLr4ktjHo2C3akHqBZBKJZA4jHtY8TnagZDZD'

const REQUEST_NEED = "You have been registered as someone in need of help! We will match you with a responder soon!"
const REQUEST_RESPOND = "Thank you! You are being registered as a respondent and will soon receive a mission!";

let bot = new Bot({
    token: Token,
    verify: 'tuxedo_cat',
    app_secret: ''
})

bot.on('error', (err) => {
    console.log('Error 1: ', err.message)
})

bot.on('message', (payload, reply) => {
    console.log("FAM")
    sendMessage(payload)
    console.log(payload)
})

http.createServer(bot.middleware()).listen(5000)
console.log('Init: ','Echo bot server running at port 5000.')

const request = require('request');
const apiaiApp = require('apiai')('4ae9913945c14cac91644104feff9b6b');

function sendMessage(event) {
    let sender = event.sender.id;
    let text = event.message.text;
    
    let apiai = apiaiApp.textRequest(text, {
	sessionId: 'tabby_cat' // use any arbitrary id
    });
    
    apiai.on('response', (response) => {	
	let aiText = response.result.fulfillment.speech;
	
	if(aiText === REQUEST_NEED) {
	    // GET https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=<PAGE_ACCESS_TOKEN>

	    console.log("FAM!")
	    request({
		url: 'https://graph.facebook.com/v2.6/${event.sender.id}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${TOKEN}',
		qs: {access_token: Token},
		method: 'GET'
	    }, (error, response) => {
		if (error) {
		    console.log('Error sending message: ', error);
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error);
		}
	    });
	    
	    console.log(request.body)
	    
	    // Parse body and put to db
	    
	    console.log('Log 1: ', 'REQUEST_NEED')
	}
	
	if(aiText === REQUEST_RESPOND) {
	    // GET https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=<PAGE_ACCESS_TOKEN>
	    request({
		url: 'https://graph.facebook.com/v2.6/${event.sender.id}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${TOKEN}',
		qs: {access_token: Token},
		method: 'GET'
	    }, (error, response) => {
		if (error) {
		    console.log('Error sending message: ', error);
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error);
		}
	    });
	    
	    console.log(request.body)
	    
	    // Parse body and put to db
	    
	    console.log('Log 2: ', 'REQUEST_RESPOND')
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
