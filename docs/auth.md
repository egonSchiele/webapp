# Authentication

## Setting up Firebase Authentication
If you want to do authentication with Firebase (which I highly recommend, it's very simple), you'll need to do the following things.

1. Go to the [Firebase console](https://console.firebase.google.com) and create a new project.
2. Add auth to your project (left sidebar).
3. Create a new app in your project: Go to Project Settings (click the gear icon next to your project name), and scroll to the bottom of the page.
4. Now, under "General", you'll find your Firebase config. The Firebase config contains public information and can be used in the frontend. Add this config to `src/frontend/lib/firebase.ts`.
4. Next, generate a new service account key. Go to the "Service accounts" tab and click `Generate new private key`. This key is *private* and must *never* be shown to users or checked into a git repo! This will generate a json file. Download this file.
5. Google will give you these credentials as a JSON file, but I actually prefer to inject secrets as environment variables into my Docker container at runtime. This is more secure than packaging them into your image, and easier than copying the file into the container at runtime. You'll need to set the following variables in your .env or .env.local file:

```
FIREBASE_TYPE
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
FIREBASE_CLIENT_ID
FIREBASE_AUTH_URI
FIREBASE_TOKEN_URI
FIREBASE_AUTH_PROVIDER_X509_CERT_URL
FIREBASE_CLIENT_X509_CERT_URL
FIREBASE_UNIVERSE_DOMAIN
```

All of these variables will come from the corresponding keys in the JSON object. The private key (`FIREBASE_PRIVATE_KEY`) you'll need to base64 encode first. You can do this by opening up a console and executing these commands:

```javascript
str = "the private key string from the json file"
str2 = btoa(str)
console.log(str2)
```

**That's it!** Now visit `http://localhost:3000/signup` to sign up as a new user. Then you can visit `https://console.firebase.google.com/project/<your-app-name>/authentication/users` to see your list of users.

## How sign up and auth works

When using Firebase, both signing up and signing in are frontend operations. When the user signs up, you call the `createUserWithEmailAndPassword` Firebase function on the frontend. Assuming that works, from this point on, there's two things you care about: Users and Tokens.

### Users

If signup is successful, you get back a User object. This is simply the Firebase user and tells you what Firebase knows about this user. It looks like this:

```json
{
  iss: "https://securetoken.google.com/your-app-name",
  aud: "your-app-name",
  auth_time: "<timestamp>",
  user_id: "<some user id>",
  sub: "<some user id>",
  iat: "<timestamp>",
  exp: "<timestamp>",
  email: "foo@bar.com",
  email_verified: false,
  firebase: { identities: [Object], sign_in_provider: "password" },
  uid: "<some user id>"
}
```

You obviously want to know who the logged-in user is. For example, if you're Google Docs, you need to know the logged-in user to see if they have access to certain docs. You may have a users table on your end. Using the email address in this user object, you can look up this user in your database and see if they have access to a given doc.

### Tokens

When the user logs in, you'll want to set a cookie so you know who the logged in user is. But obviously you don't want to set the email as the user identifier in the cookie, because if you do, someone could just edit the cookie, set the email to someone else's email, and now they're logged in as that user!

This is where tokens come in. What you do is get a token from Firebase. You can get the token by calling `getIdToken()` on the User object you got back when the user logged in. This token is a signed JWT that Firebase creates. This token does a few things for you:
1. Firebase can confirm whether this token is valid or not (i.e. does it really belong to a user? And is that user logged in?)
2. You can use the token to get the identity of the user who is logged in. You just take the token, send it to Firebase, Firebase will validate the token, and if it is valid, send you back the user that it belongs to.

On the frontend, after the user logs in, get the token and set it as a cookie. From this point on, every time the user makes a request to your backend, the cookie will be sent along with the request. On the backend, you can read the token from the cookie, send it to Firebase to validate it, and if it's valid, get back the user that it belongs to. The `getUser` function in `src/backend/lib/middleware/auth.ts` does exactly this.

To summarize:

## How to sign up or log in a user
See `src/frontend/pages/SignIn.tsx` and `src/frontend/pages/SignUp.tsx` for examples.

## How to get the logged in user on the backend
Use the `getUser` function in `src/backend/lib/middleware/auth.ts`. This function reads the token from the cookie, sends it to Firebase to validate it, and if it's valid, returns the user that it belongs to.
