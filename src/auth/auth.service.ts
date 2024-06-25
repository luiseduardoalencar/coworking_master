import * as jose from 'jose';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';


async function openSessionToken(token: string) {
  const secret = new TextEncoder().encode('default_secret');
  const { payload } = await jose.jwtVerify(token, secret);
  return payload;
}

async function createSessionToken(payload = {}, req:any, res:any) {
  const secret = new TextEncoder().encode('default_secret');
  const session = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(secret);

  const { exp } = await openSessionToken(session);
  console.log('Token created:', session);
  console.log('Token created with expiration:', exp);

  setCookie('token', session, {
    req,
    res,
    maxAge: 60 * 60 * 24 * 7, // 7 day
    path: '/',
    httpOnly: true,
  });
 
}
async function isSessionValid(req: any) {
  const token = getCookie('token', { req });
  
  if (token) {
    try {
      const { exp } = await openSessionToken(token);
      const currentDate = new Date().getTime();
    
      return (exp as number) * 1000 > currentDate;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  }

  return false;
}


const AuthService = {
  openSessionToken,
  createSessionToken,
  isSessionValid,
};

export default AuthService;
