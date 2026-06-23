import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {ApiMetroBilbao} from './ApiMetroBilbao';
import {Display} from './Display';
import {MetroStopTrains, MetroTrain} from "./MetroBilbaoStorage";
import paradasMetro from "../../data/paradas_metro.json";
import * as ApiMetroBilbaoL3Module from '../ApiMetroBilbaoL3'; // Import the module as a whole

// Mock external dependencies
vi.mock('@capacitor/core', () => ({
    Capacitor: {
        isNativePlatform: vi.fn(() => false),
    },
}));

vi.mock('i18next', () => ({
    __esModule: true,
    default: {
        language: 'es',
    },
}));

// Mock paradas_metro.json
vi.mock('../../data/paradas_metro.json', () => ({
    __esModule: true,
    default: [
        { Code: "L1-1", Lines: ["L1"], Platform1: ["L1-2"], Platform2: ["L1-3"] },
        { Code: "L2-1", Lines: ["L2"], Platform1: ["L2-2"], Platform2: ["L2-3"] },
        { Code: "L3-1", Lines: ["L3"], Platform1: ["L3-2"], Platform2: ["L3-3"] },
        { Code: "L1-2", Lines: ["L1"], Platform1: [], Platform2: [] },
        { Code: "L1-3", Lines: ["L1"], Platform1: [], Platform2: [] },
        { Code: "L2-2", Lines: ["L2"], Platform1: [], Platform2: [] },
        { Code: "L2-3", Lines: ["L2"], Platform1: [], Platform2: [] },
        { Code: "L3-2", Lines: ["L3"], Platform1: [], Platform2: [] },
        { Code: "L3-3", Lines: ["L3"], Platform1: [], Platform2: [] },
    ],
}));

// Mock fetch API
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Helper to create a mock Response object
const createMockResponse = (ok: boolean, data: any, type: 'json' | 'text' = 'json', status: number = 200) => {
    return {
        ok,
        status,
        json: type === 'json' ? () => Promise.resolve(data) : undefined,
        text: type === 'text' ? () => Promise.resolve(data) : undefined,
    };
};

describe('ApiMetroBilbao', () => {
    let apiMetroBilbao: ApiMetroBilbao;
    let getL3Spy: ReturnType<typeof vi.spyOn>;


    beforeEach(() => {
        apiMetroBilbao = new ApiMetroBilbao();
        mockFetch.mockClear();
        getL3Spy = vi.spyOn(ApiMetroBilbaoL3Module, 'getMetroBilbaoL3StopTrains').mockImplementation((display: Display, maxTrains: number) => {
            return Promise.resolve({
                Display: display,
                Platform1: [{ Wagons: 3, Estimated: 5, Direction: "L3", Time: "05 min", TimeRounded: "5 min" }] as MetroTrain[],
                Platform2: [] as MetroTrain[],
                isRoute: false,
            });
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    // Sample data for testing
    const mockDisplayL1: Display = {
        origin: { Code: "L1-1", Name: "Station L1-1" },
        destination: { Code: "L1-2", Name: "Station L1-2" },
    };

    const mockDisplayL3: Display = {
        origin: { Code: "L3-1", Name: "Station L3-1" },
        destination: { Code: "L3-2", Name: "Station L3-2" },
    };

    const mockDisplaySingleStop: Display = {
        origin: { Code: "L1-1", Name: "Station L1-1" },
    };

    // --- Test Suite for getMetroDisplaysTrains ---
    describe('getMetroDisplaysTrains', () => {
        it('should fetch and process train data for multiple displays', async () => {
            // Mock fetch for successful train data
            mockFetch.mockResolvedValueOnce(createMockResponse(true, {
                trip: { duration: 10, transfer: false },
                trains: [
                    { wagons: 3, Estimated: 5, Direction: "L1", Time: "05 min", TimeRounded: "5 min" },
                    { wagons: 3, Estimated: 15, Direction: "L1", Time: "15 min", TimeRounded: "15 min" },
                ],
            }));
            // Mock fetch for the reverse route
            mockFetch.mockResolvedValueOnce(createMockResponse(true, {
                trip: { duration: 10, transfer: false },
                trains: [
                    { wagons: 3, Estimated: 7, Direction: "L1", Time: "07 min", TimeRounded: "7 min" },
                ],
            }));

            const displays = [mockDisplayL1];
            const result = await apiMetroBilbao.getMetroDisplaysTrains(displays);

            expect(mockFetch).toHaveBeenCalledTimes(2); // Two calls for origin-dest and dest-origin
            expect(result).toHaveLength(1);
            expect(result[0].Platform1).toHaveLength(2);
            expect(result[0].Platform2).toHaveLength(1);
            expect(result[0].Platform1[0].Estimated).toBe(5);
            expect(result[0].Platform2[0].Estimated).toBe(7);
        });

        it('should handle L3 stations correctly by calling getMetroBilbaoL3StopTrains', async () => {
            const displays = [mockDisplayL3];
            const result = await apiMetroBilbao.getMetroDisplaysTrains(displays);

            expect(mockFetch).not.toHaveBeenCalled(); // Should not call standard fetch for L3-L3
            expect(getL3Spy).toHaveBeenCalledWith(mockDisplayL3, 60);
            expect(result).toHaveLength(1);
            expect(result[0].Platform1).toHaveLength(1);
            expect(result[0].Platform1[0].Direction).toBe("L3");
        });

        it('should handle single stop displays', async () => {
            // Mock fetch for platform 1 destinations
            mockFetch.mockResolvedValueOnce(createMockResponse(true, {
                trip: { duration: 10, transfer: false },
                trains: [
                    { wagons: 3, Estimated: 5, Direction: "L1", Time: "05 min", TimeRounded: "5 min" },
                ],
            }));
            // Mock fetch for platform 2 destinations
            mockFetch.mockResolvedValueOnce(createMockResponse(true, {
                trip: { duration: 12, transfer: false },
                trains: [
                    { wagons: 3, Estimated: 8, Direction: "L1", Time: "08 min", TimeRounded: "8 min" },
                ],
            }));

            const displays = [mockDisplaySingleStop];
            const result = await apiMetroBilbao.getMetroDisplaysTrains(displays);

            expect(mockFetch).toHaveBeenCalledTimes(2);
            expect(result).toHaveLength(1);
            expect(result[0].Platform1).toHaveLength(1);
            expect(result[0].Platform2).toHaveLength(1);
            expect(result[0].Platform1[0].Estimated).toBe(5);
            expect(result[0].Platform2[0].Estimated).toBe(8);
        });

        it('should return empty arrays on fetch error for getMetroDisplaysTrains', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const displays = [mockDisplayL1];
            const result = await apiMetroBilbao.getMetroDisplaysTrains(displays);

            expect(result).toHaveLength(1);
            expect(result[0].Platform1).toEqual([]);
            expect(result[0].Platform2).toEqual([]);
        });
    });

    // --- Test Suite for fetchMetroBilbaoIncidents ---
    describe('fetchMetroBilbaoIncidents', () => {
        it('should fetch and parse incidents correctly', async () => {
            const mockIncidentsResponse = {
                configuration: {
                    incidences: {
                        service_issue: [
                            { title: "Service Issue 1", resume: "Resume 1", description: "Desc 1" },
                        ],
                        installation_issue: [
                            { title: "Install Issue 1", resume: "Resume 1", description: "Desc 1", station: { code: "S1" } },
                        ],
                    },
                },
            };
            mockFetch.mockResolvedValueOnce(createMockResponse(true, mockIncidentsResponse));

            const result = await apiMetroBilbao.fetchMetroBilbaoIncidents();

            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(result.serviceIssues).toHaveLength(1);
            expect(result.installationIssues).toHaveLength(1);
            expect(result.serviceIssues[0].title).toBe("Service Issue 1");
            expect(result.installationIssues[0].station.code).toBe("S1");
        });

        it('should throw an error if fetch fails', async () => {
            mockFetch.mockRejectedValueOnce(new Error("Network error")); // ok: false

            await expect(apiMetroBilbao.fetchMetroBilbaoIncidents()).rejects.toThrow("Network error");
        });
    });

    // --- Test Suite for getBarikData ---
    describe('getBarikData', () => {
        it('should fetch and parse Barik data correctly', async () => {
            const mockXmlResponse = `
                <root>
                    <resultado>OK</resultado>
                    <titulosMonedero>
                        <TipoTitulo>Monedero Gizatrans</TipoTitulo>
                        <SldMon>10.50</SldMon>
                    </titulosMonedero>
                    <titulosMonedero>
                        <TipoTitulo>Monedero Creditrans</TipoTitulo>
                        <SldMon>20.00</SldMon>
                    </titulosMonedero>
                </root>
            `;
            mockFetch.mockResolvedValueOnce(createMockResponse(true, mockXmlResponse, 'text'));

            const result = await apiMetroBilbao.getBarikData("12345");

            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(result.Status).toBe("OK");
            expect(result.Gizatrans).toBe("10.50");
            expect(result.Creditrans).toBe("20.00");
        });

        it('should return error status on fetch failure', async () => {
            mockFetch.mockRejectedValueOnce(new Error("Network error"));

            const result = await apiMetroBilbao.getBarikData("12345");

            expect(result.Status).toBe("ERROR");
            expect(result.Gizatrans).toBeUndefined();
            expect(result.Creditrans).toBeUndefined();
        });
    });

    // --- Test Suite for planTrip ---
    describe('planTrip', () => {
        it('should plan a trip correctly', async () => {
            const mockTripResponse = {
                origin: { name: "O1" },
                destiny: { name: "D1" },
                time: 30,
                trips: [
                    {
                        originArrivalTimeRounder: "08:00",
                        destinyArrivalTimeRounder: "08:30",
                    },
                ],
            };
            mockFetch.mockResolvedValueOnce(createMockResponse(true, mockTripResponse));

            const params = {
                origen: "O1",
                destino: "D1",
                fecha: "01-01-2025",
                hora_inicio: 8,
                hora_fin: 10,
            };
            const result = await apiMetroBilbao.planTrip(params);

            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockTripResponse);
        });

        it('should return null on fetch error', async () => {
            mockFetch.mockRejectedValueOnce(new Error("Network error"));

            const params = {
                origen: "O1",
                destino: "D1",
                fecha: "01-01-2025",
                hora_inicio: 8,
                hora_fin: 10,
            };
            const result = await apiMetroBilbao.planTrip(params);

            expect(result).toBeNull();
        });
    });

    // --- Test Suite for getFares ---
    describe('getFares', () => {
        it('should fetch and return fares correctly', async () => {
            const mockFaresResponse = {
                title: "Fares",
                description: "Desc",
                configuration: { categorized: {} },
            };
            mockFetch.mockResolvedValueOnce(createMockResponse(true, mockFaresResponse));

            const result = await apiMetroBilbao.getFares();

            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockFaresResponse);
        });

        it('should throw an error if fetch fails', async () => {
            mockFetch.mockRejectedValueOnce(new Error("Network error"));

            await expect(apiMetroBilbao.getFares()).rejects.toThrow("Network error");
        });
    });
});