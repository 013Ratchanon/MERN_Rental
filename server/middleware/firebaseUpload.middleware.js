const firebaseConfig = require("../config/firebase.config");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const uploadToFirebase = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "กรุณาอัปโหลดรูปภาพ" });
  }

  try {
    const fileName = `services/${Date.now()}-${req.file.originalname}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, req.file.buffer, {
      contentType: req.file.mimetype,
    });

    const imageUrl = await getDownloadURL(storageRef);

    // ⭐ สำคัญมาก
    req.imageUrl = imageUrl;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = uploadToFirebase;
