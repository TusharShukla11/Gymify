const {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deactivateTrainer,
} = require("../services/trainerService");

const {
  validateCreateTrainer,
  validateUpdateTrainer,
} = require("../validators/trainerValidator");

async function create(req, res) {
  try {
    const errors = validateCreateTrainer(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const trainer = await createTrainer(req.body);

    return res.status(201).json({
      success: true,
      message: "Trainer created successfully.",
      data: trainer,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAll(req, res) {
  try {
    const trainers = await getAllTrainers(
      req.query.search
    );

    return res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getOne(req, res) {
  try {
    const trainer = await getTrainerById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: trainer,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const errors = validateUpdateTrainer(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const trainer = await updateTrainer(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Trainer updated successfully.",
      data: trainer,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function deactivate(req, res) {
  try {
    const result = await deactivateTrainer(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getTrainers(req, res) {
  try {
    const result = await trainerService.getAllTrainers({
      page: req.query.page,
      limit: req.query.limit,
      status: req.query.status,
      specialization: req.query.specialization
    });

    res.status(200).json({
      success: true,
      data: result.trainers,
      pagination: result.pagination
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deactivate,
  getTrainers
};