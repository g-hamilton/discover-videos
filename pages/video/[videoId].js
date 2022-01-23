import { useRouter } from "next/router";

const Video = () => {
  const router = useRouter();
  const { videoId } = router.query;

  return <div>video page</div>;
};

export default Video;
