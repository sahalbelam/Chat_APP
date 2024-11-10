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
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-white/2 ml-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="h-6 w-6 text-gray-800" />
              <span className="ml-2 text-lg font-semibold text-gray-800">
                <Link to={'/'}>ChatAPP</Link>
              </span>
            </div>
            <div className="flex items-center">
              <Users className="h-6 w-6 text-gray-800" />
              <span className="ml-2 text-lg font-semibold text-gray-800">
                Room: {roomId}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Logged in as: {userId}
              </span>
              <Button
                onClick={getout}
                variant="ghost"
                className="hover:text-red-600 flex items-center gap-2 hover:bg-gray-100 hover:border-2 border-red-600"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl w-full mx-auto sm:px-6 lg:px-8 py-6">
        <div className="backdrop-blur-lg flex flex-col bg-white rounded-2xl " style={{ height: 'calc(100vh - 170px)' }}>
          <div className="flex-1 overflow-y-auto no-scrollbar mb-4 ">
            <LoadMessages />
          </div>

          {/* Message Input */}
          <div className="p-4">
            <div className="flex gap-x-3 items-center">
              <Input
                aria-label="Message Input"
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 h-12 rounded-xl font-medium text-lg border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                placeholder="Type your message..."
                value={message}
              />
              <Button
                onClick={addMessage}
                disabled={isSending}
                className={`h-12 px-6 rounded-xl font-medium text-sm ${
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
      <footer className="bg-black border-t py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base font-medium text-white">
            © {new Date().getFullYear()} ChatApp. Created by Sahal Belam.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RoomLayout;