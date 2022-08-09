FROM ubuntu:latest

RUN apt-get update -yq \
&& apt-get upgrade -yq \
&& apt-get install python3 -yq \
&& apt-get install python3-pip -yq \
&& pip3 install requests \
&& pip3 install numpy \
&& pip3 install pandas \
&& pip3 install ta

ADD . /app/
WORKDIR /app

VOLUME /app/logs

CMD ["python3", "index.py"]