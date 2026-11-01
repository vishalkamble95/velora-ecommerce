import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeCartItem } from "../../services/cartService";

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => removeCartItem(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};
