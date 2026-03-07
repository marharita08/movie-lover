import { MutationKey } from "@/const";
import { useAppMutation } from "@/hooks";
import { chatService } from "@/services";

export const useClearChat = () => {
  return useAppMutation([MutationKey.CLEAR_CHAT], {
    mutationFn: chatService.clear,
  });
};
