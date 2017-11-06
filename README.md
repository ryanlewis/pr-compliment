# PR Complimenter

Reply to a Github pull request with a nice message.

*This is obviously supposed to be a bit of fun - this would probably just get very old for people VERY quickly. Feel free however to use it as a base for an actual serious tool*

## Installation 

1. Install the webtask cli with `npm install -g wt-cli`
2. Initialize webtask with `wt init`
3. Create a Github API token with `repo` access. Goto https://github.com/settings/tokens/new to create one. Keep it in a safe place.
4. Generate the webhook url, substituting <TOKEN> with your newly created token
`wt create --name pr-compliment --secret GITHUB_TOKEN=<TOKEN> https://raw.githubusercontent.com/ryanlewis/pr-compliment/master/compliment.js`
5. Install the webhook to your repo, selecting the **Pull request** event. You can do this by going to your repo settings and going to Webhooks. **Make sure you set the Content-Type to `application/json`!**
6. You can inspect any errors using the cli command `wt logs`
