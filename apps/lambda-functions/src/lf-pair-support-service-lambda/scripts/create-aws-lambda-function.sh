#!/bin/bash
# This script creates an AWS Lambda function

echo "Creating AWS Lambda FUNCTION_NAME: $FUNCTION_NAME"

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
if [ -z "$FUNCTION_NAME" ] || [ -z "$ROLE_ARN" ] || [ -z "$HANDLER" ] || [ -z "$ZIP_FILE" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set FUNCTION_NAME, HANDLER, ROLE_ARN and ZIP_FILE."
  exit 1
fi

# Create the Lambda function
aws lambda create-function \
  --function-name "$FUNCTION_NAME" \
  --runtime nodejs18.x \
  --handler "$HANDLER" \
  --zip-file fileb://"$ZIP_FILE" \
  --role "$ROLE_ARN" \
  --timeout 15 \
  --memory-size 512 \

echo "Lambda function $FUNCTION_NAME created successfully."
