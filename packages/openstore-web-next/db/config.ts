import { column, defineDb, defineTable } from 'astro:db';

const UserCache = defineTable({
  columns: {
    _id: column.text({ primaryKey: true }),
    lookupHash: column.text(),
    role: column.text(),
    name: column.text(),
    username: column.text(),
    expiresAt: column.date(),
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    UserCache,
  }
});
