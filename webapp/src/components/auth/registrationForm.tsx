'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import {z} from "Zod";

// Define a Zod schema for user registration
export const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function Form() {
    // ! if the registration is successful, route to home directory
    const router = useRouter();

    // ! if there is a session already, then redirect to the home page
    const { data: session, status } = useSession()

    if (status === "authenticated") {
        router.push("/")
    }

    // ! setting up form Data as state for the component
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // ! we want to validate the form and show the errors when data change
    // * setting up Zod state
    const [fieldErrors, setFieldErrors] = useState(
        {
          'email': [],
          'password': []
        } // Initialize with an empty object of the same shape
    );
    const [formError, setFormError] = useState("");

    // ! when the form is submitted, first validate the data, post to api, and check for errors

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

try {
    // Validate the form data
    const validatedData = registrationSchema.parse({email, password});
    // ! send a request to create the user
      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        }),
      });

    if (response.status === 200) {
      router.push("/");
    } else {
      setFormError("Error while registering");
    }
    console.log(`response is ${response}`)
    // If validation is successful, you can proceed with sending the data to the server
    } catch (error) {
    if (error instanceof z.ZodError) {
        // Handle validation errors
        const errors : { email: [], password: []} = (error.flatten()).fieldErrors;
        setFieldErrors(errors);
    }
    }
  };

    // ! handle change in the values, when data in the form change, update the formData state with onChange
  return (  
    <form onSubmit={handleSubmit} className="space-y-10">  
    <div>{formError}</div>
      <div>  
        <div>{fieldErrors['email']}</div>
        <label>Email:</label>  
        <input  
          value={email}  
          onChange={(e) => setEmail(e.target.value)}  
          required  
        />  
      </div>  
      <div>  
        <div>{fieldErrors['password'].join(" - ")}</div>
        <label>Password:</label>  
        <input  
          value={password}  
          onChange={(e) => setPassword(e.target.value)}  
          required  
        ></input>  
      </div>  
      <button type="submit">Submit</button>  
    </form>  
  )  
}