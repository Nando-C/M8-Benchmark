// import passport from 'passport'
// import FacebookStrategy from 'passport-facebook'

// const facebookStrategy = new FacebookStrategy(
//     {
//         clientID: process.env.FACEBOOK_CLIENT_ID,
//         clientSecret: process.env.FACEBOOK_SECRET,
//         callbackURL: "http://localhost:3001/users/facebookRedirect"
//     },

//     async ( accessToken, refreshToken, profile, passportNext ) => {
//         try {
//             console.log(profile)

//         } catch (error) {
//             console.log(error)
//             passportNext(error)
//         }
//     }
// )

// passport.serializeUser(function ( user, passportNext) {
//     passportNext(null, user)
// })

// export default facebookStrategy