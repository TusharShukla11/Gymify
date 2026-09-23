const {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deactivateMember,
} = require("../services/memberService");

const {
  validateCreateMember,
  validateUpdateMember,
} = require("../validators/memberValidator");

async function create(req, res) {
  try {
    const errors = validateCreateMember(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const member = await createMember(req.body);

    return res.status(201).json({
      success: true,
      message: "Member created successfully.",
      data: member,
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
    const members = await getAllMembers(req.query.search);

    return res.status(200).json({
      success: true,
      count: members.length,
      data: members,
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
    const member = await getMemberById(req.params.id);

    return res.status(200).json({
      success: true,
      data: member,
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
    const errors = validateUpdateMember(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const member = await updateMember(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Member updated successfully.",
      data: member,
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
    const result = await deactivateMember(req.params.id);

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

async function getMembers(req, res) {
  try {
    const result = await memberService.getAllMembers(
      req.query
    );

    return res.status(200).json({
      success: true,
      data: result.members,
      pagination: result.pagination
    });

  } catch (error) {
    return res.status(500).json({
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
  getMembers
};