# largely inspired by https://github.com/BretFisher/node-docker-good-defaults/blob/master/Dockerfile

FROM node:10.21-alpine

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default timezone in node to utc
ENV TZ utc

# default to port 8080 for node, and 5858 or 9229 for debug
ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT 5858 9229

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK CMD curl -fs http://localhost:$PORT/health || exit 1

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# copy in our source code last, as it changes the most
COPY ./ ./

CMD ["yarn", "start"]
