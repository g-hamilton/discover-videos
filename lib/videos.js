import videoData from "../data/videos.json";

export const getVideos = () => {
  return videoData.items.map((item) => {
    return {
      id: item?.id?.videoId,
      title: item.snippet.title,
      imgUrl: item.snippet.thumbnails.high.url,
    };
  });
};
