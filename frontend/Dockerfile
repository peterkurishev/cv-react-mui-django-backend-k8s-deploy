FROM node:18-alpine
#FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
# RUN npm ci
COPY . .
# RUN npm run build
RUN npm install
#ENTRYPOINT ["npm", "run", "start"]
CMD ["npm", "run", "start"]


#FROM nginx:alpine
#COPY --from=build /app/build /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#EXPOSE 80
