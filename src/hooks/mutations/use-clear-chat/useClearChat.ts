import { useQueryClient } from "@tanstack/react-query";

import { MutationKey, QueryKey } from "@/const";
import { useAppMutation } from "@/hooks";
import { chatService } from "@/services";

export const useClearChat = () => {
  const queryClient = useQueryClient();

  return useAppMutation([MutationKey.CLEAR_CHAT], {
    mutationFn: chatService.clear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.CHAT_HISTORY] });
    },
  });
};
