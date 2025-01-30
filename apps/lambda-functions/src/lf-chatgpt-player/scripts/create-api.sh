# Create API
API_ID=$(aws apigatewayv2 create-api \
  --name $API_NAME \
  --protocol-type HTTP \
  --target "arn:aws:lambda:$AWS_REGION:$AWS_ACCOUNT_ID:function:$FUNCTION_NAME" \
  --query "ApiId" --output text)

sleep 10

# Add Route
aws apigatewayv2 create-route \
  --api-id $API_ID \
  --route-key "$HTTP_METHOD $RESOURCE_PATH"

sleep 10

# Create Stage
aws apigatewayv2 create-stage \
  --api-id $API_ID \
  --stage-name "default" \
  --description "Default stage"

sleep 10

# Deploy API
aws apigatewayv2 create-deployment \
  --api-id $API_ID \
  --stage-name "default"

sleep 10

# Update CORS configuration
aws apigatewayv2 update-api \
    --api-id $API_ID \
    --cors-configuration "{
        \"AllowOrigins\": [\"$ALLOWED_ORIGIN\"],
        \"AllowMethods\": [\"GET\"],
        \"AllowHeaders\": [\"*\"],
        \"ExposeHeaders\": [\"*\"],
        \"MaxAge\": 3600
    }"

# Output API URL
echo "API URL: https://$API_ID.execute-api.$AWS_ACCOUNT_ID.amazonaws.com"

sleep 10

# add a permission to the Lambda function to allow it to be invoked by the API Gateway
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id apigateway-allow \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$AWS_REGION:$AWS_ACCOUNT_ID:$API_ID/*/$HTTP_METHOD/$RESOURCE_PATH" \
