// common shapes
export interface List<T> {
    items: T[];
}

export interface Search {
    pageNumber: number;
    pageSize?: number;
    sort?: string;
}

export interface Paged<T> {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    items: T[];
}

export interface AuditableResponse {
    createdDate: Date;
    createdSubject: SubjectResponse;
    lastModifiedDate: Date;
    lastModifiedSubject: SubjectResponse;
}

export interface SubjectResponse {
    subjectId: string;
    name: string;
    givenName: string;
    familyName: string;
    userPrincipalName: string;
}

export interface AuditableModel {
    createdDate: Date;
    createdSubject: SubjectModel;
    lastModifiedDate: Date;
    lastModifiedSubject: SubjectModel;
}

export interface SubjectModel {
    subjectId: string;
    name: string;
    givenName: string;
    familyName: string;
    userPrincipalName: string;
}