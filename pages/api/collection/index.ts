import type { NextApiRequest, NextApiResponse } from 'next';

import clientPromise from '../../../utils/connect';
import { MONGODB_DB } from '../../../constant/Mongo';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);
  const { method } = request;

  switch (method) {
    case 'GET':
      try {
        const getCollections = await db.collection('collections').find().toArray();
        return response.status(200).json({
          message: 'Collections retrieved',
          data: getCollections
        });
      } catch (error: any) {
        console.log('error: ', error);
        return response.status(500).json({ error: error.message });
      }
    case 'POST':
      try {
        const findUser = await db
          .collection('User')
          .findOne({ wallet_address: request.body.owner_address.toLowerCase() });
        if (findUser) {
          const createCollection = await db.collection('collections').insertOne({
            ...request.body,
            user_id: findUser._id,
            created_at: new Date(),
            updated_at: new Date()
          });
          return response.status(200).json({
            message: 'Collection created',
            data: createCollection
          });
        } else {
          return response.status(404).json({
            message: 'User not found'
          });
        }
      } catch (error: any) {
        console.log('error: ', error);
        return response.status(500).json({ error: error.message });
      }
  }
}
