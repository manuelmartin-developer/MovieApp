
const home = {
    home: async (req, res) => {
        await res.status(200).render('home')
    },
    signup: async (req, res) => {
        await res.status(200).render('signup')
    }
}

module.exports = home;