import { auth, db } from "@/utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Zap } from "lucide-react";
import useAuth from "@/hooks/useAuth";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [ownerid, setOwnerid] = useState("");
  const [error, setError] = useState("");
  const isAuthenticated = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setOwnerid(user.uid);
      } else navigate("/signup");
    });
    return () => unsubscribe();
  }, []);

  const makeRoom = async (roomName: string, ownerid: string) => {
    try {
      const roomRef = await addDoc(collection(db, "room"), {
        name: roomName,
        ownerid,
        createdAt: serverTimestamp(),
      });
      return roomRef.id;
    } catch (e) {
      console.log(e);
    }
  };

  const handleCreateRoom = async () => {
    if (!isAuthenticated){
      navigate('/signup')
    }
    if (!roomName.trim()) {
      setError("please enter the room name");
      return;
    }
    if (!ownerid) {
      setError("make sure you are logged in");
      return;
    }
    try {
      const roomId = await makeRoom(roomName, ownerid);
      navigate(`/room/${roomId}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="max-w-lg">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="text-2xl font-semibold flex items-center">
              <PlusCircle className="w-6 h-6 mr-2" />
              Create Room
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-gray-600">
              Create a room & invite others to your collaborative space.
            </p>
            <Input
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="border-gray-300 focus:ring-green-500 focus:border-green-500"
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreateRoom}
              className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
            >
              <Zap className="w-4 h-4 mr-2" />
              Create Room
            </Button>
          </CardFooter>{error && error}
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateRoom;
