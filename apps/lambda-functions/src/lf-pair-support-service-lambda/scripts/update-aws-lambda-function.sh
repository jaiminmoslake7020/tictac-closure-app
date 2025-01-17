#!/bin/bash
# This script creates an AWS Lambda function
echo "Updating AWS Lambda Function..."

aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file fileb://"$ZIP_FILE" \

echo "Lambda function $FUNCTION_NAME updated successfully."
