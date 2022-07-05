import type { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from 'mongodb';

import clientPromise from '../../../utils/connect';
import { MONGODB_DB } from '../../../constant/Mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);
  const { method } = req;

  if (method === 'POST') {
    try {
      const findUser = await db.collection('User').findOne({ _id: new ObjectId(req.body.user_id as string) });
      if (findUser) {
        const findNFTs = await db
          .collection('nft-collection')
          .find({ user_id: new ObjectId(req.body.user_id as string) })
          .toArray();
        return res.status(200).json({
          message: 'NFTS Retrieved',
          data: findNFTs
        });
      } else {
        return res.status(404).json({
          message: 'User Not Found'
        });
      }
    } catch (err: any) {
      console.log('🚀 ~ file: usernft.ts ~ line 16 ~ handler ~ err', err);
      res.status(500).json({ err: err.message });
    }
  }
}
