FROM node:7.3-wheezy
MAINTAINER Víctor Rojas

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get -y install ffmpeg


WORKDIR /app

COPY package.json .
RUN npm install --production --quiet
COPY . .

EXPOSE 3000

CMD ["node", "."]
