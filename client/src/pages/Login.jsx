import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'กรุณากรอกอีเมล';
    if (!formData.password) newErrors.password = 'กรุณากรอกรหัสผ่าน';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setLoading(true);
    try {
      const data = await authService.login(formData); // data = { _id, username, email, role, token }

      if (!data?.token) {
        setErrors({ general: 'ข้อมูลผู้ใช้ไม่ถูกต้อง' });
        return;
      }

      // สร้าง object user ตามที่ AuthContext ต้องการ
      const user = {
        id: data._id,
        username: data.username,
        email: data.email,
        role: data.role
      };

      login(data.token, user); // บันทึก token + user

      navigate('/'); // ไปหน้า Home
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">เข้าสู่ระบบ</h1>
          <p className="text-gray-600">กรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
        </div>

        <Card className="bg-gray-50 text-gray-900 shadow-md rounded-xl" padding="md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && <div className="p-3 bg-red-100 rounded-lg text-red-700 text-sm">{errors.general}</div>}

            <Input type="email" name="email" label="อีเมล" placeholder="example@email.com"
              value={formData.email} onChange={handleChange} error={errors.email} required />

            <Input type="password" name="password" label="รหัสผ่าน" placeholder="••••••••"
              value={formData.password} onChange={handleChange} error={errors.password} required />

            <Button type="submit" fullWidth disabled={loading} className="bg-gray-700 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-200">
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-600">
            <p>ยังไม่มีบัญชี? <a href="/register" className="text-gray-800 font-medium hover:text-gray-700">สมัครสมาชิก</a></p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
