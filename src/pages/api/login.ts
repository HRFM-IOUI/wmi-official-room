import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { admin } from '@/lib/firebaseAdmin';  // 初期化済みのAdmin SDK
import { serialize } from 'cookie';

// 日本語コメント：FirebaseのIDトークンを受け取り、安全なセッションCookieを設定するAPI

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'ID token is required' });
  }

  try {
    // IDトークンを検証し、セッションCookieを生成（有効期限は5日間）
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await getAuth(admin.app()).createSessionCookie(idToken, { // admin.app()を渡す
      expiresIn,
    });

    // セキュアなhttpOnly Cookieをレスポンスに設定
    const cookie = serialize('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: expiresIn / 1000,
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ message: 'Login success' });
  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    return res.status(401).json({ message: 'Invalid ID token' });
  }
}
