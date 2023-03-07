import { type NextApiRequest, type NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method === 'GET') {
        const prisma = new PrismaClient()
        const pytania = await prisma.pytania.findMany();
        prisma.$disconnect().catch((e) => console.error(e))
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).json(pytania.sort(() => Math.random() - 0.5))
    }
}
export default handler