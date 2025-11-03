// passController.js (instrumentation)
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config/db.config');
const util = require('util');

console.log('ENV CHECK: GOOGLE_CLIENT_ID?', !!process.env.GOOGLE_CLIENT_ID);
console.log('ENV CHECK: GOOGLE_CLIENT_SECRET?', !!process.env.GOOGLE_CLIENT_SECRET);
console.log('ENV CHECK: FRONTEND_URL?', !!process.env.FRONTEND_URL);
console.log('ENV CHECK: GOOGLE_CALLBACK_URL?', !!process.env.GOOGLE_CALLBACK_URL);

const callbackURL = process.env.GOOGLE_CALLBACK_URL || `${process.env.FRONTEND_URL}/auth/google/callback`;
console.log('Using Google callbackURL:', callbackURL);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('GoogleStrategy invoked. profile:', {
          id: profile?.id,
          displayName: profile?.displayName,
          emails: profile?.emails && profile.emails.map(e => e.value)
        });

        // Example DB logic with pg pool (adapt to your code)
        // Use exact table name — we'll log what you query.
        const email = profile?.emails?.[0]?.value;
        if (!email) {
          console.warn('No email in Google profile; aborting');
          return done(null, false, { message: 'No email from Google' });
        }

        // Replace this with your actual pool/query function
        const queryText = 'SELECT * FROM "User" WHERE email = $1 LIMIT 1';
        console.log('DB: running query:', queryText, 'params:', [email]);
        const { rows } = await db.query(queryText, [email]); // ensure pool is required/imported

        let user;
        if (rows.length) {
          user = rows[0];
          console.log('DB: found existing user id=', user.id);
        } else {
          // create user (log the insert)
          const insertText = 'INSERT INTO "User"(email, given_name, profile_picture) VALUES($1,$2,$3) RETURNING *';
          console.log('DB: creating user with', [email, profile.displayName, profile.photos?.[0]?.value || null]);
          const insertRes = await db.query(insertText, [email, profile.displayName, profile.photos?.[0]?.value || null]);
          user = insertRes.rows[0];
          console.log('DB: created user id=', user.id);
        }

        return done(null, user);

      } catch (err) {
        console.error('ERROR in GoogleStrategy callback:', util.inspect(err, { depth: 4 }));
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM "Users" WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    console.error('Error deserializing user:', err);
    done(err, null);
  }
});

module.exports = passport;
