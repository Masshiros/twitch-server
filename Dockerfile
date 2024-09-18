FROM node:22
COPY . /app
WORKDIR /app
RUN npm ci
ENTRYPOINT [ "npm", "run", "start:debug" ]

EXPOSE 3000