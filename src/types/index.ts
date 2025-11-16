export * from '@/types/enum/enum';
export * from '@/types/entity/entity';
export * from '@/types/request/service_request';


// Discriminated union for API responses
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
