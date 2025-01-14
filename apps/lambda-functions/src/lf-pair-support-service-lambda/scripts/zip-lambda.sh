#!/bin/bash

rm -f "$ZIP_FILE"

# Load environment variables from env_vars.sh
source ./scripts/setup_env.sh

# Check if the required environment variables are set
if [ -z "$BUNDLE_FILE" ] || [ -z "$ZIP_FILE" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set BUNDLE_FILE, ZIP_FILE."
  exit 1
fi

zip -r "$ZIP_FILE" "$BUNDLE_FILE" node_modules
