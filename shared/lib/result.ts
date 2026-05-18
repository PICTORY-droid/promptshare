export type ActionResult<TData, TCode extends string = string> =
  | {
      ok: true;
      data: TData;
      message: null;
      code?: never;
    }
  | {
      ok: false;
      data: null;
      message: string;
      code?: TCode;
    };

export type EmptyActionResult<TCode extends string = string> = ActionResult<
  null,
  TCode
>;

export function createSuccessResult<TData>(data: TData): ActionResult<TData> {
  return {
    ok: true,
    data,
    message: null,
  };
}

export function createFailureResult<TCode extends string = string>(
  message: string,
  code?: TCode,
): ActionResult<never, TCode> {
  return {
    ok: false,
    data: null,
    message,
    code,
  };
}

export function isSuccessResult<TData, TCode extends string = string>(
  result: ActionResult<TData, TCode>,
): result is Extract<ActionResult<TData, TCode>, { ok: true }> {
  return result.ok;
}

export function isFailureResult<TData, TCode extends string = string>(
  result: ActionResult<TData, TCode>,
): result is Extract<ActionResult<TData, TCode>, { ok: false }> {
  return !result.ok;
}