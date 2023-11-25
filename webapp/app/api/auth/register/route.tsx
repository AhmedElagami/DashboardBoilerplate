import { NextResponse } from 'next/server';
// import { hash } from 'bcrypt';
import userService from '@/src/services/userService';
import {z} from "Zod";

export const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  try {
    const jsonRequest = await request.json();
    console.log("The request is:", jsonRequest)
    const validatedData = await registrationSchema.parse(jsonRequest); console.log("Validated Data is ", validatedData)

    // validate email and password
    userService.createUser(jsonRequest)


    // const hashedPassword = await hash(password, 10);
    return NextResponse.json({ message: 'success' }, {status: 200});
  } catch (e) {
    if (e instanceof z.ZodError) {
        // Handle validation errors
      const fieldErrors : { email: [], password: []} = (e.flatten()).fieldErrors;
      console.log("Error while creating a user", { fieldErrors });
      return NextResponse.json({ error: fieldErrors }, {status: 500});
    }
    console.log("Error while creating a user", { e });
    return NextResponse.json({ error: `Internal Server Error ${e}` }, {status: 500});

  }

}