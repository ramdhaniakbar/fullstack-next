import db from '../../../../libs/db';
import jwt from 'jsonwebtoken';
import authorization from '../../../../middlewares/authorization';

export default async function handler(req, res) {
   try {
      if (req.method !== 'GET') return res.status(405).end();

      const { id } = req.query;

      const auth = await authorization(req, res);

      const post = await db('posts').where({ id }).first();

      if (!post)
         return res
            .status(404)
            .json({ message: `Data not found with id ${id}` });

      res.status(200).json({
         message: 'Posts data',
         data: post,
      });
   } catch (error) {
      console.log(error);
      res.status(500).end();
   }
}
