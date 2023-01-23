import type { Order, OrderItem, Product } from "@prisma/client";

export type OrderItemWithProduct = OrderItem & { product: Product };

export type OrderWithItems = Order & { items: OrderItemWithProduct[] };
