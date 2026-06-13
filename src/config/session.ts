if (!process.env.SESSION_SECRET) {
  throw new Error('Missing required environment variable SESSION_SECRET')
}

const sessionConfig = {
    secret: process.env.SESSION_SECRET
}

export default sessionConfig