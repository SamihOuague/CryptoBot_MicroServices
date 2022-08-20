FROM python:3

RUN pip install uwsgi && \
    pip install flask && \
    pip install pandas && \
    pip install pandas_ta && \
    pip install requests

ADD . /app
WORKDIR /app

CMD ["sh", "serve.sh"]