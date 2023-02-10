import db from '../../../libs/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
   try {
      if (req.method !== 'POST') return res.status(405).end();

      const { email, password } = req.body;

      const checkUser = await db('users').where({ email }).first();

      if (checkUser)
         return res.status(409).json({ message: 'User already exists' });

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      const register = await db('users').insert({
         email,
         password: passwordHash,
      });

      const [id] = register;

      const registeredUser = await db('users').where({ id }).first();

      res.status(200).json({
         message: 'User registered successfully',
         data: registeredUser,
      });
   } catch (error) {
      console.log(error);
      res.status(500).end();
   }
}
