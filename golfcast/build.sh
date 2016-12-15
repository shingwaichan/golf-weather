#!/bin/bash

# Ensure the npm modules are up-to-date
npm install

# Build the application
ng build

# Build the docker container
docker build -t  us.gcr.io/golfcast-152419/ui .

# Push the image
gcloud docker -- push us.gcr.io/golfcast-152419/ui

