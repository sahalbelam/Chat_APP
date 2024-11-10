import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/utils/firebase";
import { Link, useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import LoadMessages from "./LoadMessages";
import { Home, LogOut, Users } from "lucide-react";

const RoomLayout = () => {
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const { roomId } = useParams<{ roomId: string }>();
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  function getout(){
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/signup")
    }).catch((error) => {
      console.log(error)
    });
  }

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserId(user.displayName ?? "");
      }
    });

    return () => unsubscribeAuth();
  }, []);


  const addMessage = async () => {
    if (message.trim() === "") return;

    setIsSending(true);

    try {
      await addDoc(collection(db, "room", roomId!, "message"), {
        text: message,
        createdAt: serverTimestamp(),
        userId,
      });
      setMessage("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col min-h-screen">
    {/* Navbar */}
    <nav className="bg-white/2 sticky top-0 z-10 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:h-16 space-y-3 sm:space-y-0">
          {/* Logo and Home Link */}
          <div className="flex items-center">
            <Home className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
            <span className="ml-2 text-base sm:text-lg font-semibold text-gray-800">
              <Link to={'/'}>ChatAPP</Link>
            </span>
          </div>
          
          {/* Room Info */}
          <div className="flex items-center">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
            <span className="ml-2 text-base sm:text-lg font-semibold text-gray-800">
              Room: {roomId}
            </span>
          </div>
          
          {/* User Info and Sign Out */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[150px] sm:max-w-none">
              Logged in as: {userId}
            </span>
            <Button
              onClick={getout}
              variant="ghost"
              size="sm"
              className="hover:text-red-600 flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:border-2 border-red-600 text-xs sm:text-sm px-2 sm:px-4"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>

    {/* Main Content */}
    <div className="flex-1 max-w-6xl w-full mx-auto px-2 sm:px-6 py-3 sm:py-6">
      <div 
        className="backdrop-blur-lg flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-lg" 
        style={{ height: 'calc(100vh - 170px)' }}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar mb-2 sm:mb-4">
          <LoadMessages />
        </div>

        {/* Message Input */}
        <div className="p-2 sm:p-4">
          <div className="flex gap-x-2 sm:gap-x-3 items-center">
            <Input
              aria-label="Message Input"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl text-base sm:text-lg border-gray-300 focus:border-gray-400 focus:ring-gray-400"
              placeholder="Type your message..."
              value={message}
            />
            <Button
              onClick={addMessage}
              disabled={isSending}
              className={`h-10 sm:h-12 px-4 sm:px-6 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm ${
                isSending
                  ? "bg-gray-400"
                  : "bg-gray-800 hover:bg-gray-700 active:bg-gray-900"
              } text-white transition-colors duration-200`}
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="bg-black py-3 sm:py-4 mt-auto">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-center text-xs sm:text-base font-medium text-white">
          © {new Date().getFullYear()} ChatApp. Created by Sahal Belam.
        </p>
      </div>
    </footer>
  </div>
  );
};

export default RoomLayout;