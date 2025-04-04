import { db, UserCache, sql } from "astro:db";
import { UserSchema } from "./schema";
import crypto from 'node:crypto';

export async function getUser(apikey: string) {
  const hash = crypto.createHash('sha256');
  hash.update(apikey);
  const lookupHash = hash.copy().digest('hex');

  const users = await db.select().from(UserCache).where(sql`${UserCache.lookupHash} = ${lookupHash}`);
  const cachedUser = users.length === 1 ? users[0] : undefined;
  if (cachedUser) {
    if (cachedUser.expiresAt.getTime() > new Date().getTime()) {
      return cachedUser;
    }
    else {
      await db.delete(UserCache).where(sql`${UserCache.lookupHash} = ${lookupHash}`);
    }
  }

  const userResponse = await fetch(`${import.meta.env.PUBLIC_API_URL}api/users/me?apikey=${apikey}`);

  if (userResponse.status !== 200) {
    return undefined;
  }

  const { data } = await userResponse.json()
  const user = UserSchema.parse(data);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 2);

  await db.insert(UserCache).values({
    _id: user._id,
    lookupHash,
    name: user.name ?? '',
    username: user.username,
    role: user.role ?? 'community',
    expiresAt,
  })

  return user;
}
