FROM python:3

RUN pip install --upgrade pip && \
    pip install uwsgi && \
    pip install flask && \
    pip install pandas && \
    pip install -U git+https://github.com/twopirllc/pandas-ta && \
    pip install requests

ADD . /app
WORKDIR /app

CMD ["sh", "serve.sh"]