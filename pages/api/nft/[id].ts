import type { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from 'mongodb';

import clientPromise from '../../../utils/connect';
import { MONGODB_DB } from '../../../constant/Mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);
  const { query, method, body } = req;

  switch (method) {
    case 'GET':
      try {
        const findNFT = await db.collection('nft-collection').findOne({ _id: new ObjectId(query.id as string) });
        if (findNFT) {
          return res.status(200).json({
            message: 'NFT retrieved',
            data: findNFT
          });
        } else {
          return res.status(404).json({
            message: 'NFT not found'
          });
        }
      } catch (error: any) {
        console.log('error: ', error);
        return res.status(500).json({ error: error.message });
      }
    case 'PUT':
      try {
        const findNFT = await db.collection('nft-collection').findOne({ _id: new ObjectId(query.id as string) });
        if (findNFT) {
          const updateNFT = await db
            .collection('nft-collection')
            .updateOne(
              { _id: new ObjectId(query.id as string) },
              { $set: { ...body, user_id: new ObjectId(req.body.user_id as string), updated_at: new Date() } }
            );
          // const removeCollectionId = await db
          //   .collection('nft-collection')
          //   .updateOne({ _id: new ObjectId(query.id as string) }, { $unset: { collection_id: '' } });
          return res.status(200).json({
            message: 'NFT updated',
            data: updateNFT
          });
        } else {
          return res.status(404).json({
            message: 'NFT not found'
          });
        }
      } catch (error: any) {
        console.log('error: ', error);
        return res.status(500).json({ error: error.message });
      }
  }
}
