FROM debian:9

RUN apt-get update -yq \
&& apt-get install python3 -yq \
&& apt-get install python3-pip -yq \
&& pip3 install requests \
&& pip3 install numpy

ADD . /app/
WORKDIR /app

VOLUME /app/logs

CMD ["python3", "index.py"]