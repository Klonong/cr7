"use client";

import type * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { useRouteFlags } from "@/hooks/layout/use-route-flags";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const { isAdminRoute } = useRouteFlags();

  if (isAdminRoute) {
    return (
      <main id="main-content" className="flex-1 flex flex-col">
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
