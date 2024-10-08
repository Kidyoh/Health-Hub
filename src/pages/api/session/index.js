import { withIronSession } from "next-iron-session";

async function handler(req, res) {
  const session = req.session.get("user");

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Example session structure
  res.status(200).json({
    userId: session.id,
    role: session.role,
    status: session.status, 
  });
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: "next-iron-session/login",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
