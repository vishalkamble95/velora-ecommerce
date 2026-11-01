import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartItem } from "../../services/cartService";

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      updateCartItem(productId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};
