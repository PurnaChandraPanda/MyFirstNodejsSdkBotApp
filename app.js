var restify = require('restify')
var builder = require('botbuilder');
var azure = require('botbuilder-azure');

// Just for test on console
//var connector = new builder.ConsoleConnector().listen();

// Setup Restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

var documentDbOptions = {
    host: process.env.StoreHostUrl, 
    masterKey: process.env.StoreHostMasterKey, 
    database: 'botdocs',   
    collection: 'botdata'
};
var docDbClient = new azure.DocumentDbClient(documentDbOptions);
var cosmosStorage = new azure.AzureBotStorage({ gzipData: false }, docDbClient);

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said"')
//var bot = new builder.UniversalBot(connector, function(session){
//    session.send("You said: %s", session.message.text);
//});

//var bot = new builder.UniversalBot(connector, function (session) {
//    // ... Bot code ...
//    session.send("You said: %s", session.message.text);
//})
//.set('storage', cosmosStorage);

const bot = new builder.UniversalBot(connector, function (session) {
    const message = session.message.text;
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('done');
        }, 500);
    });
    promise.then((result) => {
        session.send('message: ' + message + ' result: ' + result);
    })
})
.set('storage', cosmosStorage);