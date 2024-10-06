import { withIronSession } from 'next-iron-session';

export default withIronSession(async function userRoute(req, res) {
  const session = req.session.get('user');
  const user = session;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({ user });
}, {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
