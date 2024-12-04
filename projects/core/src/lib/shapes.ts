// common shapes
export interface List<T> {
    items: T[];
}

export interface Search {
    pageNumber: number;
    pageSize: number;
    sort: string;
}

export interface Paged<T> {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    items: T[];
}