export interface Display {
    origin: MetroStop;
    destination?: MetroStop;
}

export interface MetroStop {
    Code: string;
    Name: string;
    Lines: string[];
    IsFavorite?: boolean;
    Platform1: string[];
    Platform2: string[];
}