const qs = require('querystring');
const fetch = require('node-fetch');
const BOT_TOKEN = process.env.BOT_TOKEN;
const API_KEY = process.env.API_KEY;

// Verify Url - https://api.slack.com/events/url_verification
const verify = (data, callback) => {
  if (data.token === BOT_TOKEN) callback(null, data.challenge);
  else callback("verification failed");   
}

// Fetch News data
const getNewsData = (event) => {
  const results = new Promise((resolve, reject) => {
    const keyword = event.text.trim();
    fetch(`https://content.guardianapis.com/search?q=${keyword}&api-key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const str = JSON.stringify(data.response.results);
      resolve(str);
    })
    .catch(err => reject(err));
  });
}


// Post message to Slack - https://api.slack.com/methods/chat.postMessage
const post = (event, callback) => {
  // test the message for a match and not a bot
  if (!event.bot_id) {
    const keyword = event.text.trim();
    getNewsData(event)
    .then(data => {
      const text = `<@${event.user}> Here is the recent news\n ${data}`;
      var message = { 
          token: BOT_TOKEN,
          channel: event.channel,
          text: text
      };
      var query = qs.stringify(message); // prepare the querystring
      fetch(`https://slack.com/api/chat.postMessage?${query}`);
    }, (err) => console.log(err));
  }

  callback(null);
}

// Lambda handler
exports.bot = (data, context, callback) => {
  switch (data.type) {
      case "url_verification": verify(data, callback); break;
      case "event_callback": post(data.event, callback); break;
      default: callback(null);
  }
};