import { useQuery } from "@tanstack/react-query";

import { getOrderById } from "../../services/orderService";

export const useOrder = (id) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(id),
  });
};
