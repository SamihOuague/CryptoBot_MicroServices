FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./myapp.conf /etc/nginx/conf.d/myapp.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]