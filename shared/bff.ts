export interface InitialRequest {
  provider: string;
  job_type: string;
  user_id: string;
  institution_id?: string;
  connection_id?: string;
}

export interface WidgetError {
  error: string | { message?: string; code?: string };
}