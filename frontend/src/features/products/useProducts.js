import { useQuery } from "@tanstack/react-query";

import {
  getProducts,
  getProductById,
  getProductCategories,
} from "../../services/productService";

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
};

export const useProductCategories = () => {
  return useQuery({
    queryKey: ["productCategories"],
    queryFn: getProductCategories,
  });
};