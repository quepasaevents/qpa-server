import * as express from 'express'
import { httpSSRHandler } from './handler'

const port = 5000
console.log(`Starting SSR on port ${port}...`)
const app = express()
app.get('/*', httpSSRHandler)
app.listen(port)
console.log('Successfully started')
