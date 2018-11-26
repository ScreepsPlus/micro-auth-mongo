FROM node:8-alpine
WORKDIR /app

ADD package.json .
RUN yarn install --frozen-lockfile --no-cache --production
ADD . ./
CMD ["yarn", "start"]