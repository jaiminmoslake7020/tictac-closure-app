#!/bin/bash

pwd

FILE_TO_SOURCE="./scripts/setup_env.sh"
# Check if the file exists and is readable
if [ -r "$FILE_TO_SOURCE" ]; then
    # Source the file
    # shellcheck disable=SC1090
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

# Manually delete instead of
#VERSION_NUMBER=$(aws lambda list-layer-versions --layer-name $LAYER_NAME --query 'LayerVersions[0].Version' --output text)

#if [ -z "$VERSION_NUMBER" ]; then
#  echo "No version found for layer $LAYER_NAME"
#else
#  aws lambda delete-layer-version --layer-name $LAYER_NAME --version-number $VERSION_NUMBER
#fi

aws lambda publish-layer-version \
    --layer-name $LAYER_NAME \
    --description "Layer to support node_modules" \
    --zip-file fileb://my-layer.zip \
    --compatible-runtimes nodejs18.x

VERSION_NUMBER=$(aws lambda list-layer-versions --layer-name $LAYER_NAME --query 'LayerVersions[0].Version' --output text)
echo "New version VERSION_NUMBER:$VERSION_NUMBER"

sleep 10

# Update the Lambda functions with the new layer do it only to local and development layer
FN1=$(aws lambda list-functions --query 'Functions[?FunctionName==`'$FUNCTION_NAME'`].FunctionName' --output text)
echo "Checking function 2 $FN1"
if [ "$FN1" == "$FUNCTION_NAME" ]; then
  echo "Found function updating layer for $FUNCTION_NAME"
  aws lambda update-function-configuration \
      --function-name "$FUNCTION_NAME" \
      --layers "arn:aws:lambda:$AWS_REGION:$AWS_ACCOUNT_ID:layer:$LAYER_NAME:$VERSION_NUMBER" \

fi

echo "Lambda layer $LAYER_NAME updated successfully."
