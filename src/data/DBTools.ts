

export default class DBTools {

    public static async createIndex(db, tableName: string, ...fields: string[]) {

        for (let i of fields)
            await db.run(`CREATE INDEX IF NOT EXISTS ${i}_index on ${tableName} (${i});`)
    }

} 