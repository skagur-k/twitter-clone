// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CommentBody, TweetBody } from '../../typings'

type Data = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const data: CommentBody = JSON.parse(req.body)

    const mutations = {
        mutations: [
            {
                create: {
                    _type: 'comment',
                    comment: data.comment,
                    username: data.username,
                    tweetId: data.tweetId,
                    profileImage: data.profileImage,
                    tweet: {
                        _type: 'reference',
                        _ref: data.tweetId
                    }
                },
            },
        ],
    }
    const endpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`

    const result = await fetch(endpoint, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
        },
        body: JSON.stringify(mutations),
        method: 'POST',
    })
    const json = await result.json()

    res.status(200).json({ message: 'Added comment' })
}
