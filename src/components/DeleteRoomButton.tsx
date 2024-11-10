import { db } from "@/utils/firebase";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

const DeleteRoomButton = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const deleteRoom = async () => {
    if (!roomId) return;

    try {
      // Reference to the messages subcollection
      const messageCollectionRef = collection(db, "room", roomId, "message");

      // Get all documents in the message subcollection
      const messageDocs = await getDocs(messageCollectionRef);

      // Delete each document in the message subcollection
      const deleteMessagePromises = messageDocs.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deleteMessagePromises);

      // Reference to the room document
      const roomRef = doc(db, "room", roomId);

      // Delete the room document
      await deleteDoc(roomRef);

      console.log("Room and its messages deleted successfully.");
      navigate("/"); // Redirect to a different page after deletion
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <Button
      onClick={deleteRoom}
      className="bg-red-500 text-white rounded-lg hover:bg-red-700"
    >
        <Trash2 className="h-4 w-4" />
      Delete Room
    </Button>
  );
};

export default DeleteRoomButton;
