import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { generatePath, useNavigate } from "react-router-dom";

import { ListStatus, QueryKey, RouterKey } from "@/const";
import { toast } from "@/hooks/use-toast/useToast";
import { listService } from "@/services";

export const useListPolling = (
  listId: string | null,
  setProcessingListId: (id: string | null) => void,
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QueryKey.LISTS, listId],
    queryFn: () => listService.getById(listId!),
    enabled: !!listId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === ListStatus.PROCESSING) return 3000;
      return false;
    },
  });

  useEffect(() => {
    if (query.data?.status === ListStatus.COMPLETED) {
      setProcessingListId(null);
      navigate(generatePath(RouterKey.LIST, { id: listId }));
      queryClient.refetchQueries({
        queryKey: [QueryKey.LISTS],
      });
    }
    if (query.data?.status === ListStatus.FAILED) {
      setProcessingListId(null);
      toast({
        title: "Error",
        description: query.data?.errorMessage,
        variant: "destructive",
      });
      queryClient.refetchQueries({
        queryKey: [QueryKey.LISTS],
      });
      navigate(RouterKey.LISTS);
    }
  }, [
    query.data?.status,
    listId,
    navigate,
    query.data?.errorMessage,
    setProcessingListId,
    queryClient,
  ]);

  const isProcessing = query.data?.status === ListStatus.PROCESSING;

  return { isProcessing };
};
