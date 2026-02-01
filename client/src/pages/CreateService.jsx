import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { serviceService } from "../services/serviceService";
import Input from "../components/Input";
import Button from "../components/Button";
import Swal from "sweetalert2";

const CreateService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !category || !price) {
      Swal.fire("ผิดพลาด", "กรุณากรอกข้อมูลให้ครบ", "error");
      return;
    }

    setLoading(true);
    try {
      const newService = { name, description, category, pricePerDay: Number(price), available };
      await serviceService.create(newService, imageFile); // ส่งไฟล์ + token ใน serviceService

      Swal.fire("สำเร็จ 🎉", "สร้างอุปกรณ์เรียบร้อยแล้ว", "success");
      navigate("/services");
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างอุปกรณ์",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ตรวจสอบสิทธิ์
  if (user?.role?.toLowerCase() !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400 text-lg">
        🚫 คุณไม่มีสิทธิ์เข้าถึงหน้านี้
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4 text-gray-100">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">เพิ่มอุปกรณ์ใหม่</h1>
          <p className="text-gray-400">สำหรับผู้ดูแลระบบในการเพิ่มอุปกรณ์ให้เช่า</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ข้อมูลอุปกรณ์ */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-white">📦 ข้อมูลอุปกรณ์</h2>
              <div className="space-y-4">
                <Input
                  label="ชื่ออุปกรณ์"
                  placeholder="เช่น กล้อง DSLR, โปรเจกเตอร์"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="คำอธิบาย"
                  placeholder="รายละเอียดอุปกรณ์"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="หมวดหมู่"
                    placeholder="Camera / Lighting / Sound"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                  <Input
                    type="number"
                    label="ราคา / วัน (บาท)"
                    placeholder="เช่น 500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                {/* Upload image */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    รูปภาพ (ไม่บังคับ)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full text-gray-900 bg-gray-100 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* สถานะ */}
            <div className="border-t border-gray-700 pt-4">
              <h2 className="text-lg font-semibold mb-3 text-white">⚙️ สถานะอุปกรณ์</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="w-5 h-5 accent-green-500"
                />
                <span className="text-gray-300">พร้อมให้บริการ</span>
              </label>
            </div>

            {/* ปุ่ม */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className="bg-green-600 hover:bg-green-500"
              >
                {loading ? "กำลังบันทึก..." : "บันทึกอุปกรณ์"}
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate("/services")}
              >
                ยกเลิก
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateService;
