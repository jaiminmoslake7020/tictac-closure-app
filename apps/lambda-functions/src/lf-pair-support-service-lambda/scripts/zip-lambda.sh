#!/bin/bash
# Zip the Lambda function

echo "Zipping Lambda function..."

rm -f "$ZIP_FILE"

zip -r "$ZIP_FILE" "$BUNDLE_FILE"

echo "Lambda function zipped successfully."

ls -la
