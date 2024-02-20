import http from 'http'
import fs from 'fs'
import url from 'url'

export function makeServer(routes) {
    const server = http.createServer(async (req, res) => {
        const parsedUrl = url.parse(req.url, true)

        for (const route of routes) {
            if (req.method === 'POST' && parsedUrl.pathname === route.path) {
                try {
                    let body = ''

                    req.on('data', (chunk) => {
                        body += chunk.toString()
                    })

                    req.on('end', async () => {
                        const jsonData = JSON.parse(body)

                        const x = await route.fn(jsonData)

                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin':
                                'http://localhost:3000'
                        })
                        res.end(JSON.stringify(x))
                        //
                    })
                } catch (error) {
                    console.error('Error parsing JSON:', error)

                    // Send a JSON error response
                    const errorResponse = {
                        status: 'error',
                        message: error.message
                    }
                    res.writeHead(400, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify(errorResponse))
                }
            }
        }
    })

    const PORT = 3001
    server.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}/`)
    })
}
