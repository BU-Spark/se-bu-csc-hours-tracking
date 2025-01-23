import { getEvent } from '../action';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    event: {
      findUnique: jest.fn().mockResolvedValue({
        id: 1,
        title: 'Test Event',
      })
    }
  }))
}));

test('getEvent retrieves event data', async () => {
  const eventId = 1;
  const event = await getEvent(eventId);
  expect(event).toBeDefined();
  expect(event).toHaveProperty('id', eventId);
});

// TODO: Add more tests for updateEvent and createEvent