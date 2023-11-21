'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import {z} from "Zod";

// Define a Zod schema for user registration
const registrationSchema = z.object({
  firstName: z.string().min(4, 'firstName must be at least 4 characters'),
  lastName: z.string().min(4, 'lastName must be at least 4 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});


export default function Form() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [validationErrors, setValidationErrors] = useState<z.infer<typeof registrationSchema>>(
        registrationSchema.parse({}) // Initialize with an empty object of the same shape
    );

    const { data: session, status } = useSession()

    if (status === "authenticated") {
        router.push("/")
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

try {
    // Validate the form data
    const validatedData = registrationSchema.parse(formData);
    // ! send a request to create the user
    const response = await fetch(`/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        email: formData['email'],
        password: formData['password'],
        firstName: formData['firstName'],
        lastName: formData['lastName'],
      }),
    });

    // if (response) {
    //   //Redirect to homepage (/timeline)
    //   router.push("/");
    // } else {
    //   console.log("Error: ", response);
    //   setError("Error while registering");
    // }
    console.log(`response is ${response}`)
    // If validation is successful, you can proceed with sending the data to the server
    console.log('Valid form data:', validatedData);
    } catch (error) {
    if (error instanceof z.ZodError) {
        // Handle validation errors
        setValidationErrors(error.flatten());
    }
    }

  };
return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">First Name</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.firstName}
          onChange={handleChange}
        />
        {validationErrors.firstName && (
          <div className="error">{validationErrors.firstName.message}</div>
        )}
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        {validationErrors.lastName && (
          <div className="error">{validationErrors.lastName.message}</div>
        )}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {validationErrors.email && (
          <div className="error">{validationErrors.email.message}</div>
        )}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {validationErrors.password && (
          <div className="error">{validationErrors.password.message}</div>
        )}
      </div>
      <button type="submit">Register</button>
    </form>
  );
}