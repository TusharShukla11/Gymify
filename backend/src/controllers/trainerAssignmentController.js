const trainerAssignmentService = require("../services/trainerAssignmentService");

const {
  validateTrainerAssignment
} = require("../validators/trainerAssignmentValidator");


// Assign member
async function assignMember(req, res) {
  try {
    const errors = validateTrainerAssignment(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    const assignment =
      await trainerAssignmentService.assignMember(req.body);

    res.status(201).json({
      success: true,
      message: "Member assigned to trainer successfully.",
      data: assignment
    });

  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// Get all assignments
async function getAllAssignments(req, res) {
  try {
    const assignments =
      await trainerAssignmentService.getAllAssignments();

    res.json({
      success: true,
      data: assignments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// Get trainer members
async function getTrainerMembers(req, res) {
  try {
    const members =
      await trainerAssignmentService.getTrainerMembers(
        req.params.trainerId
      );

    res.json({
      success: true,
      data: members
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// Get member trainers
async function getMemberTrainers(req, res) {
  try {
    const trainers =
      await trainerAssignmentService.getMemberTrainers(
        req.params.memberId
      );

    res.json({
      success: true,
      data: trainers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// Remove assignment
async function removeAssignment(req, res) {
  try {
    const assignment =
      await trainerAssignmentService.removeAssignment(
        req.params.id
      );

    res.json({
      success: true,
      message: "Trainer assignment removed successfully.",
      data: assignment
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {
  assignMember,
  getAllAssignments,
  getTrainerMembers,
  getMemberTrainers,
  removeAssignment
};                                                  