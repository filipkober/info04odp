import { type NextApiRequest, type NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import NextCors from 'nextjs-cors'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    
    await NextCors(req, res, {
        methods: ['GET'],
        origin: '*',
        optionsSuccessStatus: 200,
    })

    if(req.method === 'GET') {
        const prisma = new PrismaClient()
        const pytania = await prisma.pytania.findMany();
        prisma.$disconnect().catch((e) => console.error(e))
        res.status(200).json(pytania.sort(() => Math.random() - 0.5))
    }
}
export default handler