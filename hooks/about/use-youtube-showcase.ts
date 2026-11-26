"use client";

import * as React from "react";
import { YOUTUBE_SHOWCASE_VIDEOS } from "@/config/store";

export function useYoutubeShowcase() {
  const [activeVideoId, setActiveVideoId] = React.useState<string>(
    YOUTUBE_SHOWCASE_VIDEOS[0].id
  );

  const activeVideo = React.useMemo(
    () =>
      YOUTUBE_SHOWCASE_VIDEOS.find((v) => v.id === activeVideoId) ??
      YOUTUBE_SHOWCASE_VIDEOS[0],
    [activeVideoId]
  );

  return {
    videos: YOUTUBE_SHOWCASE_VIDEOS,
    activeVideo,
    selectVideo: setActiveVideoId,
  };
}
