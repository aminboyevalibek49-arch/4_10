const { read_file, write_file } = require("../fs/file_system");
const bcrypt = require("bcryptjs"); // BUG FIX: was require("../node_modules/bcryptjs/umd") — noto'g'ri import
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const users = read_file("users.json");

    const foundedUser = users.find((user) => user.email === email);

    // BUG FIX: shart teskari edi — !foundedUser bo'lsa "already exists" deyilgan
    // To'g'risi: foundedUser topilsa (allaqachon bor) — xato qaytarish
    if (foundedUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    users.push({
      id: uuid.v4(),
      username,
      email,
      role: "user",
      password: hashPassword,
    });

    write_file("users.json", users);

    res.status(201).json({
      message: "Registered",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = read_file("users.json");

    const foundedUser = users.find((item) => item.email === email);

    if (!foundedUser) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const decode = await bcrypt.compare(password, foundedUser.password);

    if (decode) {
      const payload = {
        id: foundedUser.id,
        email: foundedUser.email,
        role: foundedUser.role,
      };

      // BUG FIX: jwt.sign(payload.env.SEKRET_KEY, ...) — to'liq noto'g'ri
      // To'g'risi: jwt.sign(payload, SECRET_KEY, options)
      const token = jwt.sign(payload, process.env.SEKRET_KEY, {
        expiresIn: "5d",
      });

      return res.status(200).json({
        message: "Success",
        token,
      });
    } else {
      return res.status(401).json({
        message: "Wrong password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
