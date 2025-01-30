#!/bin/bash
# This script creates an AWS Lambda function

echo "Creating AWS Lambda FUNCTION_NAME: $FUNCTION_NAME"

ROLE_ARN="arn:aws:iam::$AWS_ACCOUNT_ID:role/$ROLE_NAME"

# Create the Lambda function
aws lambda create-function \
  --function-name "$FUNCTION_NAME" \
  --runtime nodejs18.x \
  --handler "$HANDLER" \
  --zip-file fileb://"$ZIP_FILE" \
  --role "$ROLE_ARN" \
  --timeout 15 \
  --memory-size 512 \
  --environment "Variables={FIREBASE_PROJECT_ID=$ENV_VAR1,FIREBASE_CLIENT_EMAIL=$ENV_VAR2,FIREBASE_PRIVATE_KEY_BASE64=$ENV_VAR3,SECRET_NAME=$SECRET_NAME,SECRET_NAME_OPENAI_API_KEY=$SECRET_NAME_OPENAI_API_KEY,ENV_TYPE=$ENV_TYPE}" \
  --layers "arn:aws:lambda:$AWS_REGION:$AWS_ACCOUNT_ID:layer:$LAYER_NAME:$VERSION_NUMBER" \

echo "Lambda function $FUNCTION_NAME created successfully."


./scripts/create-api.sh
