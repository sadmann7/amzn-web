import { TRPCError } from "@trpc/server";
import { env } from "../../../env/server.mjs";
import { getOrCreateStripeCustomerIdForUser } from "../../stripe/stripe-webhook-handlers";
import { protectedProcedure, router } from "../trpc";

export const stripeRouter = router({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma: ctx.prisma,
      stripe: ctx.stripe,
      userId: ctx.session.user?.id,
    });
    if (!customerId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not create customer id",
      });
    }
    const baseUrl =
      env.NODE_ENV === "development"
        ? `http://${ctx.req.headers.host}`
        : `https://${ctx.req.headers.host}`;
    const checkoutSession = await ctx.stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: ctx.session.user?.id,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/app/account/prime?checkoutSuccess=true`,
      cancel_url: `${baseUrl}/app/account/prime?checkoutCanceled=true`,
      subscription_data: {
        metadata: {
          userId: ctx.session.user?.id,
        },
      },
    });
    if (!checkoutSession) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not create checkout session",
      });
    }
    return { checkoutUrl: checkoutSession.url };
  }),

  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma: ctx.prisma,
      stripe: ctx.stripe,
      userId: ctx.session.user?.id,
    });
    if (!customerId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not create customer id",
      });
    }
    const baseUrl =
      env.NODE_ENV === "development"
        ? `http://${ctx.req.headers.host}`
        : `https://${ctx.req.headers.host}`;
    const stripeBillingPortalSession =
      await ctx.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/app/account/prime`,
      });
    if (!stripeBillingPortalSession) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not create billing portal session",
      });
    }
    return { billingPortalUrl: stripeBillingPortalSession.url };
  }),

  getCustomer: protectedProcedure.query(async ({ ctx }) => {
    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma: ctx.prisma,
      stripe: ctx.stripe,
      userId: ctx.session.user?.id,
    });
    if (!customerId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not create customer id",
      });
    }
    const customer = await ctx.stripe.customers.retrieve(customerId);
    if (!customer) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not get customer",
      });
    }
    return customer;
  }),
});
