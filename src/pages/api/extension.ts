import { type NextApiRequest, type NextApiResponse } from 'next'
import path from 'path'
import fileStream from 'fs'

const handler = (req: NextApiRequest, res: NextApiResponse) => {

    if(req.method === 'GET') {
        const filePath = path.join(process.cwd(), 'public', 'ext.xpi')
        const stat = fileStream.statSync(filePath);
        res.writeHead(200, {
            'Content-Type': 'application/x-xpinstall',
            'Content-Length': stat.size
        });
        const readStream = fileStream.createReadStream(filePath);
        readStream.pipe(res);
    }
}
export default handler