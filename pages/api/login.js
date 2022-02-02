import { magicAdmin } from "../../lib/magic-server";
import jwt from "jsonwebtoken"; // https://github.com/auth0/node-jsonwebtoken
import { isNewUser, createNewUser } from "../../lib/db/hasura";
import { setTokenCookie } from "../../lib/cookies";

export default async function login(req, res) {
  // req type must be POST
  if (req.method !== "POST") {
    return res.status(400).send({ message: "Bad request type" });
  }

  // req must contain a bearer token as an authorization header
  if (!req.headers || !req.headers.authorization) {
    return res
      .status(400)
      .send({ message: "Bad request: Invalid or missing authorization" });
  }

  // get the token segment from the auth bearer string
  const auth = req.headers.authorization;
  const didToken = auth.substr(7);

  try {
    /*
    call magic admin sdk, passing the user's DID token from the client
    side (once the user is logged in with magic) to retrieve the user's
    metadata here on the server side
    */
    const metadata = await magicAdmin.users.getMetadataByToken(didToken);

    /*
    create a JSON Web Token which includes the required user claims for Hasura.
    note the secure user id required by Hasura is the user's "issuer" which
    comes from their decoded Magic DID token..
    */
    const jwtoken = jwt.sign(
      {
        ...metadata,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60), // expire in 7 days
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user", "admin"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": `${metadata.issuer}`,
        },
      },
      process.env.JWT_SECRET // the decode secret is stored in Hasura env config
    );

    /*
    check if the Magic authorised user already exists in the db..
    - if this user is new, create the user in the db & store the jwt as a cookie
    - if the user is returning, store the jwt as a cookie
    this cookie will allow the user to make authenticated db requests for the
    duration the cookie remains valid (7 days to match the 7 day JWT validity)
    */
    const isNewUserQuery = await isNewUser(jwtoken, metadata.issuer);
    isNewUserQuery && (await createNewUser(jwtoken, metadata));
    setTokenCookie(jwtoken, res);
    res.send({ done: true });
  } catch (err) {
    console.error("Something went wrong logging in:", err);
    res.status(500).send({ done: false });
  }
}
