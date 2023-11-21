// Helper function to assert that the environment variable is present
function getEnvVariable(key: string): string {
  const value = process.env[key];
  console.log(value)
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export default getEnvVariable;