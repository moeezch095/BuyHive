export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    const errors = err.issues.map((e) => ({
      field: e.path[0],
      message: e.message,
    }));

    return res.status(422).json({
      success: false,
      errors,
    });
  }
};
