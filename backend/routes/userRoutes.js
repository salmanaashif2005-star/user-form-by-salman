const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (User, Address, authMiddleware) => {
  // CREATE: Save new user
  router.post("/save", async (req, res) => {
    const {
      name,
      email,
      age,
      password,
      phone,
      addresses, // this is now an array of { address, city, pincode }
    } = req.body;

    if (
      !name ||
      !email ||
      !age ||
      !password ||
      !addresses ||
      addresses.length === 0
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        age,
        password: hashedPassword,
        phone,
        imageUrl: req.body.imageUrl || null,
      });

      // Save multiple address entries
      for (const addr of addresses) {
        const { address, country, state, city, pincode } = addr;

        if (
          !address ||
          !country?.name ||
          !country?.isoCode ||
          !state?.name ||
          !state?.isoCode ||
          !city?.name ||
          !pincode
        )
          continue;

        await Address.create({
          address,
          countryName: country.name,
          countryCode: country.isoCode,
          stateName: state.name,
          stateCode: state.isoCode,
          cityName: city.name,
          cityCode: city?.isoCode || null,
          pincode,
          userId: user.id,
        });
      }

      res.status(200).json({ message: "User saved successfully", id: user.id });
    } catch (error) {
      res.status(500).json({ message: "Error saving user" });
    }
  });

  // LOGIN: Verify password and return JWT
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { name: username } });
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      const token = jwt.sign(
        { id: user.id, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({
        success: true,
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // GET: Unified API for single user or all users (admin)
  router.post("/users", authMiddleware, async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "User ID is required" });

    try {
      const requestingUser = await User.findByPk(id);
      if (!requestingUser)
        return res.status(404).json({ message: "User not found" });

      const users =
        requestingUser.role === "admin"
          ? await User.findAll({
              attributes: { exclude: ["password"] },
              include: [{ model: Address }],
            })
          : [
              await User.findByPk(id, {
                attributes: { exclude: ["password"] },
                include: [{ model: Address }],
              }),
            ];
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user(s)" });
    }
  });

  // DELETE: Delete user by ID
  router.delete("/delete/:id", authMiddleware, async (req, res) => {
    const userId = req.params.id;
    try {
      const deleted = await User.destroy({ where: { id: userId } });
      if (!deleted) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // UPDATE: Update user by ID
  router.put("/update/:id", authMiddleware, async (req, res) => {
    const userId = req.params.id;
    const { name, email, age, password, phone, imageUrl } = req.body; // 👈 clean destructure
    try {
      let updateData = { name, email, age, phone };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      if (imageUrl) {
        updateData.imageUrl = imageUrl; // 👈 save S3 URL
      }

      const [updated] = await User.update(updateData, {
        where: { id: userId },
      });

      if (!updated) return res.status(404).json({ message: "User not found" });

      // Update or create address
      const { addresses } = req.body;

      // Delete old addresses first
      await Address.destroy({ where: { userId } });

      for (const addr of addresses) {
        const { address, country, state, city, pincode } = addr;

        if (
          !address ||
          !country?.name ||
          !country?.isoCode ||
          !state?.name ||
          !state?.isoCode ||
          !city?.name ||
          !pincode
        )
          continue;

        await Address.create({
          address,
          countryName: country.name,
          countryCode: country.isoCode,
          stateName: state.name,
          stateCode: state.isoCode,
          cityName: city.name,
          cityCode: city?.isoCode || null,
          pincode,
          userId,
        });
      }

      res.json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  });

  return router;
};
