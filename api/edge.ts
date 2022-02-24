import { VercelRequest, VercelResponse } from '@vercel/node';
import { convert, FORMAT_CONTENT_TYPE } from '../ra';


module.exports = async (request: VercelRequest, response: VercelResponse) => {
    
    if (request.method.toString() === 'OPTIONS'){
        let req_header = request.headers['access-control-request-headers']
        response.status(200).setHeader('access-control-allow-headers',req_header)
        .setHeader('access-control-allow-origin','*')
        .setHeader('access-control-allow-methods','POST').send('');
    }
    if (request.method.toString() === 'POST'){
        try {
            let r = request.body
            let format = r['ttsAudioFormat'].toString()
            let ssml = r['ssml'].toString()
            ssml ='<speak' + ssml.split('<speak')[1]
            if (ssml == null) {
                throw `Invalid ssml: ${ssml}`;
            }
            let result = await convert(ssml, format);
            response.sendDate = true;
            response.status(200)
                .setHeader('Content-Type', 'raw-24khz-16bit-mono-pcm')
                .send(result);
        } catch (error) {
            console.error(error);
            response.status(503)
                .json(error);
        }
            
        
    }
    
}