#!/bin/bash
docker build -t backend:latest .
docker run --name backend -it -p 8000:8000 backend:latest