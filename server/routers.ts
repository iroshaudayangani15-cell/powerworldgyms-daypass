import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createPaymentRequest,
  listPaymentRequests,
  updatePaymentRequestStatus,
} from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  payments: router({
    submitQr: publicProcedure
      .input(
        z.object({
          customerName: z.string().trim().min(2).max(160),
          phone: z.string().trim().min(7).max(32),
          branch: z.string().trim().min(1).max(120),
          visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          quantity: z.number().int().min(1).max(5),
          amount: z.number().int().min(2000).max(10000),
        }),
      )
      .mutation(({ input }) =>
        createPaymentRequest({
          ...input,
          paymentMethod: "qr",
          status: "pending",
        }),
      ),
    list: adminProcedure.query(() => listPaymentRequests()),
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          status: z.enum(["approved", "rejected"]),
        }),
      )
      .mutation(({ input, ctx }) =>
        updatePaymentRequestStatus(input.id, input.status, ctx.user.openId),
      ),
  }),
});

export type AppRouter = typeof appRouter;
