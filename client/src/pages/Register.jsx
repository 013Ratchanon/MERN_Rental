import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'กรุณากรอกชื่อผู้ใช้';
    if (!formData.email) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    if (!formData.password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
    } else if (formData.password.length < 6) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await authService.register(formData);
      navigate('/login'); // ไปหน้า Login หลังสมัคร
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">สมัครสมาชิก</h1>
          <p className="text-gray-600">สร้างบัญชีเพื่อเริ่มเช่าอุปกรณ์</p>
        </div>

        {/* Card */}
        <Card className="bg-white text-black shadow-lg rounded-xl" padding="md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-red-100 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            {/* Username */}
            <Input
              type="text"
              name="username"
              label="ชื่อผู้ใช้"
              placeholder="กรอกชื่อผู้ใช้"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              required
              className="text-black placeholder-gray-400 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
            />

            {/* Email */}
            <Input
              type="email"
              name="email"
              label="อีเมล"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              className="text-black placeholder-gray-400 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
            />

            {/* Password */}
            <Input
              type="password"
              name="password"
              label="รหัสผ่าน"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              className="text-black placeholder-gray-400 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className="bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
            >
              {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-gray-600">
            <p>
              มีบัญชีอยู่แล้ว?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:text-blue-500">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
