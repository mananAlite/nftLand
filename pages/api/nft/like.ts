import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import clientPromise from '../../../utils/connect';
import { MONGODB_DB } from '../../../constant/Mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);
  const { body } = req;
  const { userId, nftId } = body;

  try {
    const findNFT = await db.collection('nft-collection').findOne({ _id: new ObjectId(nftId as string) });

    const likes = findNFT?.likes?.map((like: number) => like.toString());

    if (likes.includes(userId as string)) {
      const response = await db
        .collection('nft-collection')
        .updateOne({ _id: new ObjectId(nftId as string) }, { $pull: { likes: new ObjectId(userId as string) } });

      const findNFT = await db.collection('nft-collection').findOne({ _id: new ObjectId(nftId as string) });

      return res.status(201).json({
        message: 'Removed Like',
        data: findNFT?.likes?.length
      });
    } else {
      console.log('In First Else  Statement');
      const response = await db
        .collection('nft-collection')
        .updateOne(
          { _id: new ObjectId(nftId as string) },
          { $push: { likes: new ObjectId(userId as string) } },
          { upsert: true }
        );

      const findNFT = await db.collection('nft-collection').findOne({ _id: new ObjectId(nftId as string) });

      return res.status(201).json({
        message: 'Added Like',
        data: findNFT?.likes?.length
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      err: err?.message
    });
  }
}
