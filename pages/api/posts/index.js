import db from '../../../libs/db';
import jwt from 'jsonwebtoken';
import authorization from '../../../middlewares/authorization';

export default async function handler(req, res) {
   try {
      if (req.method !== 'GET') return res.status(405).end();

      const auth = await authorization(req, res);

      const posts = await db('posts');

      res.status(200).json({
         message: 'Posts data',
         data: posts,
      });
   } catch (error) {
      console.log(error);
      res.status(500).end();
   }
}
