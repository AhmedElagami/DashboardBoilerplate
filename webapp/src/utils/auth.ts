import { NextAuthOptions, User, getServerSession } from "next-auth";
import NextAuth from "next-auth";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import userService from "../services/userService";
import { Neo4jAdapter } from "@auth/neo4j-adapter";
import { getNeo4jSession } from "./neo4j";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // here you call the authorize user by credentials from the userService
        return userService.authorizeByCredentials(credentials);
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // GithubProvider({
    //   clientId: getEnvVariable('GITHUB_CLIENT_ID') as string,
    //   clientSecret: getEnvVariable('GITHUB_CLIENT_SECRET') as string,
    // }),
  ], 
    adapter: Neo4jAdapter(getNeo4jSession())
};

export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, authConfig)
}

export async function loginIsRequiredServer() {
  const session = await auth();
  if(!session) {
    redirect('/auth/signin')
  }
  return session;
}

export function loginIsRequiredClient() {
  if (typeof window !== "undefined") {
    const session = useSession();
    const router = useRouter();
    console.log("redirecting now:)")
    if (!session) router.push("/auth/signin");
    else {
        session.user = {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image
        }
    }
    return session
  }
  return null
}
