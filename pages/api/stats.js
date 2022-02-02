import jsonwebtoken from "jsonwebtoken";

export default async function stats(req, res) {
  // POST request type handling
  if (req.method === "POST") {
    try {
      /*
      Check request for user (JWT authorization) token.
      Immediately reject any request with no token.
      */
      const token = req.cookies.token;
      if (!token) {
        return res.status(403).send({ message: "Authentication required" });
      }

      /*
      Verify the token
      https://github.com/auth0/node-jsonwebtoken
      Will throw an error if the token is invalid for any reason
      */
      const decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET);

      return res.send({ message: "it works!" });
    } catch (error) {
      /*
      Handle any internal server error
      */
      console.error(error);
      res.status(500).send({ message: "Something went wrong", error });
    }
  }

  // handle any unwanted request type
  res.status(400).send({ message: "Bad request type" });
}
