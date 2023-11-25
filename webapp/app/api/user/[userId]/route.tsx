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

export async function PATCH  (request: NextRequest, { params }: { params: { userId: string } }){
    
        const { userId } = params;
        const body  = await request.json();
        if (typeof userId === 'string') {
            try {
                let user = await userService.findUserById(userId);
            
                if (!user) {
                    return NextResponse.json({ message: 'User not found' }, {status: 400});
                }
                
                user.firstName = body['firstName'] ? body['firstName'] : user.firstName; 
                user.lastName = body['lastName'] ? body['lastName'] : user.lastName;
                user.phoneNumber = body['phoneNumber'] ? body['phoneNumber'] : user.phoneNumber;
                user.email = body['email'] ? body['email'] :  user.email;
                user.password = body['password'] ? body['password']: user.password;
                user.passedDailyMission = 'passedDailyMission' in body ? body['passedDailyMission']:  user.dailyMissions;
                user.points = body['points'] ? body['points']: user.points;
                user.streak = body['streak'] ? body['streak']: user.streak;
                
                const newUser = userService.updateUser(user);
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
