import React, { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import JWSToken from "./jwstoken";
// import Protected from "./Protected";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function SSOLogin() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);

            localStorage.setItem("user", JSON.stringify(result.user));
        } catch (error) {
            console.log("Login failed", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        } catch (error) {
            console.log("Logout failed", error);
        }
    };

    return (
        <div>
            <h1>SSO Login Component</h1>
            {user ? (
                <div>
                    <h2>Welcome {user.displayName || user.username}</h2>
                    {user.photoURL && <img src={user.photoURL} alt="User Profile" />}
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <button onClick={handleLogin}>Sign in with Google</button>
            )}
            {/* <JWSToken />
            <Protected /> */}
        </div>
    );
}
