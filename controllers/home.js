
const home = {
    home: async (req, res) => {
        await res.status(200).render('home')
    },
    signup: async (req, res) => {
        await res.status(200).render('signup')
    },
    login: async (req, res) => {
        res.status(200).send('login')
    },
    logout: async (req, res) => {
        res.status(200).send('logout')
    },
}

module.exports = home;