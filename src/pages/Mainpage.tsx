import { motion } from "framer-motion";
import { LogOut, MessageCircle, Sparkles } from "lucide-react";
import JoinRoom from "../components/JoinRoom";
import CreateRoom from "../components/CreateRoom";
import { Button } from "@/components/ui/button";
import { auth } from "@/utils/firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

export default function Mainpage() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signup');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="absolute top-4 right-4">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="bg-white/90 hover:bg-white/70 text-indigo-600 border-indigo-200 hover:border-indigo-300 shadow-md"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto space-y-12"
        >
          <motion.div
            variants={itemVariants}
            className="text-center space-y-6"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <MessageCircle className="w-12 h-12 text-indigo-600" />
              <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                ChatAPP
              </h1>
            </div>
            <p className="text-xl text-indigo-600 max-w-2xl mx-auto leading-relaxed">
              Connect, collaborate, and communicate in real-time. Join existing rooms or create 
              your own space in seconds!
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-indigo-500">
              <Sparkles className="w-4 h-4" />
              <span>Powered by cutting-edge technology</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-8 lg:gap-12"
          >
            <JoinRoom />
            <CreateRoom />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Need assistance? Check out our{" "}
                <a href="#" className="text-indigo-600 hover:underline font-medium">
                  FAQ
                </a>{" "}
                or{" "}
                <a href="#" className="text-indigo-600 hover:underline font-medium">
                  contact our support team
                </a>
              </p>
            </div>

            <footer className="border-t border-indigo-200 pt-8">
              <div className="space-y-2">
                <p className="text-gray-600">
                  &copy; {new Date().getFullYear()} ChatAPP. All rights reserved.
                </p>
                <p className="text-indigo-500 font-medium">
                  Crafted with ❤️ by Sahal Belam
                </p>
              </div>
            </footer>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}