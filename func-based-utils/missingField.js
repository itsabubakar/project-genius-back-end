export const Fields = (fields, req) => {
  const missingFields = fields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return missingFields;
  }
  return false;
};
