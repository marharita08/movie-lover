import type { MessageAuthor } from "../const";
import type { ShortMedia } from "./short-media.type";

export type ChatMessageResponse = {
  id: string;
  text: string;
  author: MessageAuthor;
  mediaItems: ShortMedia[] | null;
  createdAt: string;
};
