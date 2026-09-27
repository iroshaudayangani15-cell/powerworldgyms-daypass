import { z } from "zod";
import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createAccessRequest,
  createPaymentRequest,
  getBuyerAccessByToken,
  getPaymentPassByToken,
  getPaymentRequestStatus,
  listAccessRequests,
  listPaymentRequests,
  redeemAccessCode,
  updateAccessRequestStatus,
  updatePaymentRequestStatus,
} from "./db";

const accessTokenInput = z.object({ token: z.string().uuid() });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  access: router({
    request: publicProcedure
      .input(z.object({ customerName: z.string().trim().min(2).max(160), phone: z.string().trim().min(7).max(32) }))
      .mutation(({ input }) => createAccessRequest(input)),
    redeem: publicProcedure
      .input(z.object({ code: z.string().trim().min(6).max(16) }))
      .mutation(async ({ input }) => {
        const result = await redeemAccessCode(input.code.toUpperCase());
        if (!result) throw new TRPCError({ code: "FORBIDDEN", message: "This access code is not approved or is invalid." });
        return result;
      }),
    verify: publicProcedure.input(accessTokenInput).query(async ({ input }) => {
      const result = await getBuyerAccessByToken(input.token);
      return result ? { status: result.status, customerName: result.customerName } : null;
    }),
    list: adminProcedure.query(() => listAccessRequests()),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(["approved", "rejected"]) }))
      .mutation(({ input, ctx }) => updateAccessRequestStatus(input.id, input.status, ctx.user.openId)),
  }),

  payments: router({
    submitQr: publicProcedure
      .input(z.object({
        accessToken: z.string().uuid(),
        customerName: z.string().trim().min(2).max(160),
        phone: z.string().trim().min(7).max(32),
        branch: z.string().trim().min(1).max(120),
        visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        quantity: z.number().int().min(1).max(5),
        amount: z.number().int().min(2000).max(10000),
      }))
      .mutation(async ({ input }) => {
        const access = await getBuyerAccessByToken(input.accessToken);
        if (!access || access.status !== "approved") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Approved buyer access is required." });
        }
        const confirmationToken = randomUUID();
        const { accessToken: _accessToken, ...paymentInput } = input;
        const result = await createPaymentRequest({
          ...paymentInput,
          confirmationToken,
          paymentMethod: "qr",
          status: "pending",
        });
        return { ...result, confirmationToken };
      }),
    status: publicProcedure
      .input(z.object({ token: z.string().uuid() }))
      .query(({ input }) => getPaymentRequestStatus(input.token)),
    pass: publicProcedure
      .input(z.object({ token: z.string().uuid() }))
      .query(({ input }) => getPaymentPassByToken(input.token)),
    list: adminProcedure.query(() => listPaymentRequests()),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(["approved", "rejected"]) }))
      .mutation(({ input, ctx }) => updatePaymentRequestStatus(input.id, input.status, ctx.user.openId)),
  }),
});

export type AppRouter = typeof appRouter;
