import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {Http} from '@capacitor-community/http';
import {ApiRenfe} from './ApiRenfe';
import {Display} from '../Display';
const renfeSampleResponse = {
  "actTiempoReal": true,
  "peticion": {
    "cdgoEstOrigen": "13118",
    "cdgoEstDestino": "13200",
    "fchaViaje": "20251023",
    "horaDesde": "15",
    "horaHasta": "26",
    "descEstOrigen": "ABAROA-SAN MIGUEL",
    "descEstDestino": "BILBAO-INTERMOD. ABANDO INDALECIO PRIETO"
  },
  "horario": [
    {
      "linea": "C3",
      "lineaEstOrigen": "C3",
      "lineaEstDestino": "C3",
      "cdgoTren": "35847",
      "horaSalida": "15:18",
      "horaLlegada": "15:32",
      "horaLlegadaReal": "15:32",
      "duracion": "14min.",
      "accesible": false
    },
    {
      "linea": "C3",
      "lineaEstOrigen": "C3",
      "lineaEstDestino": "C3",
      "cdgoTren": "35623",
      "horaSalida": "15:43",
      "horaSalidaReal": "15:45",
      "horaLlegada": "15:58",
      "horaLlegadaReal": "16:00",
      "duracion": "15min.",
      "accesible": false
    }
  ]
};
import {RenfeStop} from "./RenfeStop";

// Mock Capacitor Http
vi.mock('@capacitor-community/http', () => ({
  Http: {
    request: vi.fn(),
  },
}));

// Mock RenfeStorage
vi.mock('./RenfeStorage', () => {
    const RenfeStorage = vi.fn();
    RenfeStorage.prototype.getStationById = vi.fn((id) => ({
        id: id,
        name: `Station ${id}`,
        latitude: 0,
        longitude: 0,
        Lines: []
    }));
    return {RenfeStorage};
});

describe('ApiRenfe', () => {
    let apiRenfe: ApiRenfe;

    beforeEach(() => {
        apiRenfe = new ApiRenfe();
        vi.useFakeTimers();
        // Set a fixed date for tests to make them deterministic
        const mockDate = new Date('2025-10-23T15:00:00.000Z');
        vi.setSystemTime(mockDate);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    const mockDisplay: Display = {
        origin: {id: '13118', name: 'ABAROA-SAN MIGUEL'} as RenfeStop,
        destination: {id: '13200', name: 'BILBAO-INTERMOD. ABANDO INDALECIO PRIETO'} as RenfeStop,
        id: '1',
        type: 'RENFE'
    };

    it('should return platform data when API call is successful', async () => {
        // @ts-ignore
        Http.request.mockResolvedValue({
            status: 200,
            data: renfeSampleResponse,
        });

        const displays = [mockDisplay];
        const result = await apiRenfe.getPlatformsForDisplays(displays);

        expect(Http.request).toHaveBeenCalledTimes(4);
        expect(result).toHaveLength(1);
        expect(result[0].Platform1.length).toBeGreaterThan(0);
        expect(result[0].Platform2.length).toBeGreaterThan(0); // Assuming the reverse call also returns data
        expect(result[0].Platform1[0].line).toBe('C3');
        expect(result[0].Platform1[0].timeToGo).toBe(18); // 15:18 vs 15:00
    });

    it('should return empty platforms when API returns no schedules', async () => {
        // @ts-ignore
        Http.request.mockResolvedValue({
            status: 200,
            data: {horario: []},
        });

        const displays = [mockDisplay];
        const result = await apiRenfe.getPlatformsForDisplays(displays);

        expect(Http.request).toHaveBeenCalledTimes(4);
        expect(result).toHaveLength(1);
        expect(result[0].Platform1).toEqual([]);
        expect(result[0].Platform2).toEqual([]);
    });

    it('should throw an error when API call fails', async () => {
        // @ts-ignore
        Http.request.mockRejectedValue(new Error('Network error'));

        const displays = [mockDisplay];
        await expect(apiRenfe.getPlatformsForDisplays(displays)).rejects.toThrow('Network error');
    });

    it('should correctly calculate timeToGo for next day trains', async () => {
        const lateNightDate = new Date('2025-10-23T23:30:00.000Z');
        vi.setSystemTime(lateNightDate);

        const lateNightResponse = {
            ...renfeSampleResponse,
            horario: [
                {
                    ...renfeSampleResponse.horario[0],
                    horaSalida: "00:15", // This is on the next day
                    horaLlegadaReal: "00:30",
                }
            ]
        };

        // @ts-ignore
        Http.request.mockResolvedValue({
            status: 200,
            data: lateNightResponse,
        });

        const displays = [mockDisplay];
        const result = await apiRenfe.getPlatformsForDisplays(displays);

        expect(result[0].Platform1[0].timeToGo).toBe(45); // 00:15 vs 23:30 is 45 minutes
    });
    
    it('should have failed because a change in the API', async () => {
        const renfeSampleResponse = {
            "actTiempoReal": true,
            "peticion": {
                "cdgoEstOrigen": "05455",
                "cdgoEstDestino": "13206",
                "fchaViaje": "20251027",
                "horaDesde": "18",
                "horaHasta": "30",
                "descEstOrigen": "BASURTO HOSPITAL",
                "descEstDestino": "AMETZOLA"
            },
            "horario": []
        };
        // @ts-ignore
        Http.request.mockResolvedValue({
            status: 200,
            data: renfeSampleResponse,
        });

        const displays = [mockDisplay];
        const result = await apiRenfe.getPlatformsForDisplays(displays);

        expect(Http.request).toHaveBeenCalledTimes(4);
        expect(result).toHaveLength(1);
        expect(result[0].Platform1).toEqual([]);
        expect(result[0].Platform2).toEqual([]);
    });
});
