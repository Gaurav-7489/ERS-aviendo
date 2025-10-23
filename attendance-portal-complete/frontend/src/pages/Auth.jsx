import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignIn, SignUp } from "@clerk/clerk-react";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("student"); // default role

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-sky-50 overflow-hidden">
      
      {/* Background Blobs */}
      <motion.div
        className="absolute w-72 h-72 bg-pink-400 rounded-full opacity-30 -top-20 -left-20"
        animate={{ x: [0, 50, -50, 0], y: [0, 30, -30, 0], rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-sky-400 rounded-full opacity-20 -bottom-32 -right-32"
        animate={{ x: [0, -40, 40, 0], y: [0, -20, 20, 0], rotate: [0, -20, 20, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
      />

      {/* Auth Card */}
      <motion.div
        layout
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 p-8 mx-4"
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-sky-700">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {isSignUp ? "Sign up to get started" : "Sign in to your account"}
        </p>

        {/* Role Picker (Signup only) */}
        {isSignUp && (
          <div className="flex justify-center gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                role === "student" ? "bg-sky-700 text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setRole("student")}
            >
              Student
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                role === "teacher" ? "bg-sky-700 text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setRole("teacher")}
            >
              Teacher
            </button>
          </div>
        )}

        {/* Clerk Forms with smooth transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? "signup" : "signin"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-center"
          >
            {isSignUp ? (
              <SignUp
                routing="virtual"
                afterSignInUrl="/dashboard"
                onSignUpComplete={async (user) => {
                  await user.update({ publicMetadata: { role } });
                }}
                appearance={{
                  elements: {
                    socialButtonsBlock: "hidden",
                    footerActionLink: "hidden",
                  },
                }}
              />
            ) : (
              <SignIn
                routing="virtual"
                afterSignInUrl="/dashboard"
                appearance={{
                  elements: {
                    socialButtonsBlock: "hidden",
                    footerActionLink: "hidden",
                  },
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Toggle Button */}
        <div className="flex justify-center mt-6 gap-4">
          {isSignUp ? (
            <button
              onClick={() => setIsSignUp(false)}
              className="px-6 py-3 rounded-3xl bg-gray-100 text-gray-800 font-semibold shadow-lg relative overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Already have an account? Sign In
            </button>
          ) : (
            <button
              onClick={() => setIsSignUp(true)}
              className="px-6 py-3 rounded-3xl bg-gradient-to-r from-sky-500 to-sky-700 text-white font-semibold shadow-lg relative overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Don’t have an account? Sign Up
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
