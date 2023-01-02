export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export type Category =
  | "electronics"
  | "jewelery"
  | "men's clothing"
  | "women's clothing";
