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
        const findCollection = await db
          .collection('collections')
          .find({ _id: new ObjectId(query.id as string) })
          .toArray();
        const findNFTByCollection = await db
          .collection('nft-collection')
          .find({ collection_id: new ObjectId(query.id as string) })
          .toArray();
        if (findCollection) {
          return res.status(200).json({
            message: 'Collection retrieved',
            data: findCollection,
            nfts: findNFTByCollection
          });
        } else {
          return res.status(404).json({
            message: 'Collection not found'
          });
        }
      } catch (error: any) {
        console.log('error: ', error);
        return res.status(500).json({ error: error.message });
      }
    case 'PUT':
      try {
        const findCollection = await db.collection('collections').findOne({ _id: new ObjectId(query.id as string) });
        if (findCollection) {
          const updateCollection = await db
            .collection('collections')
            .updateOne({ _id: new ObjectId(query.id as string) }, { $set: { ...body } });
          return res.status(200).json({
            message: 'Collection updated',
            data: updateCollection
          });
        } else {
          return res.status(404).json({
            message: 'Collection not found'
          });
        }
      } catch (error: any) {
        console.log('error: ', error);
        return res.status(500).json({ error: error.message });
      }
  }
}
