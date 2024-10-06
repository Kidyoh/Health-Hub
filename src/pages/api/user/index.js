import { withIronSession } from 'next-iron-session';

export default withIronSession(async function userRoute(req, res) {
  const user = req.session.get('user');

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({ userId: user.id });
}, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});