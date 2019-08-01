FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y curl

# Node
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

# postgres
RUN apt-get install -y postgresql-10

# nginx
RUN apt-get install -y nginx

# application
RUN mkdir /opt/server

COPY ./lib ./opt/server
COPY ./package.json /opt/server

RUN (cd /opt/server; npm install)

WORKDIR /opt

CMD node ./server/index.js
