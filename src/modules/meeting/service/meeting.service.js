
const sequelize = require("../../../config/database");
const { Op } = require("sequelize");
const Meeting = require("../model/meeting.model");

class MeetingService {
  static async createMeeting(data) {
    const { userId, startTime, endTime } = data;

    if (new Date(startTime) >= new Date(endTime)) {
      const err = new Error("startTime must be less than endTime");
      err.status = 400;
      throw err;
    }

    return sequelize.transaction(async (t) => {
      const conflict = await Meeting.findOne({
        where: {
          userId,
          startTime: { [Op.lt]: endTime },
          endTime: { [Op.gt]: startTime },
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (conflict) {
        const err = new Error("Time slot already booked");
        err.status = 400;
        throw err;
      }

      return Meeting.create(data, { transaction: t });
    });
  }

  static listMeetings(filters) {
    const where = {};
    if (filters.userId) where.userId = filters.userId;
    return Meeting.findAll({ where });
  }

  static getMeeting(id) {
    return Meeting.findByPk(id);
  }

  static async updateMeeting(id, data) {
  const meeting = await Meeting.findByPk(id);
  if (!meeting) throw new Error("Meeting not found");

  const { startTime, endTime, userId } = {
    startTime: data.startTime || meeting.startTime,
    endTime: data.endTime || meeting.endTime,
    userId: data.userId || meeting.userId,
  };

  if (new Date(startTime) >= new Date(endTime)) {
    const err = new Error("startTime must be less than endTime");
    err.status = 400;
    throw err;
  }

  const conflict = await Meeting.findOne({
    where: {
      userId,
      id: { [Op.ne]: id },
      startTime: { [Op.lt]: endTime },
      endTime: { [Op.gt]: startTime },
    },
  });

  if (conflict) {
    const err = new Error("Time slot already booked");
    err.status = 400;
    throw err;
  }

  return meeting.update(data);
}


  static async deleteMeeting(id) {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) throw new Error("Meeting not found");
    return meeting.destroy();
  }
}

module.exports = MeetingService;
