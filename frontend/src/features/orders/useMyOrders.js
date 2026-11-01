import { useQuery } from "@tanstack/react-query";

import { getMyOrders } from "../../services/orderService";

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getMyOrders,
  });
};
