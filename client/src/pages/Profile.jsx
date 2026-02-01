import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>คุณยังไม่ได้เข้าสู่ระบบ</p>
        <Button className="ml-4" onClick={() => navigate("/login")}>
          เข้าสู่ระบบ
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">ข้อมูลผู้ใช้</h2>

        <div className="mb-4">
          <span className="text-gray-400">ชื่อผู้ใช้: </span>
          <span className="font-medium">{user.username}</span>
        </div>

        <div className="mb-4">
          <span className="text-gray-400">Role: </span>
          <span className="font-medium">{user.role === "admin" ? "Admin" : "User"}</span>
        </div>

        <Button
          variant="secondary"
          fullWidth
          onClick={handleLogout}
        >
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );
};

export default Profile;
