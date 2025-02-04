# Create API
API_ID=$(aws apigatewayv2 create-api \
  --name $API_NAME \
  --protocol-type HTTP \
  --target "arn:aws:lambda:$AWS_REGION:$AWS_ACCOUNT_ID:function:$FUNCTION_NAME" \
  --query "ApiId" --output text)

echo "API Gateway $API_NAME created successfully."

sleep 10

# Add Route
ROUTE_ID=$(aws apigatewayv2 create-route \
  --api-id $API_ID \
  --route-key "$HTTP_METHOD $RESOURCE_PATH" \
  --query "RouteId" --output text)

echo "API Gateway route $HTTP_METHOD $RESOURCE_PATH created successfully."

sleep 10

# Create Stage
StageName=$(aws apigatewayv2 create-stage \
  --api-id $API_ID \
  --stage-name "default" \
  --description "Default stage" \
  --query "StageName" --output text)

echo "API Gateway stage $StageName created successfully."

sleep 10

# Update CORS configuration
ApiEndpoint=$(aws apigatewayv2 update-api \
    --api-id $API_ID \
    --cors-configuration "{
        \"AllowOrigins\": [\"$ALLOWED_ORIGIN\"],
        \"AllowMethods\": [\"GET\"],
        \"AllowHeaders\": [\"*\"],
        \"ExposeHeaders\": [\"*\"],
        \"MaxAge\": 3600 }" \
    --query "ApiEndpoint" --output text)

echo "API Gateway CORS configuration updated successfully. for $ApiEndpoint"

sleep 10

INTEGRATION_ID=$(aws apigatewayv2 create-integration \
  --api-id $API_ID \
  --integration-type AWS_PROXY \
  --integration-uri arn:aws:lambda:$AWS_REGION:$AWS_ACCOUNT_ID:function:$FUNCTION_NAME \
  --integration-method GET \
  --payload-format-version 2.0 \
  --query "IntegrationId" --output text)

echo "API Gateway integration $INTEGRATION_ID created successfully."

sleep 10

aws apigatewayv2 update-route \
  --api-id $API_ID \
  --route-id $ROUTE_ID \
  --target integrations/$INTEGRATION_ID

echo "API Gateway route $HTTP_METHOD $RESOURCE_PATH updated successfully."

sleep 10

# Deploy API
DeploymentId=$(aws apigatewayv2 create-deployment \
  --api-id $API_ID \
  --stage-name "default" \
  --query "DeploymentId" --output text)

echo "API Gateway $API_NAME $DeploymentId deployed successfully."

# Output API URL
echo "API URL: https://$API_ID.execute-api.$AWS_REGION.amazonaws.com/default$RESOURCE_PATH"

# add a permission to the Lambda function to allow it to be invoked by the API Gateway
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id apigateway-allow \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$AWS_REGION:$AWS_ACCOUNT_ID:$API_ID/*/$HTTP_METHOD$RESOURCE_PATH" \




