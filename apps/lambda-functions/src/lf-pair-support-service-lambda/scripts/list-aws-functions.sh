#!/bin/bash
# This script lists all AWS Lambda functions in the specified region
# echo "Listing all AWS Lambda functions in region: $REGION"aws lambda list-functions --region "$REGION" --query 'Functions[*].FunctionName' --output text


# aws lambda list-functions


aws events describe-rule --name tic-tac-toe-rule-created-at-lambda
