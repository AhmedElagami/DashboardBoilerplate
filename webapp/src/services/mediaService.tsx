import { Neo4jAdapter } from '@auth/neo4j-adapter';
import { getNeo4jSession, read, write } from '../utils/neo4j';

const neo4jUserAdapter = Neo4jAdapter(getNeo4jSession());

const mediaService = {
    findMediaById: async (mediaId: string) => {
        const getMediaQuery = `
            MATCH (m:Media {id: $mediaId})
            RETURN m
        `; 
        const media = await read(
            getMediaQuery,
            { mediaId }
        );
        return media;
    },
    findMediaComments: async (mediaId: string) => {
        const getMediaCommentsQuery = `
            MATCH (m:Media {id: $mediaId})<-[:HAS_COMMENT]-(c:Comment)
            RETURN c
        `;
        const comments = await read(
            getMediaCommentsQuery,
            { mediaId }
        );    
        return comments;
    },
    findMediaLikes: async (mediaId: string) => {
        const getMediaLikesQuery = `
            MATCH (u:User)-[:LIKES]->(m:Media {id: $mediaId})
            RETURN u
        `;
        const likes = await read(
            getMediaLikesQuery,
            { mediaId }
        );    
        return likes;
    }

};

export default mediaService;
