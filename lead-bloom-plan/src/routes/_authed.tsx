import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { AppSidebar, MobileNav } from "@/components/AppSidebar";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({ location }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    return { session };
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <div key={path} className="page-enter flex flex-1 flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
