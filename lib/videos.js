import videoData from "../data/videos.json"; // mock data

export const getVideos = async () => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  const response = await fetch(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=disney%20trailer&key=${YOUTUBE_API_KEY}`
  );

  const data = await response.json();

  return data?.items.map((item) => {
    return {
      id: item?.id?.videoId,
      title: item.snippet.title,
      imgUrl: item.snippet.thumbnails.high.url,
    };
  });
};
