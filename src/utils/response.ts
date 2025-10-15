export const success = (res: any, data: any, message = "Success") =>
  res.status(200).json({ message, data });

export const failure = (res: any, error: string, code = 500) =>
  res.status(code).json({ error });
