export type SecurityEventType =
  | "AUTH_LOGIN_SUCCESS"
  | "AUTH_LOGIN_FAILED"
  | "AUTH_LOGIN_RATE_LIMITED"
  | "AUTH_LOGOUT"
  | "AUTH_FORBIDDEN_ROLE"
  | "CSRF_ORIGIN_BLOCKED"
  | "ADMIN_PRODUCT_MUTATION"
  | "ADMIN_CATEGORY_MUTATION"
  | "ADMIN_MOTORCYCLE_MUTATION"
  | "ADMIN_HOME_MUTATION"
  | "ADMIN_UPLOAD_IMAGE"
  | "ADMIN_USER_MUTATION";

interface SecurityAuditEvent {
  event: SecurityEventType;
  actor?: string;
  ip?: string;
  target?: string;
  detail?: string;
}

/**
 * Emits structured JSON security audit logs to stdout/stderr without leaking secrets or PII.
 */
export function logSecurityEvent(payload: SecurityAuditEvent): void {
  const record = {
    ts: new Date().toISOString(),
    service: "cr7-racing",
    ...payload,
  };

  if (
    payload.event === "AUTH_LOGIN_FAILED" ||
    payload.event === "AUTH_LOGIN_RATE_LIMITED" ||
    payload.event === "AUTH_FORBIDDEN_ROLE" ||
    payload.event === "CSRF_ORIGIN_BLOCKED"
  ) {
    console.warn(JSON.stringify(record));
  } else {
    console.info(JSON.stringify(record));
  }
}
