#!/bin/bash

echo "Enabled AWS rule"

FILE_TO_SOURCE="./scripts/setup_env.sh"
# Check if the file exists and is readable
if [ -r "$FILE_TO_SOURCE" ]; then
    # Source the file
    . "$FILE_TO_SOURCE"
    echo "File sourced successfully."
else
    echo "File '$FILE_TO_SOURCE' does not exist or is not readable."
fi

# Check if the required environment variables are set
if [ -z "$RULE_NAME" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set RULE_NAME."
  exit 1
fi


aws events enable-rule --name $RULE_NAME
