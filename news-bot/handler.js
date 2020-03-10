'use strict';

const qs = require('querystring');
const fetch = require('node-fetch');

const BOT_TOKEN = process.env.BOT_TOKEN;

// Send a response via Slack.
const sendResponse = (event) => {
  const params = {
    token: BOT_TOKEN,
    channel: event.event.channel,
    text: 'Test from Leeseul',
  };
  const url = `https://slack.com/api/chat.postMessage?${qs.stringify(params)}`;
  console.log(`Requesting ${url}`);
  return fetch(url)
    .then(response => response.json())
    .then((response) => {
      if (!response.ok) throw new Error('SlackAPIError');
      return Object.assign(event, { response });
    });
};

exports.bot = async (event, context, callback) => {
    console.log(event);
    if (event.type === 'url_verification') {
        return event.challenge;
    }
    return sendResponse(event)
    .then(() => callback(null))
    .catch(callback);
};
