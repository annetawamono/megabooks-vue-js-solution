const { ApolloServer } = require("apollo-server")

const mongoose = require('mongoose')

const fs = require('fs');

const path = require('path');

const filePath = path.join(__dirname, 'typeDefs.gql')
const typeDefs = fs.readFileSync(filePath, 'utf-8')
const resolvers = require('./resolvers')

require('dotenv').config({ path: '.env' })

const User = require('./models/User')
const Customer = require('./models/Customer')

mongoose.set('useCreateIndex', true);

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

server.listen(4000).then(() => {
    console.log('Server running')
})