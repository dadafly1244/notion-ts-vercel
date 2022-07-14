import {VercelRequest, VercelResponse} from '@vercel/node'


export default async function (req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    name : 'Heropy!'
  })
}
