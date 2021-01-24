const { ApolloServer, AuthenticationError } = require("apollo-server")
const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken')

// Importing typeDefs and resolvers
const filePath = path.join(__dirname, 'typeDefs.gql')
const typeDefs = fs.readFileSync(filePath, 'utf-8')
const resolvers = require('./resolvers')

// Importing env variables
require('dotenv').config({ path: '.env' })

// Importing models
const User = require('./models/User')
const Customer = require('./models/Customer')

mongoose.set('useCreateIndex', true);

// Connecting to MongoDB Atlas
mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("DB connected"))
    .catch(err => console.error(err))


//  Verify JWT token passed from client
const getUser = async token => {
    if (token) {
        try {
            return await jwt.verify(token, process.env.SECRET);
        } catch (err) {
            throw new AuthenticationError('Your session has ended. Please sign in again')
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const token = req.headers["authorization"];

        return { User, Customer, currentUser: await getUser(token) }
    }
})

// Running server on port 4000
server.listen(4000).then(() => {
    console.log('Server running')
})