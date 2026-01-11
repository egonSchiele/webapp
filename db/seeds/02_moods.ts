import type { Kysely } from 'kysely'

export async function seed(db: Kysely<any>): Promise<void> {
	await db
		.insertInto('moods')
		.values([
			{
				mood: 'good',
				note: 'Feeling great today!',
				created_at: new Date('2024-01-01T10:00:00Z').toISOString(),
			},
			{
				mood: 'ok',
				note: 'Just an average day',
				created_at: new Date('2024-01-02T14:30:00Z').toISOString(),
			},
			{
				mood: 'bad',
				note: 'Having a rough day',
				created_at: new Date('2024-01-03T09:15:00Z').toISOString(),
			},
			{
				mood: 'good',
				note: 'Beautiful weather lifted my spirits',
				created_at: new Date('2024-01-04T16:45:00Z').toISOString(),
			},
			{
				mood: 'ok',
				note: null,
				created_at: new Date('2024-01-05T12:00:00Z').toISOString(),
			},
		])
		.execute()
}