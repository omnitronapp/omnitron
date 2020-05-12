# Development

## Quick start for developers

Prerequisites:

 - [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
 - [Meteor](https://www.meteor.com/install)
 - [Local Tunneling](https://ngrok.com/) to expose API endpoints for webhooks

Starting the app:

```sh
git clone https://github.com/kschingiz/omnitron
cd omnitron
meteor npm install

ngrok http 3000 -> get tunnel https url

ROOT_URL=tunnel_url meteor npm start
```

Now you are ready to start