// Episode registry. tools/new_episode.py adds entries between the markers.
import * as bu from "./bu/Film";
import * as hm from "./hm/Film";
// <new-imports>

export const EPISODES = [
  { id: "bu", Comp: bu.EpisodeFilm, frames: bu.EPISODE_FRAMES },
  { id: "hm", Comp: hm.EpisodeFilm, frames: hm.EPISODE_FRAMES },
  // <new-entries>
];
