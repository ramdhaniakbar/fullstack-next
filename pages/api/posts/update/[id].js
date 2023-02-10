import db from '../../../../libs/db';
import authorization from '../../../../middlewares/authorization';

export default async function handler(req, res) {
   try {
      if (req.method !== 'PUT') return res.status(405).end();

      const auth = await authorization(req, res);

      const { id } = req.query;
      const { title, content } = req.body;

      const update = await db('posts').where({ id }).update({ title, content });

      const updatedData = await db('posts').where({ id }).first();

      res.status(200).json({
         message: 'Post updated successfully',
         data: updatedData,
      });
   } catch (error) {
      console.log(error);
      res.status(500).end();
   }
}
