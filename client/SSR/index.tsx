import * as React from 'react'
import * as express from 'express'
import { httpSSRHandler } from './handler'

const app = express()
app.get('/*', httpSSRHandler)
app.listen(5000)
console.log('alrigh')
