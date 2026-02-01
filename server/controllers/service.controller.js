const Service = require("../models/Service");

// POST /api/services
exports.createService = async (req, res) => {
  try {
    const { name, description, category, pricePerDay, available } = req.body;

    if (!name || !pricePerDay) {
      return res.status(400).json({ message: "กรุณากรอกชื่อและราคา" });
    }

    const service = await Service.create({
      name,
      description,
      category,
      pricePerDay,
      available,
      user: req.user._id, // ✅ เพิ่ม user จาก token
      imageUrl: req.imageUrl || null,
    });

    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// GET /api/services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/services/:id
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// PUT /api/services/:id
exports.updateService = async (req, res) => {
  try {
    const { name, description, pricePerDay } = req.body;
    // อัปเดต imageUrl ถ้ามี
    const imageUrl = req.imageUrl || req.body.imageUrl;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, pricePerDay, ...(imageUrl && { imageUrl }) },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: "ไม่พบบริการนี้" });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "ไม่พบบริการนี้" });
    }

    res.status(200).json({ message: "ลบข้อมูลเรียบร้อย" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
