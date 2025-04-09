// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    // 토큰을 로컬스토리지에서 가져옴
    const token = localStorage.getItem("token");

    // 토큰이 있으면 자식 컴포넌트를 보여주고, 없으면 로그인 페이지로 리디렉션
    return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
