import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { drizzle } from "drizzle-orm/mysql2";
import { AccessRequest, InsertAccessRequest, InsertPaymentRequest, InsertUser, accessRequests, paymentRequests, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function createAccessRequest(input: Pick<InsertAccessRequest, "customerName" | "phone">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(accessRequests).values({ ...input, status: "pending" });
  return { id: Number(result[0].insertId) };
}

export async function listAccessRequests() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(accessRequests).orderBy(desc(accessRequests.requestedAt));
}

export async function getBuyerAccessByToken(accessToken: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.select().from(accessRequests).where(eq(accessRequests.accessToken, accessToken)).limit(1);
  return result[0] ?? null;
}

export async function redeemAccessCode(accessCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.select().from(accessRequests).where(eq(accessRequests.accessCode, accessCode)).limit(1);
  const request = result[0];
  return request?.status === "approved" && request.accessToken ? { accessToken: request.accessToken, customerName: request.customerName } : null;
}

export async function updateAccessRequestStatus(id: number, status: "approved" | "rejected", reviewedBy: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const accessCode = status === "approved" ? randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase() : null;
  const accessToken = status === "approved" ? randomUUID() : null;
  await db.update(accessRequests).set({ status, accessCode, accessToken, reviewedAt: new Date(), reviewedBy }).where(eq(accessRequests.id, id));
  return { success: true, accessCode } as const;
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createPaymentRequest(input: InsertPaymentRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(paymentRequests).values(input);
  return { id: Number(result[0].insertId) };
}

export async function listPaymentRequests() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(paymentRequests).orderBy(desc(paymentRequests.submittedAt));
}

export async function getPaymentRequestStatus(confirmationToken: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db
    .select({ status: paymentRequests.status, visitDate: paymentRequests.visitDate, reviewedAt: paymentRequests.reviewedAt })
    .from(paymentRequests)
    .where(eq(paymentRequests.confirmationToken, confirmationToken))
    .limit(1);
  const request = result[0];
  if (!request) return null;
  return request.status === "approved" && isDayPassExpired(request.visitDate)
    ? { ...request, status: "expired" as const }
    : request;
}

export function getDayPassExpiryAt(visitDate: string) {
  const [year, month, day] = visitDate.split("-").map(Number);
  // Sri Lanka is UTC+05:30. 22:00 local time is 16:30 UTC.
  return new Date(Date.UTC(year, month - 1, day, 16, 30, 0));
}

export function isDayPassExpired(visitDate: string) {
  return Date.now() >= getDayPassExpiryAt(visitDate).getTime();
}

export async function getPaymentPassByToken(confirmationToken: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db
    .select({
      id: paymentRequests.id,
      customerName: paymentRequests.customerName,
      branch: paymentRequests.branch,
      visitDate: paymentRequests.visitDate,
      quantity: paymentRequests.quantity,
      amount: paymentRequests.amount,
      status: paymentRequests.status,
      submittedAt: paymentRequests.submittedAt,
      reviewedAt: paymentRequests.reviewedAt,
    })
    .from(paymentRequests)
    .where(eq(paymentRequests.confirmationToken, confirmationToken))
    .limit(1);
  const pass = result[0];
  if (!pass) return null;
  return pass.status === "approved" && isDayPassExpired(pass.visitDate)
    ? { ...pass, status: "expired" as const }
    : pass;
}

export async function updatePaymentRequestStatus(
  id: number,
  status: "approved" | "rejected",
  reviewedBy: string,
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db
    .update(paymentRequests)
    .set({ status, reviewedAt: new Date(), reviewedBy })
    .where(eq(paymentRequests.id, id));
  return { success: true } as const;
}
