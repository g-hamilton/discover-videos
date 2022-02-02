import jsonwebtoken from "jsonwebtoken";

import {
  findVideoIdByUser,
  insertStats,
  updateStats,
} from "../../lib/db/hasura";

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

      /*
      Check if stats already exist for this video and this user
      */
      const userId = decodedToken.issuer;
      const { videoId, watched = true, favourited } = req.body;

      if (!videoId) {
        return res
          .status(400)
          .send({ message: "Missing video ID in request body" });
      }

      const isNewVideo = await findVideoIdByUser(token, userId, videoId);

      if (isNewVideo) {
        // add new stats for this video
        const response = await insertStats(token, {
          watched,
          userId,
          videoId,
          favourited,
        });
        return res.send({ data: response });
      } else {
        // update stats for this video
        const response = await updateStats(token, {
          watched,
          userId,
          videoId,
          favourited,
        });
        return res.send({ data: response });
      }
    } catch (error) {
      /*
      Handle any internal server error
      */
      console.error(error);
      return res.status(500).send({
        message: "Something went wrong",
        error: error.message ? error.message : "",
      });
    }
  }

  // handle any unwanted request type
  res.status(400).send({ message: "Bad request type" });
}
