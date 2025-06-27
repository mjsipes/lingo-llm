"use client";

import { AuthProvider } from "@/lib/supabase/AuthProvider";
import type { ReactNode } from "react";

export function ClientAuthWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
