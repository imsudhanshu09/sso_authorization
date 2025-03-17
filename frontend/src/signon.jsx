import React, { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import JWSToken from "./jwstoken";
import Protected from "./Protected";

const firebaseConfig = {
    apiKey: "AIzaSyA3en2vVlf41XtHkjnbQFJhLN9CCbOeF18",
    authDomain: "single-sign-on-183d9.firebaseapp.com",
    projectId: "single-sign-on-183d9",
    storageBucket: "single-sign-on-183d9.firebasestorage.app",
    messagingSenderId: "976885085363",
    appId: "1:976885085363:web:b18faf4bd2369147956cc6",
    measurementId: "G-JRL0YJM0PF"
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
            <JWSToken />
            <Protected />
        </div>
    );
}
