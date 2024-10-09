import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import UserProfile from "../components/UserProfile";

export default function Home() {
  const { data: session } = useSession();
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    const result = await signIn("google", {
      redirect: false,
      prompt: "select_account",
    });
    if (result?.error) {
      setError("Failed to sign in. Please try again.");
    } else if (result?.ok) {
      window.location.href = "/";
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setError("");
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
    

      
     

      {session ? (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl transition-shadow duration-300 ease-in-out hover:shadow-2xl animate-fade-in">
     
          <UserProfile />
          <button
            onClick={handleSignOut} // Use the updated sign out function
            className="w-full px-4 py-2 mt-4 font-semibold text-white bg-red-600 rounded-lg transition duration-200 shadow-md transform hover:scale-105"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          className="px-6 py-3 mt-4 font-semibold text-white bg-red-500 rounded-lg shadow-lg hover:bg-red-600 transition duration-200 transform hover:scale-105"
        >
       
          Sign in with Google
        </button>
      )}
      {error && (
        <div className="mt-4 text-red-400 text-lg font-semibold">{error}</div>
      )}

  

   
    </div>
  );
}
