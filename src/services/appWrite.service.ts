import { Account, Client, Databases, ID, Query, /*Users,  Avatars */ } from 'node-appwrite';
import * as Interfaces from '../interface/soul.interface';

// Initialize Appwrite client
const client = new Client();
client
    .setEndpoint(`${process.env.APPWRITE_API_ENDPOINT}`) // Your Appwrite endpoint
    .setProject(`${process.env.APPWRITE_PROJECTID}`) // Your Appwrite project ID
    .setKey(`${process.env.APPWRITE_API_KEY}`); // Your Appwrite API key

// Initialize Appwrite services
// const users = new Users(client);
const account = new Account(client);
const databases = new Databases(client);
// const avatars = new Avatars(client);

// Database and collection IDs
const databaseId = process.env.APPWRITE_DATABASE_ID as string;
const collectionId = process.env.APPWRITE_COLLECTION_ID as string;


// Function to create a new user
async function createUsers(name: string, email: string, password: string) {
    try {
        // Step 1: Create the user account
        const user = await account.create(ID.unique(), email, password, name);
        console.log('User created successfully:', user);

        if (!user.$id) {
            throw new Error('Error creating user');
        }

        const AvatarUrl = `https://cloud.appwrite.io/v1/avatars/initials?name=${encodeURIComponent(name)}`;

        console.log('Avatar URL:', AvatarUrl);


        try {
            await account.get();
        } catch (error) {
            await login(email, password);
        }


        const newUser = await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(), // Document ID
            {
                name: name,
                email: email,
                userId: user.$id, // Link to the user's ID in Appwrite Auth
                chatHistory: [], // Initialize empty chat history
                moodTrends: [],// Initialize empty mood trends
                avatar: AvatarUrl
            }
        );

        console.log('User data saved to database');
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

// function for login
async function login(email: string, password: string) {
    try {
        // Create an email-password session
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    }
    catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

// function for get current user data
async function getCurrentUser(userId: string) {
    try {
        if (!userId) throw new Error('User ID is required');

        // Query user based on `userId` field in the database
        const userData = await databases.listDocuments(databaseId, collectionId, [
            Query.equal("userId", userId) // Ensure field name matches database schema
        ]);

        if (userData.documents.length === 0) {
            throw new Error(`User with ID ${userId} not found in database`);
        }

        return userData.documents[0]; // Return the first matching document
    } catch (error) {
        console.error('Error getting current user:', error);
        throw error;
    }
}


// sign out function
async function signOut() {
    try {
        const session = await account.deleteSession('current');
        return session;
    }
    catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}


// update user data
async function updateUserData(appwriteId: string, updateFields: Partial<{ chatHistory: any[], moodTrends: any[]}>) {
    try {
        if (!appwriteId) throw new Error("Document ID is required for update");

        const updatePayload: any = {};
        if (updateFields.chatHistory) updatePayload.chatHistory = updateFields.chatHistory;
        if (updateFields.moodTrends) updatePayload.moodTrends = updateFields.moodTrends;

        if (Object.keys(updatePayload).length === 0) {
            throw new Error("No valid fields provided for update");
        }

        // Update user document in Appwrite
        const result = await databases.updateDocument(
            databaseId,
            collectionId,
            appwriteId, // Ensure correct document ID
            updatePayload
        );

        return result;
    } catch (error) {
        console.error("Error updating user data:", error);
        throw error;
    }
}


// get history chat
async function getHistoryChat(appwriteId: string) {
    try {
        // const currentUser = await getCurrentUser(userId);
        // const userId = currentUser?.$id;

        if (!appwriteId) {
            console.log('User not logged in');
            
            throw new Error("User not logged in");
        }

        // Fetch user document from the database
        const userDocument = await databases.getDocument(databaseId, collectionId, appwriteId) as unknown as Interfaces.IUser;

        // Extract chat history
        const userChatHistory = userDocument?.chatHistory || [];
        // console.log('User chat history:', userChatHistory);

        return userChatHistory;
    } catch (error) {
        console.error('Error getting chat history:', error);
        throw error;
    }
}


// get history chat
async function getHistorySentiment(appwriteId: string) {
    try {
        // const currentUser = await getCurrentUser(userId);
        // const userId = currentUser?.$id;

        if (!appwriteId) {
            console.log('User not logged in');
            
            throw new Error("User not logged in");
        }

        // Fetch user document from the database
        const userDocument = await databases.getDocument(databaseId, collectionId, appwriteId) as unknown as Interfaces.IUser;

        // Extract chat history
        const userSentimentHistory = userDocument?.moodTrends || [];
        // console.log('User chat history:', userSentimentHistory);

        return userSentimentHistory;
    } catch (error) {
        console.error('Error getting chat history:', error);
        throw error;
    }
}



// Export the function
export default { createUsers, getCurrentUser, signOut, login, getHistoryChat, updateUserData,getHistorySentiment };