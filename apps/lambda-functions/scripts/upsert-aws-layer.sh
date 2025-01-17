#!/bin/bash

pwd
ls -la

FILE_TO_SOURCE="./scripts/setup_env.sh"
# Check if the file exists and is readable
if [ -r "$FILE_TO_SOURCE" ]; then
    # Source the file
    . "$FILE_TO_SOURCE"
    echo "File sourced successfully."
else
    echo "Error: File '$FILE_TO_SOURCE' does not exist or is not readable."
fi

# Check if the required environment variables are set
if [ -z "$LAYER_NAME" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set LAYER_NAME."
  exit 1
fi

VERSION_NUMBER=$(aws lambda list-layer-versions --layer-name $LAYER_NAME --query 'LayerVersions[0].Version' --output text)

if [ -z "$VERSION_NUMBER" ]; then
  echo "No version found for layer $LAYER_NAME"
else
  aws lambda delete-layer-version --layer-name $LAYER_NAME --version-number $VERSION_NUMBER
fi

aws lambda publish-layer-version \
    --layer-name $LAYER_NAME \
    --description "Layer to support node_modules" \
    --zip-file fileb://my-layer.zip \
    --compatible-runtimes nodejs18.x
