import { withSession } from "../middleware/session";

export default withSession(async (req, res) => {
  const user = req.session.get("user");

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Your protected route logic
  res.json({ message: "This is a protected route", user });
});
