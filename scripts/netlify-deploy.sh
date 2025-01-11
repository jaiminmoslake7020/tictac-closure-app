#!/bin/bash

# show what is the current directory
pwd

# Ensure the script exits if any command fails
FILE_TO_SOURCE="./scripts/setup-env.sh"
# Check if the file exists and is readable
if [ -r "$FILE_TO_SOURCE" ]; then
    # Source the file
    . "$FILE_TO_SOURCE"
    echo "File sourced successfully."
else
    echo "Error: File '$FILE_TO_SOURCE' does not exist or is not readable."
    exit 1
fi


# Check if the required environment variables are set
if [ -z "$NETLIFY_SITE_ID" ] || [ -z "$BUILD_DIR" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set NETLIFY_SITE_ID, BUILD_DIR."
  exit 1
fi


# Deploy to Netlify
netlify deploy --prod --dir=$BUILD_DIR --site=$NETLIFY_SITE_ID
