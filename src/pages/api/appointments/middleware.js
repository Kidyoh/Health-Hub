import { ironSession } from 'next-iron-session';

export const withSession = (handler) => {
    return ironSession(handler, {
        cookieName: 'my_session_cookie',
        password: process.env.SECRET_COOKIE_PASSWORD,
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production' ? true : false,
        },
    });
};
