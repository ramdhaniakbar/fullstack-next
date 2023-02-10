import db from '../../../libs/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
   try {
      if (req.method !== 'POST') return res.status(405).end();

      const { email, password } = req.body;

      const checkUser = await db('users').where({ email }).first();

      if (!checkUser) return res.status(401).end();

      const checkPassword = await bcrypt.compareSync(
         password,
         checkUser.password
      );

      if (!checkPassword) return res.status(401).end();

      const token = jwt.sign(
         { id: checkUser.id, email: checkUser.email },
         process.env.JWT_SECRET,
         { expiresIn: '3d' }
      );

      res.status(200).json({
         message: 'Login successfully',
         token,
      });
   } catch (error) {
      console.log(error);
      res.status(500).end();
   }
}
