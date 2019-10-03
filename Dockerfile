FROM node:10.16

RUN apt-get update
RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update
RUN apt-get install -y nodejs yarn

# application
RUN mkdir /opt/server

COPY ./dist ./opt/api
COPY ./package.json /opt/api
COPY ./yarn.lock /opt/api

RUN (cd /opt/api; yarn)

WORKDIR /opt/api

CMD node index.js
