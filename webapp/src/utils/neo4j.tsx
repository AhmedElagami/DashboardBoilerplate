// app/utils/neo4j.ts

import neo4j, { Driver, Session } from 'neo4j-driver';
import getEnvVariable from './environment';

// Type definition for query parameters
type QueryParams = Record<string, any>;

// Initialize driver with environment variables
const uri = getEnvVariable('NEO4J_URI');
const username = getEnvVariable('NEO4J_USERNAME');
const password = getEnvVariable('NEO4J_PASSWORD');

const driver: Driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

// Function to execute queries
async function executeQuery(
  session: Session,
  type: 'read' | 'write',
  cypher: string,
  params: QueryParams = {}
): Promise<any[]> {
  try {
    const result = await (type === 'read'
      ? session.readTransaction((tx) => tx.run(cypher, params))
      : session.writeTransaction((tx) => tx.run(cypher, params)));

    return result.records.map((record) => record.toObject());
  } catch (error) {
    console.error(`Error executing ${type} query:`, error);
    throw error; // Re-throw the error for further handling
  } finally {
    await session.close();
  }
}

// Function to execute read queries
export async function read(cypher: string, params: QueryParams = {}): Promise<any[]> {
  console.log(params)
  const session = driver.session();
  return executeQuery(session, 'read', cypher, params);
}

// Function to execute write queries
export async function write(cypher: string, params: QueryParams = {}): Promise<any[]> {
  const session = driver.session();
  return executeQuery(session, 'write', cypher, params);
}

// Function to close the driver connection
export async function closeDriver(): Promise<void> {
  await driver.close();
}

// Function to close the driver connection
export function getNeo4jSession() {
 return driver.session();
}
// Export the driver in case it's needed elsewhere
export default driver;
