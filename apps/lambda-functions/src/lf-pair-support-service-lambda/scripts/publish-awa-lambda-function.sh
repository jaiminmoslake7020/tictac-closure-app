#!/bin/bash

# Build the project
yarn run build

echo "Loading ENV variables"
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
#!/bin/bash

echo "Validating environment variables..."

VALIDATION_FAILED="false"

# Check if the required environment variables are set
if [ -z "$FUNCTION_NAME" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set FUNCTION_NAME."
  echo "current value:$FUNCTION_NAME"
  VALIDATION_FAILED="true"
fi

if [ -z "$RULE_NAME" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set RULE_NAME."
  echo "current value:$RULE_NAME"
  VALIDATION_FAILED="true"
fi

# Check if the required environment variables are set
if [ -z "$ROLE_ARN" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set ROLE_ARN."
  echo "current value:$ROLE_ARN"
  VALIDATION_FAILED="true"
fi

# Check if the required environment variables are set
if [ -z "$HANDLER" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set HANDLER."
  echo "current value:$HANDLER"
  VALIDATION_FAILED="true"
fi

# Check if the required environment variables are set
if [ -z "$ZIP_FILE" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set ZIP_FILE."
  echo "current value:$ZIP_FILE"
  VALIDATION_FAILED="true"
fi


# Check if the required environment variables are set
if [ -z "$ENV_VAR1" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set ENV_VAR1."
  echo "current value:$ENV_VAR1"
  VALIDATION_FAILED="true"
fi


# Check if the required environment variables are set
if [ -z "$ENV_VAR2" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set ENV_VAR2."
  echo "current value:$ENV_VAR2."
  VALIDATION_FAILED="true"
fi


# Check if the required environment variables are set
if [ -z "$ENV_VAR3" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set ENV_VAR3."
  echo "current value:$ENV_VAR3"
  VALIDATION_FAILED="true"
fi

# Check if the required environment variables are set
if [ -z "$AWS_ACCOUNT_ID" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set AWS_ACCOUNT_ID."
  echo "current value:$AWS_ACCOUNT_ID"
  VALIDATION_FAILED="true"
fi


# Check if the required environment variables are set
if [ -z "$AWS_REGION" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set AWS_REGION."
  echo "current value:$AWS_REGION"
  VALIDATION_FAILED="true"
fi

# Check if the required environment variables are set
if [ -z "$LAYER_NAME" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set LAYER_NAME."
  echo "current value:$LAYER_NAME"
  VALIDATION_FAILED="true"
fi

# Check if the required environment variables are set
if [ -z "$BUNDLE_FILE" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set BUNDLE_FILE."
  echo "current value:$BUNDLE_FILE"
  VALIDATION_FAILED="true"
fi

# Check if the required environment variables are set
if [ -z "$AWS_ACCESS_KEY_ID" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set AWS_ACCESS_KEY_ID."
  echo "current value:$AWS_ACCESS_KEY_ID"
  VALIDATION_FAILED="true"
fi

# Check if the required environment variables are set
if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set AWS_SECRET_ACCESS_KEY."
  echo "current value:$AWS_SECRET_ACCESS_KEY"
  VALIDATION_FAILED="true"
fi

# Check if the required environment variables are set
if [ $VALIDATION_FAILED == "true" ]; then
  echo "Validation failed."
  exit 1
fi

echo "Environment variables validated!"

# Zip the Lambda function
./scripts/zip-lambda.sh

VERSION_NUMBER=$(aws lambda list-layer-versions --layer-name $LAYER_NAME --query 'LayerVersions[0].Version' --output text)
export VERSION_NUMBER

if [ -z "$VERSION_NUMBER" ]; then
  echo "Error: VERSION_NUMBER is missing."
  echo "Please set VERSION_NUMBER."
  echo "current value:$VERSION_NUMBER."
  exit 1
fi


# Upsert the AWS Lambda function
./scripts/upsert-aws-lambda-function.sh
