// app/services/userService.tsx

import { Neo4jAdapter } from '@auth/neo4j-adapter';
import { getNeo4jSession, read, write } from '../utils/neo4j';
import { v4 as uuidv4 } from 'uuid';

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  points: number
  streak: number
  passedDailyMission: boolean
};

const neo4jUserAdapter = Neo4jAdapter(getNeo4jSession());

const userService = {

    authorizeByCredentials: async (credentials) => { // this functions should return the user
        // ! first validate the arguemnts
        if (!credentials || !credentials.email || !credentials.password) {
            console.log("Please enter the credentials")
            return null;
        }

        // ! is this user actually there, if so return its data without the password
        // * this should be done using encryption
        const dbUser = await userService.findUserByEmail(credentials.email);
        if (dbUser && dbUser.password === credentials.password) {
          const { password, createdAt, id, ...dbUserWithoutPassword } = dbUser;
          return dbUserWithoutPassword;
        }

        // ! if no user is found, then return null
        console.log("No User found with these credentials")
        return null;
    },

    findUserById: async (userId: string) => {
        return await neo4jUserAdapter.getUser(userId);
    },

    findUserByEmail: async (email: string) => {
        return neo4jUserAdapter.getUserByEmail(email);
    },

  createUser: async (userData: Record<string, any>) => {
    // Check if user already exists
    const existingUser = await userService.findUserByEmail(userData.email);
    if (existingUser) {
      // Update user logic here if needed, or just return the existing user
      console.log("User is already there with this email address!")
      return null;
    }

    const data = {
      id: uuidv4(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      points: 10,
      streak: 0,
      passedDailyMission: false,
    };

    const createUserQuery = `
      CREATE (u:User $data)
      RETURN u
    `;


    const newUser = await write(createUserQuery, { data });
    const user = newUser[0]?.u ?? null;

    if (user) {
      console.log(`A new user is added ${user}`);
    }
    return user;
  },
  
  updateUser : async ( currentUserData: Record<string, any> , body: any ) => {

    const data = {
      id: currentUserData.id,
      firstName: 'firstName' in body ? body['firstName'] : currentUserData.firstName,
      lastName: 'lastName' in body ? body['lastName'] : currentUserData.lastName,
      email:'email' in body ? body['email'] :  currentUserData.email,
      phoneNumber: 'phoneNumber' in body ? body['phoneNumber'] : currentUserData.phoneNumber,
      password: 'password' in  body ? body['password']: currentUserData.password,
      points: 'points' in body ? body['points']: currentUserData.points,
      streak:'streak' in  body ? body['streak']: currentUserData.streak,
      passedDailyMission: 'passedDailyMission' in body ? body['passedDailyMission']:  currentUserData.passedDailyMissions
    };

    const updateUserQuery = `
      MATCH (u:User {id: $data.id})
      SET u = $data
      RETURN u
    `;
    const updatedUser = await write(updateUserQuery, { data });
    const user = updatedUser[0]?.u ?? null;
    if (user) {
      console.log(`User is updated ${user}`);
    }
    return data;

  }
};

export default userService;