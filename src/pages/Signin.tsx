import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { auth } from "@/utils/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import sideImage from "@/assets/bg.jpeg";
import { motion } from "framer-motion";

const Signin = () => {
  const [postInput, setPostInput] = useState({
    displayName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSignup = async (e: any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        postInput.email,
        postInput.password
      );
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err); // Log error with a message
    }
  };

  const googleSignup = async (e: any) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();
    try {
      // Sign in with a pop-up window
      const result = await signInWithPopup(auth, provider);

      // Pull signed-in user credential.
      const user = result.user;

      const userInfo = {
        displayName: user.displayName, // User's name
        email: user.email, // User's email
        photoURL: user.photoURL, // User's profile picture
        uid: user.uid, // User's unique ID
      };
      navigate("/");
      console.log("User Info:", userInfo);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
              <div>
                <div className="px-10">
                  <div className="mb-2 text-4xl font-bold">Welcome Back</div>
                  <div className="text-md ml-4 text-slate-500">
                    Don't have an account?
                    <Link className="ml-2 underline" to={"/signup"}>
                      signup
                    </Link>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <form
                    onSubmit={handleSignup}
                    className="flex flex-col space-y-4"
                  >
                    <Input
                      placeholder="Type your email"
                      onChange={(e) => {
                        setPostInput({
                          ...postInput,
                          email: e.target.value,
                        });
                      }}
                    />
                    <Input
                      placeholder="Type your password"
                      type="password"
                      onChange={(e) => {
                        setPostInput({
                          ...postInput,
                          password: e.target.value,
                        });
                      }}
                    />
                    <Button
                      type="submit"
                      className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                      Submit
                    </Button>
                  </form>

                  <div className="inline-flex items-center justify-center w-full">
                    <hr className="w-full h-px my-8 bg-gray-400 border-0 dark:bg-gray-700"></hr>
                    <span className="absolute px-3 font-medium text-gray-900 -translate-x-1 bg-white dark:text-white dark:bg-gray-900">
                      or
                    </span>
                  </div>

                  <button
                    onClick={googleSignup}
                    className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                  >
                    <span className="w-full relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Signin With Google
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src={sideImage}
              alt="image.jpg"
              className="transform scale-x-[-1] h-screen flex justify-center flex-col"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;
