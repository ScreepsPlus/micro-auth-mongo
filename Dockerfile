FROM node:8-alpine
WORKDIR /app
ADD package.json .
RUN yarn install
ADD src/ ./
CMD ["yarn", "start"]