// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import RoomList from "./pages/RoomList";
import RoomChat from "./pages/RoomChat";
import { SocketContextProvider } from "./contexts/SocketContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import CreateRoom from "./pages/CreateRoom";
import "./App.scss";

function App() {
    return (
        <Router>
            <SocketContextProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                        <Route path="/rooms" element={<PrivateRoute><RoomList /></PrivateRoute>} />
                        <Route path="/chat-room/:roomId" element={<PrivateRoute><RoomChat /></PrivateRoute>} />
						<Route path="/create-room" element={<PrivateRoute><CreateRoom /></PrivateRoute>} />
                    </Routes>
                </Layout>
            </SocketContextProvider>
        </Router>
    );
}

export default App;
