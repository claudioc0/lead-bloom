import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { MOCK_LEADS, type Lead, type Status } from "@/data/mockLeads";

type LeadsCtx = {
  leads: Lead[];
  savedIds: Set<string>;
  messagesGenerated: number;
  saveLead: (id: string) => void;
  setStatus: (id: string, status: Status) => void;
  setNote: (id: string, note: string) => void;
  bumpMessages: () => void;
};

const Ctx = createContext<LeadsCtx | null>(null);

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [savedIds, setSavedIds] = useState<Set<string>>(
    new Set(MOCK_LEADS.filter((l) => l.status !== "New").map((l) => l.id))
  );
  const [messagesGenerated, setMessagesGenerated] = useState(7);

  const saveLead = useCallback((id: string) => {
    setSavedIds((s) => {
      const n = new Set(s);
      n.add(id);
      return n;
    });
  }, []);

  const setStatus = useCallback((id: string, status: Status) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    setSavedIds((s) => {
      const n = new Set(s);
      n.add(id);
      return n;
    });
  }, []);

  const setNote = useCallback((id: string, note: string) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, note } : l)));
  }, []);

  const bumpMessages = useCallback(() => setMessagesGenerated((n) => n + 1), []);

  const value = useMemo(
    () => ({ leads, savedIds, messagesGenerated, saveLead, setStatus, setNote, bumpMessages }),
    [leads, savedIds, messagesGenerated, saveLead, setStatus, setNote, bumpMessages]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLeads() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLeads must be used inside LeadsProvider");
  return c;
}