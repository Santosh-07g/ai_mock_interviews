'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { signInWithPopup } from "firebase/auth";


const ONE_WEEK = 60 * 60 * 24 * 7;



export async function signUp(params: SignUpParams){
    const { uid, name, email } = params;

    try{
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return{
                success : false,
                message:'user already exists. please sign in instead.'
            }
        }
        await db.collection('users').doc(uid).set({
            name, email
        })
        return {
            success: true,
            message : 'Account  created successfully. please sign in.'
        }

    }catch(e :any) {
        console.error('Error creation a user', e);
        if(e.code === 'auth/email-already-exists'){
            return {
                success : false,
                message : 'this is email is already in use.'
            }
        }
        return {
            success : false,
            message:' Failed to create an account'
        }
    }

}
 export async function signIn(params: SignInParams){
    const {email, idToken } = params;

    try{
        const userRecord= await auth.getUserByEmail(email);
        if(!userRecord){
            return {
                sucess:false,
                message:'user does not exists. Create an account insted.'
            }
        }

        await setSessionCookie(idToken);
    }catch (e){
        console.log(e);

        return{
            sucess:false,
            message:'failed to log into an account.'
        }
    }
 }

export async function setSessionCookie(idToken: string) {
    const cookieStore =await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,

    })

    cookieStore.set('session', sessionCookie,{
        maxAge:ONE_WEEK,
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        path: '/',
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection('users')
        .doc(decodedClaims.uid)
        .get();
        
        if(!userRecord.exists) return null;

        return{
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    }catch(e) {
        console.log(e)
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

