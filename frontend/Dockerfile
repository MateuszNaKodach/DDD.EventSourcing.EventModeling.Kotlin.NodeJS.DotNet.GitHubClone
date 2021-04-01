FROM node:latest
WORKDIR /app/frontend/
COPY package*.json ./
#RUN export NODE_OPTIONS=--max_old_space_size=8000
RUN npm install
#RUN npm install react-scripts@4.0.2 -g --silent
COPY . .
ENTRYPOINT [ "npm", "start" ]
