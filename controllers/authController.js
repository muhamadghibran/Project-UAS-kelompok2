const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database"); 

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const query = "SELECT * FROM anggota WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) {
        return res.status(500).send({ message: "Internal server error", error: err });
      }

      if (results.length === 0) {
        return res.status(400).send({ message: "Invalid credentials" });
      }

      const user = results[0];


      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).send({ message: "Invalid credentials" });
      }


      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.send({ token });
    });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
};
