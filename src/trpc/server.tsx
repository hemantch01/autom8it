import 'server-only'; // <-- ensure this file cannot be imported from the client
import { cache } from 'react';
import { createTRPCContext } from './init';
import { appRouter } from './routers/_app';

export const trpc = cache(async () => {
  return appRouter.createCaller(await createTRPCContext());
});