export interface CustomError {
  code: number;
  message: string;
}

export interface CustomErrorOutput extends Error {
  code: number;
  message: string;
  name: string;
  errors?: { message: string }[];
  ApiResponse?: { error_message: string[] };
}
