import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createOrder } from "../../services/orderService";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData) => createOrder(orderData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};
