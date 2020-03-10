const qs = require('querystring');
const fetch = require('node-fetch');
const BOT_TOKEN = process.env.BOT_TOKEN;

// Verify Url - https://api.slack.com/events/url_verification
function verify(data, callback) {
  if (data.token === BOT_TOKEN) callback(null, data.challenge);
  else callback("verification failed");   
}

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
function process(event, callback) {
  // test the message for a match and not a bot
  if (!event.bot_id && /(aws|lambda)/ig.test(event.text)) {
      var text = `<@${event.user}> News Bot Test From Leeseul`;
      var message = { 
          token: BOT_TOKEN,
          channel: event.channel,
          text: text
      };

      var query = qs.stringify(message); // prepare the querystring
      https.get(`https://slack.com/api/chat.postMessage?${query}`);
  }

  callback(null);
}

// Lambda handler
exports.handler = (data, context, callback) => {
  switch (data.type) {
      case "url_verification": verify(data, callback); break;
      case "event_callback": process(data.event, callback); break;
      default: callback(null);
  }
};