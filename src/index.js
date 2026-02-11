
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const User = require("./modules/user/model/user.model");
const sequelize = require("./config/database");

const userRoutes = require("./modules/user/routes/user.routes");
const meetingRoutes = require("./modules/meeting/routes/meeting.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", userRoutes);
app.use("/meetings", meetingRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(async () => {
  let demoUser = await User.findOne({ where: { email: "demo@test.com" } });

  if (!demoUser) {
    demoUser = await User.create({
      name: "Demo User",
      email: "demo@test.com",
    });
    console.log("Demo user created");
  }

  global.demoUserId = demoUser.id;

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log("Server running on " + PORT)
  );
});

