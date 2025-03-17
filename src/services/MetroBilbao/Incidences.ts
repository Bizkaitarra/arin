export interface MetroBilbaoInstallationIncident {
    title: string;
    description: string;
    resume: string;
    observation: string;
    createdAt: string;
    isInIssuesBar: boolean;
    resoluteAt: string | null;
    line: string[];
    station: { code: string };
    exit: string | null;
    type: string;
    direction: string | null;
}

export interface MetroBilbaoResponse {
    configuration: {
        incidences: {
            service_issue: [];
            installation_issue: MetroBilbaoInstallationIncident[];
            issue_special_service: [];
        };
    };
}

export interface IncidentsResult {
    serviceIssues: MetroBilbaoInstallationIncident[];
    installationIssues: MetroBilbaoInstallationIncident[];
}
