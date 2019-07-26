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
RUN mkdir /opt/client

COPY ./server/lib ./opt/server
COPY ./server/package.json /opt/server

COPY ./client/dist ./opt/client
COPY ./client/package.json ./opt/client

RUN (cd /opt/client; npm install)
RUN (cd /opt/server; npm install)

WORKDIR /opt

CMD node ./server/index.js
