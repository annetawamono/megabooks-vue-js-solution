const { ApolloServer } = require("apollo-server")

const mongoose = require('mongoose')

const fs = require('fs');

const path = require('path');

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
)
    .then(() => console.log("DB connected"))
    .catch(err => console.error(err))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        User,
        Customer
    }
})

// Running server on port 4000
server.listen(4000).then(() => {
    console.log('Server running')
})