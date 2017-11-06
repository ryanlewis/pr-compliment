const Bluebird = require('bluebird');
const request = Bluebird.promisifyAll(require('request'));

const webUrl = url => url.replace('api.github.com/users', 'github.com');

const compliments = {
  openings: ['Wow', 'Hey', 'Thanks', 'This is neat'],

  flavor: [
    'this looks really good!',
    'this is AMAZING!',
    'this has made my day!',
    'thanks for contributing!',
    "I'm loving this!"
  ],

  moreFlavor: [
    pr =>
      "I'm going to look at this RIGHT away. So far it looks GREAT and it'll be merged in no time!",
    pr =>
      "Thank you for your open source contribution! It's people like you that makes OSS worthwhile!",
    pr =>
      `I'm going to tell everyone I know to go to ${pr.user
        .html_url} and give you a follow!`,
    pr =>
      `I just checked out your repos at ${webUrl(
        pr.user.repos_url
      )} and you're obviously talented!`
  ],

  emoji: ['😍', '👌', '😄', '😻', '😎', '👍', '🤜🤛'],

  signoff: ['Thanks', 'Thanks for this', 'Cheers', 'Much appreciated']
};

function generateCompliment(pr) {
  const r = arr => arr[Math.floor(Math.random() * arr.length)];
  const emoji = () => r(compliments.emoji);

  const msg = `${r(compliments.openings)} @${pr.user.login}, ${r(
    compliments.flavor
  )} ${emoji()}
  
  ${r(compliments.moreFlavor)(pr)}
  
  ${r(compliments.signoff)} @${pr.user.login}! ${emoji()}`;

  return msg;
}

module.exports = function(ctx, cb) {
  if (!ctx.body) {
    const err = 'No body! (Was this a post? Are we parsing the body?';
    return cb(new Error(err), err);
  }

  if (!ctx.body.action || ctx.body.action !== 'opened') {
    return cb(null, 'Doesnt look like a PR opened event so gonna skip...');
  }

  const pr = ctx.body.pull_request;
  const user = pr.user;

  const compliment = generateCompliment(pr);

  const options = {
    url: pr.comments_url,
    headers: {
      Authorization: 'Bearer ' + ctx.data.GITHUB_TOKEN,
      'User-Agent': 'PR Complimenter'
    },
    json: true,
    body: {
      body: compliment
    }
  };

  request.postAsync(options).then(res => {
    cb(null, `created comment on PR ${pr.comments_url}`);
  });
};
