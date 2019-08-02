FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update
RUN apt-get install -y nodejs yarn

# Node
RUN apt-get install -y nodejs

# postgres
RUN apt-get install -y postgresql-10

# nginx
RUN apt-get install -y nginx

# application
RUN mkdir /opt/server

COPY ./lib ./opt/server
COPY ./package.json /opt/server

RUN (cd /opt/server; yarn)

WORKDIR /opt

CMD node ./server/index.js
