import { Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import RoomLayout from "./components/RoomLayout"
import Mainpage from "./pages/Mainpage"

function App() {
  
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Mainpage />} />
        <Route path="/room/:roomId" element={<RoomLayout />} />
      </Routes>
    </div>
  )
}

export default App
