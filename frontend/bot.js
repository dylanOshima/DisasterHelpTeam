let request = require('request');
const Token =
	'EAAInIgwoANcBACqeDEuTmW7PSeOoFqcEwGBSC8RK89oQ10LQCmczK4idZBxNgMKierVWZAucV22qsA2SPfcRRqZBztXi5lmCWqLXPE49fbkzQVu1vXwjZBildBkKctctoxCIfZBWDmR0OVgtT5k71NVv0Lmiyv5tuRZAZAPcUS0GAZDZD';

let id = '1907459852661174';

console.log('https://graph.facebook.com/v2.6/'+id+'?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token='+Token)

var port = 3000;

request(
	{
    url: 'http://localhost:'+port+'/responders',
		qs: { access_token: Token },
		method: 'POST',
    json: JSON.body
	}, (error, response, body) => {
		if (error) {
			console.log('Error sending message: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		} else {
			console.log("Body: ", body);
		}
	}
);
