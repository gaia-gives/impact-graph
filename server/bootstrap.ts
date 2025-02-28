import config from '../config'
import { ApolloServer } from 'apollo-server-express'
import * as jwt from 'jsonwebtoken'
import { json } from 'express'
import createSchema from './createSchema'
import { graphqlUploadExpress } from 'graphql-upload'
import cookieParser from "cookie-parser"
import cors from "cors"

// tslint:disable:no-var-requires
const express = require('express')

// register 3rd party IOC container

export async function bootstrap () {
  try {
    const schema = await createSchema()

    // Create GraphQL server
    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }: any) => {
        let token;
        try {
          if (!req) {
            return null
          }

          token = (req.signedCookies || {}).token
          if (token) {
            const secret = config.get('JWT_SECRET')

            const decodedJwt: any = jwt.verify(token, secret)

            let user
            if (decodedJwt.nextAuth) {
              user = {
                email: decodedJwt?.nextauth?.user?.email,
                name: decodedJwt?.nextauth?.user?.name,
                token
              }
            } else {
              user = {
                email: decodedJwt?.email,
                name: decodedJwt?.firstName,
                userId: decodedJwt?.userId,
                token
              }
            }

            req.user = user
          }

          const userWalletAddress = req.headers['wallet-address']
          if (userWalletAddress) {
            req.userwalletAddress = userWalletAddress
          }
        } catch (error) {
          // console.error(
          //   `Apollo Server error : ${JSON.stringify(error, null, 2)}`
          // )
          // Logger.captureMessage(
          //   `Error with with token, check pm2 logs and search for - Error for token - to get the token`
          // )
          // console.error(`Error for token - ${token}`)
          req.auth = {}
          req.auth.token = token
          req.auth.error = error
          //console.log(`ctx.req.auth : ${JSON.stringify(ctx.req.auth, null, 2)}`)
        }

        return {
          req,
          res
        }
      },
      introspection: true
    })

    // Express Server
    const app = express()

    app.use(cookieParser(config.get("COOKIE_SECRET")));
    
    app.use(cors({
      credentials: true,
      origin: [
          "http://localhost:3000",
          "https://studio.apollographql.com"
      ]
    }))
    app.use(
      json({ limit: config.get('UPLOAD_FILE_MAX_SIZE') || 4000000 })
    )
    app.use(
      graphqlUploadExpress({
        maxFileSize: config.get('UPLOAD_FILE_MAX_SIZE') || 2000000,
        maxFiles: 10
      })
    )

    await apolloServer.start()
    apolloServer.applyMiddleware({ app, cors: false })
    app.listen({ port: 4000 })

    console.log(
      `🚀 Server is running, GraphQL Playground available at http://127.0.0.1:${4000}/graphql`
    )
  } catch (err) {
    console.error(err)
  }
}
