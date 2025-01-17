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

export interface AuditableEntity {
    createdDate: Date;
    createdSubject: Subject;
    lastModifiedDate: Date;
    lastModifiedSubject: Subject;
}

export interface Subject {
    subjectId: string;
    name: string;
    givenName: string;
    familyName: string;
    userPrincipalName: string;
}

export interface AuditableEntityModel {
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