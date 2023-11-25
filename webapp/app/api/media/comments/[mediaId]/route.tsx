import mediaService "@/src/services/mediaService";
import {NextRequest, NextResponse} from "next/server";



export async function GET (request: NextRequest, { params }: { params: { mediaId: string } }){
    const { mediaId } = params;
    
    if (typeof mediaId === 'string') {
        try {
            const media = await mediaService.findMediaById(mediaId);
            if (!media) {
                return NextResponse.json({ message: 'Media not found' }, {status: 400});
            }
            const comments = await mediaService.findMediaComments(mediaId);
            return NextResponse.json(comments, {status: 200});
        } catch (error) {
            console.error('Error fetching like:', error);
            return NextResponse.json({ message: 'Internal Server Error' }, {status: 500});
        }
    } else {
        // Handle the case where mediaId is not a string (e.g., it's undefined or an array)
        return NextResponse.json({ message: 'Invalid mediaId' }, {status: 400});
    }
}