
const express = require("express");
const router = express.Router();
const MeetingService = require("../service/meeting.service");

router.post("/", async (req, res) => {
  try {
    const User = require("../../user/model/user.model");
    let demoUser = await User.findOne({ where: { email: "demo@test.com" } });

    if (!demoUser) {
      demoUser = await User.create({
        name: "Demo User",
        email: "demo@test.com",
      });
    }

    const meeting = await MeetingService.createMeeting({
      ...req.body,
      userId: demoUser.id,
    });

    res.status(201).json(meeting);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
});


router.get("/", async (req, res) => {
  const meetings = await MeetingService.listMeetings(req.query);
  res.json(meetings);
});

router.get("/:id", async (req, res) => {
  const meeting = await MeetingService.getMeeting(req.params.id);
  res.json(meeting);
});

router.put("/:id", async (req, res) => {
  const meeting = await MeetingService.updateMeeting(req.params.id, req.body);
  res.json(meeting);
});

router.delete("/:id", async (req, res) => {
  await MeetingService.deleteMeeting(req.params.id);
  res.status(204).send();
});

module.exports = router;
