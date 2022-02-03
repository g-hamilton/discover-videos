import {
  findVideoIdByUser,
  insertStats,
  updateStats,
} from "../../lib/db/hasura";
import { verifyToken } from "../../lib/utils";

export default async function stats(req, res) {
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
    Check if stats already exist for this video and this user
    */
    const userId = await verifyToken(token);
    const inputParams = req.method === "POST" ? req.body : req.query;
    const { videoId } = inputParams;

    if (!videoId) {
      return res
        .status(400)
        .send({ message: "Missing video ID in request body" });
    }

    const findVideo = await findVideoIdByUser(token, userId, videoId);
    const isNewVideo = findVideo?.length === 0;

    // POST request type handling
    if (req.method === "POST") {
      const { watched = true, favourited } = req.body;

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
    }

    // GET request type handling
    if (req.method === "GET") {
      if (isNewVideo) {
        // video does not exist for this user so just return
        return res.status(404).send({ message: "Video stats not found" });
      } else {
        // video found, return this video's stats for this user
        return res.send(findVideo);
      }
    }

    // handle any unwanted request type
    res.status(400).send({ message: "Bad request type" });
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
