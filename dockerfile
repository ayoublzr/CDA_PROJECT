FROM node:latest
WORKDIR /SERVER-CDA
COPY ./package.json .
RUN npm install 
COPY . .
CMD npm start