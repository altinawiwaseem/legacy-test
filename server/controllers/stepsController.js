import TestSession from "../models/testSession.js";
import { StepsData } from "../models/testSteps.js";

export const createAllTestSteps = async (req, res) => {
  try {
    const createSteps = await StepsData.create(req.body);
    return res.status(201).json({ message: "Steps created", createSteps });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSteps = async (req, res) => {
  try {
    const data = await StepsData.find({});
    return res.status(200).json({ message: "All Data found", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTestSession = async (req, res) => {
  const {
    user,
    market_variant,
    screen_size,
    test_object,
    project,
    build_number,
    stable,
  } = req.body;

  const steps = await StepsData.find({});

  //create a new session
  try {
    const newTestSession = await TestSession.create({
      user,
      steps,
      market_variant,
      screen_size,
      test_object,
      project,
      build_number,
      stable,
    });

    if (!newTestSession) return;

    return res
      .status(200)
      .json({ message: "New Test Session Created", newTestSession });
  } catch (error) {
    return res.send(error.message);
  }
};

export const updateSession = async (req, res) => {
  const { id, ...updatedData } = req.body;
  try {
    const updatedSession = await TestSession.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    );

    if (!updatedSession) {
      return res.status(404).json({ message: "Session not found!" });
    }

    res.status(201).json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: "Error updating session", error });
  }
};

export const deleteSession = async (req, res) => {
  const { id } = req.body;

  try {
    const result = await TestSession.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Session not found!" });
    }

    res.status(200).json({ message: "Session deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting session", error });
  }
};

export const fetchSessions = async (req, res) => {
  try {
    const { dateRange, selectedProjects, fetchAll } = req.body;

    if (fetchAll) {
      const allSessions = await TestSession.find();
      return res.json(allSessions);
    }

    const query = {};

    if (dateRange.startDate && dateRange.endDate) {
      let startDate = new Date(dateRange.startDate);
      let endDate = new Date(dateRange.endDate);

      if (dateRange.startDate === dateRange.endDate) {
        endDate.setHours(23, 59, 59, 999);
      }

      query.created_at = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (selectedProjects && selectedProjects.length) {
      query.project = { $in: selectedProjects };
    }

    const sessions = await TestSession.find(query);

    res.json(sessions);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};
