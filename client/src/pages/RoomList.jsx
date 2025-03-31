import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RoomList.scss";

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setRooms(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRooms();
    }, []);

    // ✅ 삭제 핸들러 추가
    const handleDelete = async (e, id) => {
        e.stopPropagation(); // 방 진입 막기
        if (!window.confirm("정말 이 방을 삭제할까요?")) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/rooms/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setRooms(rooms.filter((room) => room._id !== id));
        } catch (err) {
            alert("삭제 실패");
            console.error(err);
        }
    };

    return (
        <div className="room-list-container">
            <h2>채팅방 목록</h2>
            <button className="create-room-btn" onClick={() => navigate("/create-room")}>
                + 방 만들기
            </button>
            {rooms.map((room) => (
                <div key={room._id} className="room-item" onClick={() => navigate(`/chat-room/${room._id}`)}>
                    <div>
                        <h3>{room.name}</h3>
                        <p>{room.description}</p>
                    </div>
                    <button className="delete-btn" onClick={(e) => handleDelete(e, room._id)}>삭제</button>
                </div>
            ))}
        </div>
    );
};

export default RoomList;
