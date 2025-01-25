#!/bin/bash
# This script creates an AWS Lambda function

echo "Creating AWS Lambda FUNCTION_NAME: $FUNCTION_NAME"

ROLE_ARN="arn:aws:iam::$AWS_ACCOUNT_ID:role/$ROLE_NAME"

# Create the Lambda function
aws lambda create-function \
  --function-name "$FUNCTION_NAME" \
  --runtime nodejs18.x \
  --handler "$HANDLER" \
  --zip-file fileb://"$ZIP_FILE" \
  --role "$ROLE_ARN" \
  --timeout 15 \
  --memory-size 512 \
  --environment "Variables={FIREBASE_PROJECT_ID=$ENV_VAR1,FIREBASE_CLIENT_EMAIL=$ENV_VAR2,FIREBASE_PRIVATE_KEY_BASE64=$ENV_VAR3}" \
  --layers "arn:aws:lambda:$AWS_REGION:$AWS_ACCOUNT_ID:layer:$LAYER_NAME:$VERSION_NUMBER" \

echo "Lambda function $FUNCTION_NAME created successfully."

sleep 10

aws events put-rule \
    --name $RULE_NAME \
    --schedule-expression "rate(1 minute)" \
    --state ENABLED \

sleep 20

aws events put-targets \
    --rule $RULE_NAME \
    --targets "Id"="1","Arn"="arn:aws:lambda:$AWS_REGION:$AWS_ACCOUNT_ID:function:$FUNCTION_NAME" \

sleep 10

aws lambda add-permission \
    --function-name $FUNCTION_NAME \
    --statement-id "run-this-at-each-minute" \
    --action 'lambda:InvokeFunction' \
    --principal events.amazonaws.com \
    --source-arn "arn:aws:events:$AWS_REGION:$AWS_ACCOUNT_ID:rule/$RULE_NAME"

sleep 10

# Define the policy document in a variable
POLICY_DOCUMENT=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:$AWS_REGION:$AWS_ACCOUNT_ID:secret:$SECRET_NAME"
    }
  ]
}
EOF
)

aws iam put-role-policy \
  --role-name $ROLE_NAME \
  --policy-name LambdaSecretsManagerPolicy \
  --policy-document "$POLICY_DOCUMENT"
