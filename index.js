const Twit = require("twit");
const superagent = require("superagent");
const { uniencode, scramble } = require("talk-like-a");
var cron = require("node-cron");

require("dotenv").config();

const T = new Twit({
  consumer_key: process.env.APPLICATION_CONSUMER_KEY_HERE,
  consumer_secret: process.env.APPLICATION_CONSUMER_SECRET_HERE,
  access_token: process.env.ACCESS_TOKEN_HERE,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET_HERE,
});

function postTweet(quote) {
  T.post("statuses/update", { status: quote }, function (err, data, response) {
    console.log(data);
  });
}

cron.schedule("*/30 * * * *", () => {
  superagent
    .get("https://michael-scott-quotes.herokuapp.com/quote")
    .then((quote) => {
      const jumbledUp = uniencode(scramble(quote.body.quote));
      postTweet(jumbledUp);
    })
    .catch(console.error);
});
