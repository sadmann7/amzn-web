import type { Product } from "@/types/globals";
import Link from "next/link";
import React from "react";

type ProductListProps = {
  products: Product[];
  status: "error" | "success";
};

const ProductList = ({ products, status }: ProductListProps) => {
  return (
    <section aria-label="product list">
      {status === "error" ? (
        <div className="text-center text-base text-title md:text-lg">
          Error in fetching products
        </div>
      ) : (
        <div className="text-center text-base text-title md:text-lg">
          {products.map((product) => (
            <div key={product.id}>
              <Link href={`/app/products/${product.id}`}>{product.title}</Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
