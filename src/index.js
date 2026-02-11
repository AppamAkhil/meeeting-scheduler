
const express = require("express");
const cors = require("cors");
require("dotenv").config();
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

sequelize.authenticate()
  .then(() => {
    console.log("Database connected");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(process.env.PORT || 3000, () =>
      console.log(`Server running on port ${process.env.PORT || 3000}`)
    );
  })
  .catch(err => {
    console.error("Unable to connect to database:", err);
  });

