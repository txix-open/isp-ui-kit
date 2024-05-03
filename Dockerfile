FROM node:18.16.0-alpine3.18 as builder

WORKDIR /usr/src/app
COPY . ./
RUN npm install --legacy-peer-deps && npm run build-storybook


FROM nginx:alpine-slim
COPY --from=builder /usr/src/app/storybook-static /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
