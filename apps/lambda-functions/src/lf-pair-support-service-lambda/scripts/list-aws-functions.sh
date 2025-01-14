#!/bin/bash
# This script lists all AWS Lambda functions in the specified region
# echo "Listing all AWS Lambda functions in region: $REGION"aws lambda list-functions --region "$REGION" --query 'Functions[*].FunctionName' --output text

FILE_TO_SOURCE="./scripts/setup_env.sh"
# Check if the file exists and is readable
if [ -r "$FILE_TO_SOURCE" ]; then
    # Source the file
    . "$FILE_TO_SOURCE"
    echo "File sourced successfully."
else
    echo "Error: File '$FILE_TO_SOURCE' does not exist or is not readable."
    exit 1
fi

if aws lambda get-function --function-name "$FUNCTION_NAME" > /dev/null 2>&1; then
    echo "Function '$FUNCTION_NAME' exists."
else
    echo "Function '$FUNCTION_NAME' does not exist."
fi


# aws events describe-rule --name tic-tac-toe-rule-created-at-lambda
