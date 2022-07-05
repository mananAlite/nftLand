import type { NextApiRequest, NextApiResponse } from 'next';

import clientPromise from '../../../utils/connect';
import { MONGODB_DB } from '../../../constant/Mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);
  const { method, body } = req;
  const { wallet_address } = body;

  switch (method) {
    case 'POST':
      try {
        const findUser = await db.collection('User').findOne({ wallet_address });
        if (findUser !== null) {
          return res.status(400).json({
            message: 'User already exists',
            data: findUser
          });
        } else {
          let addNewUser = await db.collection('User').insertOne({
            wallet_address,
            created_at: new Date(),
            updated_at: new Date()
          });
          return res.status(201).json({
            message: 'User created',
            data: addNewUser
          });
        }
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    case 'GET':
      try {
        const getUsers = await db.collection('User').find().toArray();
        return res.status(200).json({
          message: 'Users retrieved',
          data: getUsers
        });
      } catch (error: any) {
        console.log('error: ', error);
        return res.status(500).json({ error: error.message });
      }
  }
}
