import type { NextApiRequest, NextApiResponse } from 'next';

import clientPromise from '../../../utils/connect';
import { MONGODB_DB } from '../../../constant/Mongo';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);
  const { method } = request;
  try {
    if (method === 'POST') {
      const findUser = await db
        .collection('User')
        .findOne({ wallet_address: request.body.owner_address.toLowerCase() });
      if (findUser) {
        const findCollections = await db
          .collection('collections')
          .find({ owner_address: request.body.owner_address.toLowerCase() })
          .toArray();

        return response.status(200).json({
          message: 'Collections retrieved',
          data: findCollections
        });
      } else {
        return response.status(404).json({
          message: 'User not found'
        });
      }
    }
  } catch (error: any) {
    console.log('🚀 ~ file: usercollections.ts ~ line 18 ~ handler ~ error', error);
    response.status(500).json({ error: error.message });
  }
}
