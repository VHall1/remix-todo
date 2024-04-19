import { PrismaClient } from "@prisma/client";
import { singleton } from "~/utils/singleton";

const prisma = singleton("prisma", getClient);

function getClient() {
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is.
  const client = new PrismaClient({
    log: [
      { level: "query", emit: "event" },
      { level: "error", emit: "stdout" },
      { level: "info", emit: "stdout" },
      { level: "warn", emit: "stdout" },
    ],
  });

  // make the connection eagerly so the first request doesn't have to wait
  void client.$connect();
  return client;
}

export { prisma };
