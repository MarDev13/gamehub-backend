import { PaginationDto } from "../dto/pagination.dto";
export function buildPagination(pagination: PaginationDto) {

    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    return {
        skip: (page - 1) * limit,
        take: limit,
        orderBy: pagination.sort ? { [pagination.sort]: pagination.order ?? 'desc' } : undefined,
    };
}