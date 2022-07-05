import type { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from 'mongodb';

import clientPromise from '../../../utils/connect';
import { MONGODB_DB } from '../../../constant/Mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);
  const { method, query, body } = req;
  const { id } = query;

  switch (method) {
    case 'GET':
      try {
        const getUser = await db.collection('User').findOne({ _id: new ObjectId(id as string) });
        return res.status(200).json({
          message: 'User retrieved',
          data: getUser
        });
      } catch (error: any) {
        console.log('error: ', error);
        return res.status(500).json({ error: error.message });
      }
    case 'PUT':
      try {
        const updateUser = await db
          .collection('User')
          .updateOne({ _id: new ObjectId(id as string) }, { $set: { ...body, updatedAt: new Date() } });
        return res.status(200).json({
          message: 'User updated',
          data: updateUser
        });
      } catch (error: any) {
        console.log('error: ', error);
        return res.status(500).json({ error: error.message });
      }
  }
}
