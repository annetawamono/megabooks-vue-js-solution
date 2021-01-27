const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createToken = (user, secret, expiresIn) => {
    return jwt.sign({ email: user.email }, secret, { expiresIn })
}

module.exports = {
    Query: {
        User: async (_, args, { User, currentUser }) => {
            if (!currentUser) {
                return null
            }

            const user = await User.findOne({ email: currentUser.email })

            return user
        },
        Customers: async (_, args, { Customer }) => {
            const customers = await Customer.find()
            return customers
        }
    },
    Mutation: {
        addCustomer: async (_, { name, surname, email, phone, bookDescription, bookPrice, purchaseDate, isbn }, { Customer }) => {
            const newCustomer = await new Customer({
                name,
                surname,
                email,
                phone,
                bookDescription,
                bookPrice,
                purchaseDate,
                isbn
            }).save()
            return newCustomer
        },
        updateCustomer: async (_, { _id, name, surname, email, phone, bookDescription, bookPrice, purchaseDate, isbn }, { Customer }) => {
            const cust = await Customer.findOneAndUpdate(
                { _id: _id },
                {
                    $set: {
                        name,
                        surname,
                        email,
                        phone,
                        bookDescription,
                        bookPrice,
                        purchaseDate,
                        isbn
                    }
                },
                { new: true }
            )
            return cust
        },
        signInUser: async (_, { email, password }, { User }) => {

            if (!User) {
                throw new Error("User empty")
            }

            const user = await User.findOne({ email: email });

            if (!user) {
                throw new Error('User not found')
            }

            const isValidPassword = await bcrypt.compare(password, user.password)
            if (!isValidPassword) {
                throw new Error('Invalid password')
            }

            return { token: createToken(user, process.env.SECRET, '1hr') }
        },
        // (parent, args, context, info)
        signUpUser: async (_, { name, surname, email, password }, { User }) => {
            const user = await User.findOne({ email: email });

            if (user) {
                throw new Error('User already exists: ' + user);
            }
            const newUser = await new User({
                name,
                surname,
                email,
                password
            }).save()
            return { token: createToken(newUser, process.env.SECRET, '1hr') }
        }
    }
}
