import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { LogIn, Users } from 'lucide-react'
import useAuth from "@/hooks/useAuth";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const isAuthenticated = useAuth()
  const navigate = useNavigate();
  
  const handleJoinroom = async () => {
    try {
      if (!isAuthenticated){
        navigate('/signup')
      }
      if (!roomId.trim()) {
        console.log("enter roomID");
        return;
      }
      const docRef = doc(db, "room", roomId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigate(`room/${roomId}`);
      }else{
        console.log("room does not exist")
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-lg">
      <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="text-2xl font-semibold flex items-center">
                  <LogIn className="w-6 h-6 mr-2" />
                  Join Room
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-gray-600">Enter a room code to join an existing collaborative space.</p>
                <Input 
                  placeholder="Enter room code (use: oIlH6ZQAnBtDePf62Ypq)" 
                  value={roomId} 
                  onChange={(e) => setRoomId(e.target.value)}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </CardContent>
              <CardFooter>
                <Button onClick={handleJoinroom} className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300">
                  <Users className="w-4 h-4 mr-2" />
                  Join Room
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
    </div>
  );
};

export default JoinRoom;
