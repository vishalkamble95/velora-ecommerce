import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addToCart } from "../../services/cartService";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};
