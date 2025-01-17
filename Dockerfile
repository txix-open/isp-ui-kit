FROM node:20-alpine as builder

WORKDIR /usr/src/app
COPY . ./
RUN npm install && npm run build-storybook


FROM nginx:alpine-slim
COPY --from=builder /usr/src/app/storybook-static /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
