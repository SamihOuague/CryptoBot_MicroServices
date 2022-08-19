FROM node:16

RUN npm -g install npm && \
    npm -g install env-cmd

ADD . /app

WORKDIR /app

RUN npm install

CMD ["npm", "run", "start"]

EXPOSE 3001