![An overview of registered clients](/docs/clients.png)

# OpenID Connect provider
This is a very early staged [OpenID Connect](https://openid.net/connect/) provider based on Filip Skokan's [node-oidc-provider](https://github.com/panva/node-oidc-provider). It uses MongoDB and Redis for persistence, Express for the backend, as well as [Nuxt](https://nuxtjs.org/) for the frontend.

## Prerequisites
* [Node.js](https://nodejs.org/en/) v8 LTS or later
* [MongoDB](https://www.mongodb.com) v3.4 or later
* [Redis](https://redis.io/) v3.2 or later
* [yarn](https://yarnpkg.com/lang/en/) v1.3 (optional)

## Install
1. `git clone https://github.com/saschazar21/oidc-provider`
2. `cd oidc-provider`
2. `yarn` or `npm install`
3. `./bin/init.js` (for interactive mode) or `./bin/createAdmin.js` to create admin user

## Usage
After installing the project, the OIDC provider may be started using `npm run dev` (for dev mode) or using `npm build && npm start` (for prod mode). Remember to set the needed environment variables by copying `.env.sample` to `.env` and filling out the included properties. For prod mode, it might be helpful to set the environment variables system-wide using `export`.

After that, the OIDC provider is reachable under the given `DOMAIN` and `PORT` (http://localhost:3000 if omitted). Login using the e-mail address and password entered during install step 4.

### Routes
For a detailed routing documentation, please see [/docs/routes.md](/docs/routes.md). Supported HTTP methods are listed using the format *[GET, POST]*, necessary scopes for the given route are listed using the format *{scope, other_scope}*.

## Roadmap
Since this project is still in a very early stage, a lot of things are still on the roadmap:

* **Unified design**: Replace the current UI design with a fully-featured one that's easy to extend and enhance
* **User self-signup**: Graphical user sign-up page, asking for short-lived sign-up codes
* **Error handling**: Improved error handling by re-routing to customizable error page
* **Build process**: Simplify build process for providing improved Docker usability

## Credits
Of course there should be a lot more projects listed, however, to keep it short and simple, the most important ones are the ones below:

* **@panva** for [node-oidc-provider](https://github.com/panva/node-oidc-provider)
* **@nuxt** for [nuxt.js](https://github.com/nuxt/nuxt.js)
* **@expressjs** for [express](https://github.com/expressjs/express)

## Contribution
Contributors welcome. Because of this project still being very much in alpha stage, it's very likely that complete rewrites of certain source code parts may happen in the future and thus certain pull requests possibly being rejected. However, I value contribution to this project very much, so please feel free to submit anything that you think might improve this project's status now or in the future.

## License
MIT

## Version history
* **v0.1.0** Initial release of the alpha stage
