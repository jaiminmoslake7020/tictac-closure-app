#!/bin/bash
# This script creates an AWS Lambda function
echo "Updating AWS Lambda Function..."

aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file fileb://"$ZIP_FILE" \

sleep 10

aws lambda update-function-configuration \
    --function-name "$FUNCTION_NAME" \
    --layers "arn:aws:lambda:$AWS_REGION:$AWS_ACCOUNT_ID:layer:$LAYER_NAME:$VERSION_NUMBER" \
    --environment "Variables={FIREBASE_PROJECT_ID=$ENV_VAR1,FIREBASE_CLIENT_EMAIL=$ENV_VAR2,FIREBASE_PRIVATE_KEY_BASE64=$ENV_VAR3}" \

echo "Lambda function $FUNCTION_NAME updated successfully."
