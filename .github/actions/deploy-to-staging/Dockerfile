FROM python:3.8-slim

COPY requirements.txt /
RUN pip install -r requirements.txt

COPY deploy-to-staging.py /deploy-to-staging
ENTRYPOINT ["python", "/deploy-to-staging"]
