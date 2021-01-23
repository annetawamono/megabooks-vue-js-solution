module.exports = {
    Query: {
        User: () => null,
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
        // (parent, args, context, info)
        signUpUser: async (_, { name, surname, email, password }, { User }) => {
            const user = await User.findOne({ email: email });

            if (user) {
                throw new Error('User already exists');
            }
            const newUser = await new User({
                name,
                surname,
                email,
                password
            }).save()
            return newUser
        }
    }
}
