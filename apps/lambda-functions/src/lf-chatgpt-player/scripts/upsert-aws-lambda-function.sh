#!/bin/bash

echo "Upserting AWS Lambda function..."

if aws lambda get-function --function-name "$FUNCTION_NAME" > /dev/null 2>&1; then
    echo "Function '$FUNCTION_NAME' exists. so updating it..."
    ./scripts/update-aws-lambda-function.sh
else
    echo "Function '$FUNCTION_NAME' does not exist. so creating it..."
    ./scripts/create-aws-lambda-function.sh
fi

