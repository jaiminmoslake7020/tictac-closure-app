import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

export const getSecretCore = async (secret_name: string) => {
  const client = new SecretsManagerClient({
    region: 'us-west-2',
  });

  let response;

  // eslint-disable-next-line no-useless-catch
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      }),
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }

  const secret = response.SecretString;
  if (secret) {
    return JSON.parse(secret);
  }
  return {};
};

export const getSecret = async () => {
  const secret_name = process.env.SECRET_NAME as string;
  if (secret_name) {
    return await getSecretCore(secret_name);
  } else {
    console.error('Secret name not found in environment');
    return {};
  }
};
