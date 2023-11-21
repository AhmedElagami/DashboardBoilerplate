import { NextResponse } from 'next/server';
// import { hash } from 'bcrypt';
import userService from '@/src/services/userService';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    // validate email and password
    console.log({ email, password });

    // const hashedPassword = await hash(password, 10);
    userService.createUser({email, password})
    return NextResponse.json({ message: 'success' }, {status: 200});

  } catch (e) {
    console.log("Error while creating a user", { e });
    return NextResponse.json({ error: 'Internal Server Error' }, {status: 500});

  }

}