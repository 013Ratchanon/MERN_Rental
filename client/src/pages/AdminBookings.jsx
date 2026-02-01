import React, { useState, useEffect } from "react";
import { bookingService } from "../services/bookingService";
import Card from "../components/Card";
import Button from "../components/Button";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ที่จะเปลี่ยนสถานะเป็น "${getStatusText(newStatus)}"?`)) return;

    try {
      await bookingService.updateStatus(bookingId, newStatus);
      alert("อัพเดทสถานะสำเร็จ");
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "รอดำเนินการ",
      confirmed: "ยืนยันแล้ว",
      completed: "เสร็จสิ้น",
      cancelled: "ยกเลิก",
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">จัดการการจอง</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {status === "all"
                  ? `ทั้งหมด (${bookings.length})`
                  : `${getStatusText(status)} (${bookings.filter(
                      (b) => b.status === status
                    ).length})`}
              </button>
            )
          )}
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 && (
            <Card>
              <div className="text-center py-12 text-black">
                ไม่พบการจอง
              </div>
            </Card>
          )}

          {filteredBookings.map((booking) => (
            <Card key={booking._id}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b">
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      {booking.service?.name || booking.serviceName || "อุปกรณ์ถูกลบ"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusText(booking.status)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-black">
                        {booking.service?.category || booking.serviceCategory || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">ราคารวม</div>
                    <div className="text-2xl font-bold text-primary-600">
                      ฿{booking.totalPrice?.toLocaleString() || 0}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                  <div>
                    <h4 className="font-semibold mb-2">ข้อมูลลูกค้า</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>ชื่อ:</strong>{" "}
                        {booking.user?.name || booking.customerName || "-"}
                      </p>
                      <p>
                        <strong>อีเมล:</strong> {booking.user?.email || "-"}
                      </p>
                      <p>
                        <strong>เบอร์:</strong> {booking.user?.phone || "-"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">รายละเอียดการจอง</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>วันที่เช่า:</strong>{" "}
                        {formatDate(booking.startDate || booking.bookingDate)}
                      </p>
                      <p>
                        <strong>จำนวนวัน:</strong> {booking.days || booking.quantity || "-"}
                      </p>
                      <p>
                        <strong>หมายเหตุ:</strong> {booking.notes || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {booking.status !== "completed" && booking.status !== "cancelled" && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {booking.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(booking._id, "confirmed")}
                        >
                          ✓ ยืนยันการจอง
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleStatusChange(booking._id, "cancelled")}
                        >
                          ✗ ยกเลิก
                        </Button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(booking._id, "completed")}
                      >
                        ✓ เสร็จสิ้น
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
