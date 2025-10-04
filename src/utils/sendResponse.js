export function sendResponse(res, code, message, data = null, isError = false) {
  const payload = { code, message };
  if (data) payload.data = data;
  if (isError) payload.error = true;
  return res.status(code).json(payload);
}
