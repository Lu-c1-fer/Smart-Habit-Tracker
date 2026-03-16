const validate = (schema) => (req, res, next) => {
    console.log('Validating body:', JSON.stringify(req.body));
  const result = schema.safeParse(req.body);
 console.log('Validation result:', result.success, result.success ? '' : JSON.stringify(result.error.issues));
  if (!result.success) {
    // Zod v4 — errors live in result.error.issues, not result.error.errors
    const errors = result.error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors,
    });
  }

  req.body = result.data;
  return next();
};

export { validate };