import { describe, it, expect } from 'vitest';
import { getMetroBilbaoL3StopTrains } from './ApiMetroBilbaoL3';
import { fetchEuskotrenData } from './Euskotren/ApiEuskotren';
import { Display } from "./MetroBilbao/Display";

describe('getMetroBilbaoL3StopTrains', () => {
    it('should fetch L3 train data and validate its structure', async () => {
        const originCode = '2641'; // URIBARRI-BILBAO
        const destinationCode = '2597'; // MATIKO-BILBAO
        const today = new Date();
        const maxTrains = 5;

        const display: Display = {
            origin: { Code: originCode, Name: "URIBARRI-BILBAO", Lines: ["L3"], Platform1: [], Platform2: [] },
            destination: { Code: destinationCode, Name: "MATIKO-BILBAO", Lines: ["L3"], Platform1: [], Platform2: [] },
        };

        const metroStopTrains = await getMetroBilbaoL3StopTrains(display, maxTrains);

        expect(metroStopTrains).toHaveProperty('Display');
        expect(metroStopTrains).toHaveProperty('Platform1');
        expect(metroStopTrains).toHaveProperty('Platform2');
        expect(metroStopTrains).toHaveProperty('isRoute');

        expect(metroStopTrains.Platform1).toBeInstanceOf(Array);
        expect(metroStopTrains.Platform1.length).toBeGreaterThan(0);

        metroStopTrains.Platform1.forEach(train => {
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
