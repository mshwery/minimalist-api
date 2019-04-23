import { addHours } from 'date-fns'
import express from 'express'
import { get } from 'lodash'
import passport from 'passport'
import { Strategy as  GoogleStrategy } from 'passport-google-oauth20'
import config from '../../config'
import { generateJwt, verifyJwt, SESSION_COOKIE } from '../lib/auth'
import { UserModel } from '../models/user'

interface User {
  id: string
}

passport.serializeUser(function(user: User, done: Function) {
  done(null, generateJwt({ sub: user.id }))
})

passport.deserializeUser(function(token: string, done) {
  const user = verifyJwt(token)
  // Turn jwt into a user?
  // TODO: lookup full user in db
  done(null, user)
})

passport.use(new GoogleStrategy(
  {
    clientID: config.get('GOOGLE_CLIENT_ID'),
    clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
    callbackURL: '/connect/google/callback'
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = get(profile, 'emails.0.value')
      const googleId = profile.id
      const user = await UserModel.findOrCreateByEmailAndGoogleId(email, googleId).catch(done)
      done(null, user)
    } catch(error) {
      done(error)
    }
  }
))

const router = express.Router()
router.get('/connect/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/connect/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req: express.Request, res: express.Response) => {
  // TODO move this so we aren't duplicating it for each provider
  const expires = addHours(new Date(), 24)
  const token = generateJwt({ sub: req.user.id })

  // Persist token in an HTTP-only cookie
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: config.get('ENV') === 'production',
    // TODO: set `domain = '.getminimalist.com'`
    expires
  })

  res.redirect('/')
})

export default router
