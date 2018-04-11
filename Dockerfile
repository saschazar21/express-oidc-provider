FROM node:8.9-alpine

ENV NODE_ENV production
ENV KEYSTORE ./local/keystore.json

#######
#
# Absolutely mandatory environment variables
#
#######
# DOMAIN
#
# ENV MONGO_DBNAME
# ENV MONGO_HOST
# ENV MONGO_PORT
# ENV MONGO_USER
# ENV MONGO_PASSWORD
#
# Either use SOCKET or HOST, PORT:
# ENV REDIS_USER
# ENV REDIS_PASSWORD
# ENV REDIS_SOCKET
# ENV REDIS_HOST
# ENV REDIS_PORT
# ENV REDIS_DATABASE
WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn && npm run postmerge && mv node_modules ../
COPY . .

VOLUME [ "/usr/src/app/local" ]

EXPOSE 3000

#######
#
# Will create a user based on given environment variables, only if no user exists in database
#
#######
# ENV PREFERRED_USERNAME
# ENV EMAIL
# ENV PASSWORD
# ENV GIVEN_NAME
# ENV FAMILY_NAME
ENTRYPOINT [ "./bin/run.js" ]

CMD npm run build && npm start