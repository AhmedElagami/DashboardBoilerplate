import userService from "@/src/services/userService";
import {NextRequest, NextResponse} from "next/server";


export async function GET (request: NextRequest, { params }: { params: { userId: string } }){
    // Get userId parameter
    const { userId } = params;
    
    if (typeof userId === 'string') {
        try {
            const user = await userService.findUserById(userId);
        
            if (!user) {
                return NextResponse.json({ message: 'User not found' }, {status: 400});
            }

            // If the user is found, return it as a JSON response
            return NextResponse.json(user, {status: 200});
        } catch (error) {
            console.error('Error fetching user:', error);
            return NextResponse.json({ message: 'Internal Server Error' }, {status: 500});
        }
    } else {
        // Handle the case where userId is not a string (e.g., it's undefined or an array)
        return NextResponse.json({ message: 'Invalid userId' }, {status: 400});
    }
}

export async function PATCH (request: NextRequest, { params }: { params: { userId: string } }){
    // Get userId parameter
    const { userId } = params;

    const jsonRequest = await request.json();
    console.log("The request is:", jsonRequest)

    if (typeof userId === 'string') {
        try {
            const user = await userService.findUserById(userId);
        
            if (!user) {
                return NextResponse.json({ message: 'User not found' }, {status: 400});
            }

            // If the user is found, return it as a JSON response
            return NextResponse.json(user, {status: 200});
        } catch (error) {
            console.error('Error fetching user:', error);
            return NextResponse.json({ message: 'Internal Server Error' }, {status: 500});
        }
    } else {
        // Handle the case where userId is not a string (e.g., it's undefined or an array)
        return NextResponse.json({ message: 'Invalid userId' }, {status: 400});
    }
}
