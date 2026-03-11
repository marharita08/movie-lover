import { useQueryClient } from "@tanstack/react-query";

import { MutationKey, QueryKey } from "@/const";
import { useAppMutation } from "@/hooks";
import { chatService } from "@/services";

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useAppMutation([MutationKey.SEND_MESSAGE], {
    mutationFn: chatService.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.CHAT_HISTORY],
      });
    },
  });
};
