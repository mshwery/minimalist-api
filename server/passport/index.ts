import { addHours, addMinutes } from 'date-fns'
import express, { Request, Response, NextFunction } from 'express'
import { get } from 'lodash'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import config from '../../config'
import { generateJwt, verifyJwt, SESSION_COOKIE } from '../lib/auth'
import { UserModel } from '../models/user'

passport.serializeUser((user: Express.User, done) => {
  done(null, generateJwt({ sub: user.id }))
})

passport.deserializeUser((token: string, done) => {
  const user = verifyJwt(token)
  // Turn jwt into a user?
  // TODO: lookup full user in db
  done(null, user)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: '/connect/google/callback'
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = get(profile, 'emails[0].value')
        const googleId = profile.id
        const image = get(profile, 'photos[0].value')
        const name = profile.displayName
        const user = await UserModel.findOrCreateGoogleConnectedUser(email, googleId, image, name)
        done(null, user)
      } catch (error) {
        done(error)
      }
    }
  )
)

function getDynamicCallbackURL(redirect?: string) {
  if (redirect) {
    return `/connect/google/callback?redirect=${redirect}`
  }
  return `/connect/google/callback`
}

const router = express.Router()
router.get('/connect/google', (req: Request, res: Response, next: NextFunction) => {
  res.cookie('redirectTo', req.query.redirect, {
    httpOnly: true,
    secure: config.get('ENV') === 'production',
    expires: addMinutes(new Date(), 10)
  })

  // @ts-ignore
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
    callbackURL: getDynamicCallbackURL('') // req.query.redirect)
  })(req, res, next)
})

router.get(
  '/connect/google/callback',
  (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect ? decodeURIComponent(req.query.redirect) : '/'
    // @ts-ignore
    passport.authenticate('google', {
      failureRedirect: redirect,
      callbackURL: getDynamicCallbackURL('') // req.query.redirect)
    })(req, res, next)
  },
  (req: express.Request, res: express.Response) => {
    // TODO move this so we aren't duplicating it for each provider
    const expires = addHours(new Date(), 24)
    const token = generateJwt({ sub: req.user!.id })

    // Persist token in an HTTP-only cookie
    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: config.get('ENV') === 'production',
      // TODO: set `domain = '.getminimalist.com'`
      expires
    })

    let redirect = '/'
    if (req.query.redirect) {
      redirect = decodeURIComponent(req.query.redirect) + `?token=${token}`
    } else if (req.cookies.redirectTo) {
      redirect = req.cookies.redirectTo + `?token=${token}`
    }

    res.redirect(redirect)
  }
)

export default router
