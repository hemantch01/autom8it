import { PrismaClient } from "@/generated/prisma/client";
import "dotenv/config";
import {PrismaPg} from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString:process.env.DATABASE_URL
})

const globalForPrisma = global as unknown as {
    prismaClient: PrismaClient
}
const prismaClient = new PrismaClient({
    adapter
})|| globalForPrisma.prismaClient;


if (process.env.NODE_ENV !="production"){
    globalForPrisma.prismaClient= prismaClient;
}

export default prismaClient;
