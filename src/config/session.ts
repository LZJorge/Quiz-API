const sessionConfig = {
    secret: process.env.SESSION_SECRET!,
    resave: true,
    saveUninitialized: true
}

export default sessionConfig