import { describe, it, expect } from 'vitest';
import { fetchEuskotrenData } from './ApiEuskotren';

describe('fetchEuskotrenData', () => {
    it('should fetch L3 train data and validate its structure', async () => {
        const originCode = '2641'; // URIBARRI-BILBAO
        const destinationCode = '2597'; // MATIKO-BILBAO
        const today = new Date();
        const maxTrains = 5;

        const trainSchedules = await fetchEuskotrenData(originCode, destinationCode, today, maxTrains);

        expect(trainSchedules).toBeInstanceOf(Array);
        expect(trainSchedules.length).toBeGreaterThan(0);

        trainSchedules.forEach(train => {
            expect(train).toHaveProperty('Wagons');
            expect(train.Wagons).toBe(0);

            expect(train).toHaveProperty('Estimated');
            expect(typeof train.Estimated).toBe('number');
            expect(train.Estimated).toBeGreaterThanOrEqual(0);

            expect(train).toHaveProperty('Direction');
            expect(typeof train.Direction).toBe('string');
            expect(train.Direction.length).toBeGreaterThan(0);

            expect(train).toHaveProperty('Time');
            expect(typeof train.Time).toBe('string');
            expect(train.Time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);

            expect(train).toHaveProperty('TimeRounded');
            expect(typeof train.TimeRounded).toBe('string');
            expect(train.TimeRounded).toMatch(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/); // HH:MM format

            expect(train).toHaveProperty('Duration');
            expect(typeof train.Duration).toBe('number');
            expect(train.Duration).toBeGreaterThanOrEqual(0);

            expect(train).toHaveProperty('Transfer');
            expect(train.Transfer).toBe(false);

            // Verify that the train has not departed yet
            const trainDate = new Date(train.Time);
            expect(trainDate.getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 60000); // Allow 1 minute tolerance
        });
    }, 10000); // Increase timeout for API call
});