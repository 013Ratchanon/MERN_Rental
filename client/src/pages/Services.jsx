import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ServiceCard from "../components/ServiceCard";
import Input from "../components/Input";
import { serviceService } from "../services/serviceService";
import { nanoid } from "nanoid";

const Services = () => {
  const { user, loading } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin"; // ปรับ case-insensitive
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAll();

        const dataWithKeys = data.map((s) => ({
          ...s,
          _key: s._id || nanoid(),
          features: s.features?.map((f, i) => ({
            ...f,
            _key: f.id || nanoid() + "-" + i,
          })),
          images: s.images?.map((i, idx) => ({
            ...i,
            _key: i.id || nanoid() + "-" + idx,
          })),
        }));

        setServices(dataWithKeys);
        setFilteredServices(dataWithKeys);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, services]);

  const categories = ["all", ...new Set(services.map((s) => s.category))];

  return (
    <div className="min-h-screen py-8 bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">อุปกรณ์ทั้งหมด</h1>
            <p className="text-gray-400">เลือกอุปกรณ์ที่คุณต้องการและจองได้เลย</p>
          </div>

          {/* ปุ่ม Create เฉพาะ admin */}
          {!loading && isAdmin && (
            <button
              onClick={() => navigate("/services/create")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition ml-4"
            >
              สร้างอุปกรณ์
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="ค้นหาอุปกรณ์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 text-black placeholder-gray-400 border-gray-700"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={category + "-" + index}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gray-700 text-white shadow"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {category === "all" ? "ทั้งหมด" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {loadingServices ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-gray-800 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service._key} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">ไม่พบอุปกรณ์</div>
        )}
      </div>
    </div>
  );
};

export default Services;
