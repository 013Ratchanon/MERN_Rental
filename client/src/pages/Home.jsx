import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { serviceService } from "../services/serviceService";
import ServiceCard from "../components/ServiceCard";
import Button from "../components/Button";

const Home = () => {
  const { user, isAuthenticated } = useAuth(); // ใช้ isAuthenticated
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAll();
        setServices(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            เช่าอุปกรณ์ออนไลน์ง่าย ๆ
          </h1>
          <p className="text-lg md:text-2xl mb-10 text-gray-300">
            อุปกรณ์คุณภาพสูง พร้อมให้คุณใช้งานทันที
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-gray-700 text-white hover:bg-gray-600 transition-transform transform hover:scale-105"
            onClick={() => navigate("/services")}
          >
            เริ่มเช่าเลย
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            ทำไมต้องเลือกเรา
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "รวดเร็ว", desc: "จองและรับอุปกรณ์ได้ทันที", icon: "⚡" },
              { title: "คุณภาพ", desc: "อุปกรณ์ทุกชิ้นผ่านการตรวจสอบ", icon: "✅" },
              { title: "ราคาคุ้มค่า", desc: "เช่าในราคาที่เหมาะสม", icon: "💰" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-gray-850">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">อุปกรณ์แนะนำ</h2>
            <Button
              variant="outline"
              className="border-gray-500 text-gray-100 hover:bg-gray-700 hover:text-white transition-colors"
              onClick={() => navigate("/services")}
            >
              ดูทั้งหมด
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-gray-800 rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} dark />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - ซ่อนเมื่อ login */}
      {!isAuthenticated && (
        <section className="bg-gray-800 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
              พร้อมเริ่มเช่าแล้วหรือยัง?
            </h2>
            <p className="text-xl mb-8 text-gray-400">
              สมัครสมาชิกวันนี้และเริ่มเช่าอุปกรณ์ได้ทันที
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-gray-700 text-white hover:bg-gray-600 transition-transform transform hover:scale-105"
              onClick={() => navigate("/register")}
            >
              สมัครสมาชิก
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
