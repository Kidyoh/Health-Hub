import { withIronSession } from 'next-iron-session';

async function handler(req, res) {
  req.session.destroy();
  res.status(200).json({ success: true });
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
