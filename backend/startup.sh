#!/bin/bash
gunicorn --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 main:app
