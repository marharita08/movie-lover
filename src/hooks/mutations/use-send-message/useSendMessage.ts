import { MutationKey } from "@/const";
import { useAppMutation } from "@/hooks";
import { chatService } from "@/services";

export const useSendMessage = () => {
  return useAppMutation([MutationKey.SEND_MESSAGE], {
    mutationFn: chatService.sendMessage,
  });
};
