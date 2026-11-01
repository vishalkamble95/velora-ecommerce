import { useQuery } from "@tanstack/react-query";

import { getCart } from "../../services/cartService";

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
};
