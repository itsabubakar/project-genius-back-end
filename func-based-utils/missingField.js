export const Fields = (fields, req, res) => {
  const missingFields = fields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "missing required fields",
      missing_fields: missingFields,
    });
  }
  return false;
};
