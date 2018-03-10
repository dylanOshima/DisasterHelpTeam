# Backend for Disaster Response Bot
## Starting the server
Type `DEBUG=myapp:* PORT=[PORT] DB_PASSWORD=[PASSWORD] npm start` to start the server.
* Make sure you replace `[PORT]` with a port number (default is `3000`)
* Make sure you replace `[PASSWORD]` with the correct password when running it on the command line.

## Endpoints:
* `POST: /tin` - creates a new TIN
* `GET: /tin/:id` - returns the TIN with the given ID

* `POST: /responder` - creates a new RESPONDER
* `GET: /responder/:id` - returns the RESPONDER with the given ID
