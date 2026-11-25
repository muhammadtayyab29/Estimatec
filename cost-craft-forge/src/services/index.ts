/**
 * Mock service layer. All functions return Promises with 400-800ms delay
 * to simulate a real FastAPI backend. Swap implementations to real fetch()
 * calls later without touching components.
 */
import {
  users, projects, quotations, activity, flaggedItems, comments,
  csiBreakdown, aiDetection, pipelineSteps, demoCreds, getCCI,
  type Role, type Project, type ProjectStatus, type User,
} from "@/data/mockData";
import { requireSupabaseConfig, supabase } from "@/lib/supabase";

const delay = <T,>(v: T, ms = 400 + Math.random() * 400): Promise<T> =>
  new Promise((res) => setTimeout(() => res(v), ms));

const API_URL = "http://localhost:8000/api/v1";

// Map lowercase Postgres/PostgREST column names to camelCase expected by the frontend.
const DB_TO_CAMEL: Record<string, string> = {
  estimatorid: "estimatorId",
  agentid: "agentId",
  estvalue: "estValue",
  createdat: "createdAt",
  updatedat: "updatedAt",
  projectid: "projectId",
  totalvalue: "totalValue",
  agentstatus: "agentStatus",
  adminstatus: "adminStatus",
  lastlogin: "lastLogin",
};

function normalizeKeys(data: unknown): unknown {
  if (Array.isArray(data)) return data.map(normalizeKeys);
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([k, v]) => [
        DB_TO_CAMEL[k.toLowerCase()] ?? k,
        normalizeKeys(v),
      ])
    );
  }
  return data;
}

async function apiFetch(url: string, opts?: RequestInit) {
  const res = await fetch(url, opts);
  if (!res.ok) return null;
  const json = await res.json();
  return normalizeKeys(json);
}

async function authRequest<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (err) {
    if (err instanceof TypeError && /fetch/i.test(err.message)) {
      throw new Error("Cannot reach Supabase. Check that the project URL is correct and the project is active.");
    }
    throw err;
  }
}

async function signupProfileRequest(url: string, options: RequestInit) {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (err instanceof TypeError && /fetch/i.test(err.message)) {
      throw new Error("Your Supabase account was created, but the backend profile could not be saved. Check that the backend is running and uses the same Supabase project.");
    }
    throw err;
  }
}

// ---------- auth ----------
export const authService = {
  login: async (email: string, password: string) => {
    requireSupabaseConfig();
    const { data, error } = await authRequest(() =>
      supabase.auth.signInWithPassword({ email, password })
    );
    if (error) throw error;
    
    // Fetch role and name from public.users table or fallback to metadata
    let userData = data.user.user_metadata;
    const { data: dbUser } = await supabase.from("users").select("*").eq("id", data.user.id).single();
    if (dbUser) userData = dbUser;

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: userData.name || "User",
      role: (userData.role || "agent") as Role,
      status: "Active",
      avatar: userData.avatar || null,
      lastLogin: new Date().toISOString()
    };
    return { user, token: data.session.access_token };
  },
  signup: async (email: string, password: string, name: string, role: string) => {
    requireSupabaseConfig();
    const { data, error } = await authRequest(() =>
      supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } }
      })
    );
    if (error) throw error;
    
    // Insert into public schema to sync with our database design via backend to bypass RLS
    if (data.user && data.session?.access_token) {
      const res = await signupProfileRequest(`${API_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${data.session.access_token}`
        },
        body: JSON.stringify({
          id: data.user.id,
          email,
          name,
          role
        })
      });
      if (!res.ok) {
        let errMessage = "Failed to create user profile on backend";
        try {
          const errJson = await res.json();
          if (errJson && errJson.detail) {
            errMessage = errJson.detail;
          }
        } catch {
          try {
            const errText = await res.text();
            if (errText) errMessage = errText;
          } catch {}
        }
        throw new Error(errMessage);
      }
    }

    const user: User = {
      id: data.user!.id,
      email: data.user!.email!,
      name,
      role: role as Role,
      status: "Active",
      avatar: "",
      lastLogin: new Date().toISOString()
    };
    return { user, token: data.session?.access_token || "" };
  },
  logout: async () => {
    await supabase.auth.signOut();
  },
};

// ---------- projects ----------
const getHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token || "";
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const projectService = {
  list: async () => {
    const data = await apiFetch(`${API_URL}/projects/`, { headers: await getHeaders() });
    if (!data) return delay([...projects]); // fallback to mock
    return data;
  },
  byEstimator: async (id: string) => {
    const all = await apiFetch(`${API_URL}/projects/`, { headers: await getHeaders() }) as any[];
    if (!all) return delay(projects.filter((p) => p.estimatorId === id));
    return all.filter((p: any) => p.estimatorId === id);
  },
  byAgent: async (id: string) => {
    const all = await apiFetch(`${API_URL}/projects/`, { headers: await getHeaders() }) as any[];
    if (!all) return delay(projects.filter((p) => p.agentId === id));
    return all.filter((p: any) => p.agentId === id);
  },
  get: async (id: string) => {
    const all = await apiFetch(`${API_URL}/projects/`, { headers: await getHeaders() }) as any[];
    if (!all) return delay(projects.find((p) => p.id === id) || null);
    return all.find((p: any) => p.id === id) || null;
  },
  create: async (data: Partial<Project>) => {
    const result = await apiFetch(`${API_URL}/projects/`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data)
    });
    if (!result) throw new Error("Failed to create project");
    return result;
  },
  updateStatus: async (id: string, status: ProjectStatus) => {
    const result = await apiFetch(`${API_URL}/projects/${id}`, {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!result) throw new Error("Failed to update status");
    return result;
  },
  assignAgent: async (id: string, agentId: string | null) => {
    const result = await apiFetch(`${API_URL}/projects/${id}`, {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify({ agentId })
    });
    if (!result) throw new Error("Failed to assign agent");
    return result;
  },
  delete: (id: string) => {
    // Delete not implemented on backend yet, using mock
    const i = projects.findIndex((x) => x.id === id);
    if (i >= 0) projects.splice(i, 1);
    return delay(true);
  },
};

// ---------- upload ----------
export const uploadService = {
  upload: (projectId: string, fileName: string, onProgress?: (n: number) => void) =>
    new Promise<{ ok: true; fileName: string }>((resolve) => {
      let n = 0;
      const tick = () => {
        n += 8 + Math.random() * 14;
        if (n >= 100) { n = 100; onProgress?.(n); 
          const p = projects.find((x) => x.id === projectId);
          if (p) { p.drawing = fileName; p.status = "Uploaded"; p.updatedAt = new Date().toISOString(); }
          return resolve({ ok: true, fileName });
        }
        onProgress?.(n);
        setTimeout(tick, 150);
      };
      tick();
    }),
};

// ---------- estimation (real WS) ----------
export const estimationService = {
  run: (
    projectId: string,
    onStep: (i: number, step: any) => void,
    onComplete: () => void,
    onError?: (msg: string) => void,
  ) => {
    let cancelled = false;
    const ws = new WebSocket(`ws://127.0.0.1:8000/api/v1/ws/estimation/${projectId}`);

    let stepIndex = 0;
    ws.onmessage = (event) => {
      if (cancelled) return;
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          if (onError) onError(data.error);
          ws.close();
          return;
        }
        if (data.status === "done") {
          onComplete();
          ws.close();
          return;
        }
        onStep(stepIndex++, { label: data.step, desc: `Progress: ${data.progress}%`, delay: 0 });
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };

    ws.onerror = () => {
      if (!cancelled && onError) onError("WebSocket connection error");
    };

    return { cancel: () => { cancelled = true; ws.close(); } };
  },
};

// ---------- quotation ----------
export const quotationService = {
  list: async () => {
    const data = await apiFetch(`${API_URL}/quotations/`, { headers: await getHeaders() });
    if (!data) return delay([...quotations]);
    return data;
  },
  byProject: async (projectId: string) => {
    const all = await apiFetch(`${API_URL}/quotations/`, { headers: await getHeaders() }) as any[];
    if (!all) return delay(quotations.find((q) => q.projectId === projectId) || null);
    return all.find((q: any) => q.projectId === projectId) || null;
  },
  byEstimator: async (estId: string) => {
    const allQ = await apiFetch(`${API_URL}/quotations/`, { headers: await getHeaders() }) as any[];
    const allP = await apiFetch(`${API_URL}/projects/`, { headers: await getHeaders() }) as any[];
    if (!allQ || !allP) {
      const myProj = projects.filter((p) => p.estimatorId === estId).map((p) => p.id);
      return delay(quotations.filter((q) => myProj.includes(q.projectId)));
    }
    const myProj = allP.filter((p: any) => p.estimatorId === estId).map((p: any) => p.id);
    return allQ.filter((q: any) => myProj.includes(q.projectId));
  },
  byAgent: async (agentId: string) => {
    const allQ = await apiFetch(`${API_URL}/quotations/`, { headers: await getHeaders() }) as any[];
    const allP = await apiFetch(`${API_URL}/projects/`, { headers: await getHeaders() }) as any[];
    if (!allQ || !allP) {
      const myProj = projects.filter((p) => p.agentId === agentId).map((p) => p.id);
      return delay(quotations.filter((q) => myProj.includes(q.projectId)));
    }
    const myProj = allP.filter((p: any) => p.agentId === agentId).map((p: any) => p.id);
    return allQ.filter((q: any) => myProj.includes(q.projectId));
  },
  breakdown: (_projectId: string) => delay({ lines: csiBreakdown, detection: aiDetection }),
  approveAdmin: async (id: string) => {
    const result = await apiFetch(`${API_URL}/quotations/${id}`, {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify({ adminStatus: "Approved" })
    });
    if (!result) throw new Error("Failed");
    return result;
  },
  rejectAdmin: async (id: string) => {
    const result = await apiFetch(`${API_URL}/quotations/${id}`, {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify({ adminStatus: "Rejected" })
    });
    if (!result) throw new Error("Failed");
    return result;
  },
  approveAgent: async (id: string) => {
    const result = await apiFetch(`${API_URL}/quotations/${id}`, {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify({ agentStatus: "Approved" })
    });
    if (!result) throw new Error("Failed");
    return result;
  },
  flagAgent: async (id: string, _reason: string) => {
    const result = await apiFetch(`${API_URL}/quotations/${id}`, {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify({ agentStatus: "Flagged" })
    });
    if (!result) throw new Error("Failed");
    return result;
  },
};

// ---------- users ----------
export const userService = {
  list: async () => {
    const data = await apiFetch(`${API_URL}/users/`, { headers: await getHeaders() });
    if (!data) return delay([...users]);
    return data;
  },
  byRole: async (role: Role) => {
    const all = await apiFetch(`${API_URL}/users/`, { headers: await getHeaders() }) as any[];
    if (!all) return delay(users.filter((u) => u.role === role));
    return all.filter((u: any) => u.role === role);
  },
  invite: (email: string, role: Role) => {
    const nu: User = {
      id: `u${users.length + 1}`, name: email.split("@")[0], email, role,
      status: "Active", lastLogin: new Date().toISOString(),
      avatar: email.slice(0, 2).toUpperCase(),
    };
    users.push(nu);
    return delay(nu);
  },
  updateRole: (id: string, role: Role) => {
    const u = users.find((x) => x.id === id);
    if (u) u.role = role;
    return delay(u);
  },
  toggleStatus: (id: string) => {
    const u = users.find((x) => x.id === id);
    if (u) u.status = u.status === "Active" ? "Inactive" : "Active";
    return delay(u);
  },
};

// ---------- agent ----------
export const agentService = {
  list: () => delay(users.filter((u) => u.role === "agent")),
  workload: () => {
    const out: Record<string, number> = {};
    for (const a of users.filter((u) => u.role === "agent")) {
      out[a.id] = projects.filter((p) => p.agentId === a.id && p.status !== "Approved").length;
    }
    return delay(out);
  },
  autoAssign: () => {
    const agents = users.filter((u) => u.role === "agent");
    const unassigned = projects.filter((p) => !p.agentId);
    let i = 0;
    for (const p of unassigned) { p.agentId = agents[i % agents.length].id; i++; }
    return delay(unassigned.length);
  },
  flagged: () => delay([...flaggedItems]),
  removeFlag: (id: string) => {
    const i = flaggedItems.findIndex((x) => x.id === id);
    if (i >= 0) flaggedItems.splice(i, 1);
    return delay(true);
  },
  comments: () => delay([...comments]),
  byProject: (projectId: string) => delay(comments.filter((c) => c.projectId === projectId)),
  addComment: (projectId: string, userId: string, text: string) => {
    const nc = { id: `c${comments.length + 1}`, projectId, userId, text, timestamp: new Date().toISOString() };
    comments.push(nc);
    return delay(nc);
  },
};

// ---------- activity ----------
export const activityService = {
  list: () => delay([...activity].sort((a, b) => b.timestamp.localeCompare(a.timestamp))),
  byUser: (userId: string) =>
    delay(activity.filter((a) => a.userId === userId).sort((a, b) => b.timestamp.localeCompare(a.timestamp))),
  byRole: (role: Role) =>
    delay(activity.filter((a) => a.role === role).sort((a, b) => b.timestamp.localeCompare(a.timestamp))),
};

// ---------- cci ----------
export const cciService = { factor: (zip: string) => Promise.resolve(getCCI(zip)) };
