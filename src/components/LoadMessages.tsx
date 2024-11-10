import { ScrollArea } from "@/components/ui/scroll-area";
import { auth, db } from "@/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
  
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import DeleteRoomButton from "./DeleteRoomButton";
import { LogOut, Pin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
}

const LoadMessages = () => {
  const colors = [
    "text-red-500",
    "text-orange-500",
    "text-green-600",
    "text-blue-600",
    "text-yellow-600",
    "text-emerald-500",
    "text-fuchsia-700",
    "text-pink-800",
  ];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerId, setOwnerId] = useState("");
  const [pinnedMessage, setPinnedMessage] = useState('')
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const userColors = useRef(new Map<string, string>());

  // Get consistent color for user
  const getUserColor = (userId: string) => {
    if (!userColors.current.has(userId)) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      userColors.current.set(userId, randomColor);
    }
    return userColors.current.get(userId);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setOwnerId(user.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!roomId || !ownerId) return;

    const checkRoomOwnership = async () => {
      try {
        const docRef = doc(db, "room", roomId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const roomData = docSnap.data();
          setIsOwner(roomData.ownerid === ownerId);
        } else {
          console.log("Room does not exist.");
        }
      } catch (error) {
        console.error("Error checking room ownership:", error);
      }
    };

    checkRoomOwnership();
  }, [roomId, ownerId]);

  useEffect(() => {
    if (!roomId) return;

    const messageRef = collection(db, "room", roomId, "message");
    const q = query(messageRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(newMessages);
    });

    const roomRef = doc(db, "room", roomId);
    const unsubscribeRoom = onSnapshot(roomRef, (docSnapshot) => {
      if (!docSnapshot.exists()) {
        console.log("Room has been deleted. Redirecting...");
        navigate("/");
      }
    });

    return () => {
      unsubscribe();
      unsubscribeRoom();
    };
  }, [roomId, navigate]);

  const handleLeave = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full ">
      <div className="flex p-4 justify-end gap-x-3 mb-4">
        {pinnedMessage && (
          <Popover>
            <PopoverTrigger className="border-2 border-emerald-600 px-2 rounded-lg bg-emerald-600 text-white font-medium">Show Pinned Messages</PopoverTrigger>
            <PopoverContent className="font-medium ">{pinnedMessage}</PopoverContent>
          </Popover>
          )
        }
        <Button
          variant="outline"
          onClick={handleLeave}
          className="flex items-center gap-2 hover:border-2 hover:border-black"
        >
          <LogOut className="h-4 w-4" />
          Leave Room
        </Button>
        {isOwner && (
          <DeleteRoomButton />
        )}
      </div>

      <ScrollArea className="flex-1 rounded-xl">
        <div
          ref={scrollRef}
          className="flex flex-col gap-y-4 p-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className="group flex flex-col space-y-1"
            >
              <div className="flex items-center gap-x-2">
                {isOwner?
                <button className="opacity-0 hover:opacity-100" onClick={()=>setPinnedMessage(message.text)}><Pin className="h-5 pl-2" /></button>
                :<div />}
                <span
                  className={`font-semibold ${getUserColor(message.userId)}`}
                >
                  {message.userId}
                </span>
                <HoverCard>
                  <HoverCardTrigger className="text-gray-900 font-medium max-w-3xl break-words pl-1"> {message.text}</HoverCardTrigger>
                    <HoverCardContent className="flex text-xs text-gray-700">
                      {message.createdAt?.toDate()?.toLocaleTimeString()}
                    </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LoadMessages;