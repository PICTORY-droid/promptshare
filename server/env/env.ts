import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Supabase URL 형식이 올바르지 않습니다."),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key가 비어 있습니다."),
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "Supabase service role key가 비어 있습니다."),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

type EnvSource = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

export type EnvValidationResult =
  | {
      ok: true;
      env: PublicEnv;
      missingKeys: [];
      message: null;
    }
  | {
      ok: false;
      env: null;
      missingKeys: string[];
      message: string;
    };

export type ServerEnvValidationResult =
  | {
      ok: true;
      env: ServerEnv;
      missingKeys: [];
      message: null;
    }
  | {
      ok: false;
      env: null;
      missingKeys: string[];
      message: string;
    };

function getDefaultEnvSource(): EnvSource {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function validatePublicEnv(
  source: EnvSource = getDefaultEnvSource(),
): EnvValidationResult {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: source.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: source.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (parsed.success) {
    return {
      ok: true,
      env: parsed.data,
      missingKeys: [],
      message: null,
    };
  }

  const missingKeys = parsed.error.issues.map((issue) => issue.path.join("."));

  return {
    ok: false,
    env: null,
    missingKeys,
    message:
      "Supabase 환경변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인하세요.",
  };
}

export function validateServerEnv(
  source: EnvSource = getDefaultEnvSource(),
): ServerEnvValidationResult {
  const parsed = serverEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: source.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: source.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: source.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (parsed.success) {
    return {
      ok: true,
      env: parsed.data,
      missingKeys: [],
      message: null,
    };
  }

  const missingKeys = parsed.error.issues.map((issue) => issue.path.join("."));

  return {
    ok: false,
    env: null,
    missingKeys,
    message:
      "Supabase 서버 환경변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY를 확인하세요.",
  };
}

export function getPublicEnv(source: EnvSource = getDefaultEnvSource()): PublicEnv {
  const result = validatePublicEnv(source);

  if (!result.ok) {
    throw new Error(result.message);
  }

  return result.env;
}

export function getServerEnv(source: EnvSource = getDefaultEnvSource()): ServerEnv {
  const result = validateServerEnv(source);

  if (!result.ok) {
    throw new Error(result.message);
  }

  return result.env;
}