export type Role = "admin" | "estimator" | "agent";
export type ProjectStatus = "Draft" | "Uploaded" | "Processing" | "Completed" | "Approved";
export type QuotationStatus = "Pending Review" | "Agent Approved" | "Admin Approved" | "Flagged" | "Rejected";

export interface User {
  id: string; name: string; email: string; role: Role;
  status: "Active" | "Inactive"; lastLogin: string; avatar: string;
}
export interface Project {
  id: string; name: string; client: string; zip: string;
  estimatorId: string; agentId: string | null;
  status: ProjectStatus; drawing: string | null;
  estValue: number; createdAt: string; updatedAt: string;
  description: string;
}
export interface Quotation {
  id: string; projectId: string; total: number;
  agentStatus: "Pending" | "Approved" | "Flagged";
  adminStatus: "Pending" | "Approved" | "Rejected";
  generatedAt: string;
}
export interface Activity {
  id: string; userId: string; role: Role;
  action: string; projectId?: string; timestamp: string;
}
export interface FlaggedItem {
  id: string; quotationId: string; projectId: string;
  reason: string; flaggedAt: string;
  status: "Awaiting Estimator Fix" | "Resubmitted" | "Resolved";
}
export interface Comment {
  id: string; projectId: string; userId: string;
  text: string; timestamp: string;
}

export const cciTable: Record<string, number> = {
  "10001": 1.30, "90001": 1.24, "60601": 1.18,
  "33101": 0.98, "77001": 0.93, "75201": 0.91,
};
export const getCCI = (zip: string) => cciTable[zip] ?? 0.85;

export const users: User[] = [
  { id: "u1", name: "Sarah Chen", email: "admin@estimatec.com", role: "admin", status: "Active", lastLogin: "2025-05-15T10:30:00Z", avatar: "SC" },
  { id: "u2", name: "Michael Rivera", email: "admin2@estimatec.com", role: "admin", status: "Active", lastLogin: "2025-05-14T08:12:00Z", avatar: "MR" },
  { id: "u3", name: "Priya Anand", email: "admin3@estimatec.com", role: "admin", status: "Inactive", lastLogin: "2025-04-22T11:00:00Z", avatar: "PA" },
  { id: "u4", name: "James Foster", email: "estimator@estimatec.com", role: "estimator", status: "Active", lastLogin: "2025-05-16T09:15:00Z", avatar: "JF" },
  { id: "u5", name: "Elena Park", email: "estimator2@estimatec.com", role: "estimator", status: "Active", lastLogin: "2025-05-15T16:40:00Z", avatar: "EP" },
  { id: "u6", name: "David Kumar", email: "estimator3@estimatec.com", role: "estimator", status: "Active", lastLogin: "2025-05-13T13:22:00Z", avatar: "DK" },
  { id: "u7", name: "Hannah Wells", email: "estimator4@estimatec.com", role: "estimator", status: "Active", lastLogin: "2025-05-10T07:55:00Z", avatar: "HW" },
  { id: "u8", name: "Marcus Bell", email: "agent@estimatec.com", role: "agent", status: "Active", lastLogin: "2025-05-16T11:00:00Z", avatar: "MB" },
  { id: "u9", name: "Aisha Khan", email: "agent2@estimatec.com", role: "agent", status: "Active", lastLogin: "2025-05-15T14:30:00Z", avatar: "AK" },
  { id: "u10", name: "Carlos Nieto", email: "agent3@estimatec.com", role: "agent", status: "Active", lastLogin: "2025-05-14T17:20:00Z", avatar: "CN" },
];

export const projects: Project[] = [
  { id: "p1", name: "Riverside Office Tower", client: "Hartwell Group", zip: "10001", estimatorId: "u4", agentId: "u8", status: "Completed", drawing: "riverside_floor3.pdf", estValue: 202303, createdAt: "2025-04-10T10:00:00Z", updatedAt: "2025-05-12T09:00:00Z", description: "12-story office build, downtown." },
  { id: "p2", name: "Maple Street Residences", client: "Beacon Homes", zip: "60601", estimatorId: "u4", agentId: "u9", status: "Approved", drawing: "maple_block.pdf", estValue: 487120, createdAt: "2025-03-22T10:00:00Z", updatedAt: "2025-05-10T09:00:00Z", description: "8-unit townhome cluster." },
  { id: "p3", name: "Atlas Warehouse Expansion", client: "Atlas Logistics", zip: "77001", estimatorId: "u5", agentId: "u8", status: "Processing", drawing: "atlas_addition.pdf", estValue: 318500, createdAt: "2025-05-01T10:00:00Z", updatedAt: "2025-05-15T09:00:00Z", description: "Tilt-up addition, 24,000 sqft." },
  { id: "p4", name: "Cedar Park Library", client: "Cedar Park ISD", zip: "75201", estimatorId: "u4", agentId: null, status: "Uploaded", drawing: "library_a1.pdf", estValue: 0, createdAt: "2025-05-08T10:00:00Z", updatedAt: "2025-05-14T09:00:00Z", description: "Public library, 18,000 sqft." },
  { id: "p5", name: "Harbor View Retail", client: "Sundial Retail", zip: "33101", estimatorId: "u6", agentId: "u10", status: "Completed", drawing: "harbor_retail.pdf", estValue: 156400, createdAt: "2025-04-18T10:00:00Z", updatedAt: "2025-05-11T09:00:00Z", description: "Strip mall facade renovation." },
  { id: "p6", name: "Northgate Clinic", client: "Northgate Health", zip: "90001", estimatorId: "u7", agentId: "u9", status: "Draft", drawing: null, estValue: 0, createdAt: "2025-05-14T10:00:00Z", updatedAt: "2025-05-14T10:00:00Z", description: "Outpatient clinic build-out." },
  { id: "p7", name: "Summit Hotel Refresh", client: "Summit Hospitality", zip: "10001", estimatorId: "u5", agentId: "u8", status: "Completed", drawing: "summit_hotel.pdf", estValue: 412800, createdAt: "2025-04-02T10:00:00Z", updatedAt: "2025-05-09T09:00:00Z", description: "Lobby + 120 room refresh." },
  { id: "p8", name: "Pine Hollow School", client: "Pine Hollow ISD", zip: "75201", estimatorId: "u4", agentId: "u10", status: "Processing", drawing: "pinehollow.pdf", estValue: 0, createdAt: "2025-05-05T10:00:00Z", updatedAt: "2025-05-15T09:00:00Z", description: "Elementary classroom wing." },
  { id: "p9", name: "Bayside Condo Phase II", client: "Bayside Devco", zip: "33101", estimatorId: "u6", agentId: null, status: "Uploaded", drawing: "bayside_2.pdf", estValue: 0, createdAt: "2025-05-09T10:00:00Z", updatedAt: "2025-05-13T09:00:00Z", description: "Phase II — 40 units." },
  { id: "p10", name: "Greenfield Plant Annex", client: "Greenfield Mfg", zip: "60601", estimatorId: "u7", agentId: "u9", status: "Approved", drawing: "greenfield.pdf", estValue: 689230, createdAt: "2025-03-12T10:00:00Z", updatedAt: "2025-05-08T09:00:00Z", description: "Light industrial annex." },
];

export interface CSILine {
  division: string; item: string; qty: number; unit: string;
  unitCost: number; cci: number; total: number;
}
export const csiBreakdown: CSILine[] = [
  { division: "Div 03", item: "Slab Concrete", qty: 185, unit: "CY", unitCost: 165.00, cci: 1.24, total: 37851 },
  { division: "Div 03", item: "Footing Concrete", qty: 42, unit: "CY", unitCost: 175.00, cci: 1.24, total: 9114 },
  { division: "Div 04", item: "Standard Brick", qty: 12450, unit: "EA", unitCost: 1.85, cci: 1.24, total: 28552 },
  { division: "Div 04", item: "CMU Block (8x8x16)", qty: 3200, unit: "EA", unitCost: 3.20, cci: 1.24, total: 12698 },
  { division: "Div 05", item: "Rebar (Commercial)", qty: 8400, unit: "LBS", unitCost: 0.85, cci: 1.24, total: 8854 },
  { division: "Div 08", item: "Door Openings", qty: 12, unit: "EA", unitCost: 1250.00, cci: 1.24, total: 18600 },
  { division: "Div 08", item: "Window Openings", qty: 28, unit: "EA", unitCost: 850.00, cci: 1.24, total: 29512 },
  { division: "Div 09", item: "Drywall", qty: 6200, unit: "SF", unitCost: 2.85, cci: 1.24, total: 21887 },
  { division: "Div 09", item: "Paint (2 coats)", qty: 48, unit: "GAL", unitCost: 42.00, cci: 1.24, total: 2499 },
  { division: "Div 09", item: "Flooring", qty: 4800, unit: "SF", unitCost: 5.50, cci: 1.24, total: 32736 },
];

export const quotations: Quotation[] = [
  { id: "q1", projectId: "p1", total: 202303, agentStatus: "Approved", adminStatus: "Approved", generatedAt: "2025-05-12T09:00:00Z" },
  { id: "q2", projectId: "p2", total: 487120, agentStatus: "Approved", adminStatus: "Approved", generatedAt: "2025-05-10T09:00:00Z" },
  { id: "q3", projectId: "p5", total: 156400, agentStatus: "Approved", adminStatus: "Pending", generatedAt: "2025-05-11T09:00:00Z" },
  { id: "q4", projectId: "p7", total: 412800, agentStatus: "Pending", adminStatus: "Pending", generatedAt: "2025-05-09T09:00:00Z" },
  { id: "q5", projectId: "p10", total: 689230, agentStatus: "Approved", adminStatus: "Approved", generatedAt: "2025-05-08T09:00:00Z" },
  { id: "q6", projectId: "p3", total: 318500, agentStatus: "Flagged", adminStatus: "Pending", generatedAt: "2025-05-15T09:00:00Z" },
  { id: "q7", projectId: "p8", total: 224100, agentStatus: "Pending", adminStatus: "Pending", generatedAt: "2025-05-15T11:00:00Z" },
  { id: "q8", projectId: "p9", total: 0, agentStatus: "Pending", adminStatus: "Pending", generatedAt: "2025-05-13T11:00:00Z" },
];

export const flaggedItems: FlaggedItem[] = [
  { id: "f1", quotationId: "q6", projectId: "p3", reason: "Rebar quantity seems low vs. drawing schedule.", flaggedAt: "2025-05-15T10:00:00Z", status: "Awaiting Estimator Fix" },
  { id: "f2", quotationId: "q7", projectId: "p8", reason: "Door schedule mismatch — verify openings.", flaggedAt: "2025-05-15T12:00:00Z", status: "Resubmitted" },
  { id: "f3", quotationId: "q4", projectId: "p7", reason: "CCI factor should be re-checked for hotel zone.", flaggedAt: "2025-05-12T15:00:00Z", status: "Resolved" },
];

export const comments: Comment[] = [
  { id: "c1", projectId: "p1", userId: "u8", text: "Verified slab quantities against field measurements — looks good.", timestamp: "2025-05-12T10:00:00Z" },
  { id: "c2", projectId: "p1", userId: "u4", text: "Updated rebar pricing to current RS Means. Ready for final review.", timestamp: "2025-05-12T11:00:00Z" },
  { id: "c3", projectId: "p3", userId: "u8", text: "Please confirm rebar count for footings — see flag.", timestamp: "2025-05-15T10:05:00Z" },
  { id: "c4", projectId: "p5", userId: "u10", text: "Storefront glazing approved. Moving to admin queue.", timestamp: "2025-05-11T10:30:00Z" },
  { id: "c5", projectId: "p8", userId: "u10", text: "Door schedule resubmitted with corrected count.", timestamp: "2025-05-15T13:00:00Z" },
  { id: "c6", projectId: "p2", userId: "u9", text: "All CSI divisions reviewed. Approved.", timestamp: "2025-05-10T10:00:00Z" },
  { id: "c7", projectId: "p10", userId: "u9", text: "Industrial annex looks clean. Approved.", timestamp: "2025-05-08T10:00:00Z" },
  { id: "c8", projectId: "p7", userId: "u8", text: "Will visit site Friday to confirm lobby scope.", timestamp: "2025-05-09T14:00:00Z" },
  { id: "c9", projectId: "p4", userId: "u4", text: "Drawing uploaded. Awaiting agent assignment.", timestamp: "2025-05-14T09:30:00Z" },
  { id: "c10", projectId: "p3", userId: "u5", text: "Working on rebar correction — will resubmit today.", timestamp: "2025-05-15T11:00:00Z" },
];

export const activity: Activity[] = [
  { id: "a1", userId: "u1", role: "admin", action: "Approved quotation for Riverside Office Tower", projectId: "p1", timestamp: "2025-05-12T09:30:00Z" },
  { id: "a2", userId: "u4", role: "estimator", action: "Uploaded drawing to Cedar Park Library", projectId: "p4", timestamp: "2025-05-14T09:00:00Z" },
  { id: "a3", userId: "u8", role: "agent", action: "Flagged quotation for Atlas Warehouse", projectId: "p3", timestamp: "2025-05-15T10:00:00Z" },
  { id: "a4", userId: "u4", role: "estimator", action: "Ran estimation for Pine Hollow School", projectId: "p8", timestamp: "2025-05-15T11:00:00Z" },
  { id: "a5", userId: "u9", role: "agent", action: "Approved quotation for Maple Street Residences", projectId: "p2", timestamp: "2025-05-10T09:30:00Z" },
  { id: "a6", userId: "u1", role: "admin", action: "Invited new estimator: Hannah Wells", timestamp: "2025-05-10T08:00:00Z" },
  { id: "a7", userId: "u5", role: "estimator", action: "Generated quotation for Atlas Warehouse", projectId: "p3", timestamp: "2025-05-15T09:00:00Z" },
  { id: "a8", userId: "u10", role: "agent", action: "Added comment on Harbor View Retail", projectId: "p5", timestamp: "2025-05-11T10:30:00Z" },
  { id: "a9", userId: "u1", role: "admin", action: "Reassigned agent on Greenfield Plant", projectId: "p10", timestamp: "2025-05-08T08:00:00Z" },
  { id: "a10", userId: "u6", role: "estimator", action: "Created project Harbor View Retail", projectId: "p5", timestamp: "2025-04-18T10:00:00Z" },
  { id: "a11", userId: "u8", role: "agent", action: "Approved quotation for Riverside Office Tower", projectId: "p1", timestamp: "2025-05-12T08:00:00Z" },
  { id: "a12", userId: "u4", role: "estimator", action: "Uploaded drawing to Riverside Office Tower", projectId: "p1", timestamp: "2025-05-11T14:00:00Z" },
  { id: "a13", userId: "u2", role: "admin", action: "Updated system configuration", timestamp: "2025-05-09T09:00:00Z" },
  { id: "a14", userId: "u7", role: "estimator", action: "Created project Northgate Clinic", projectId: "p6", timestamp: "2025-05-14T10:00:00Z" },
  { id: "a15", userId: "u9", role: "agent", action: "Reviewed Greenfield Plant quotation", projectId: "p10", timestamp: "2025-05-08T09:00:00Z" },
  { id: "a16", userId: "u1", role: "admin", action: "Rejected quotation revision", projectId: "p7", timestamp: "2025-05-09T10:00:00Z" },
  { id: "a17", userId: "u10", role: "agent", action: "Added comment on Pine Hollow School", projectId: "p8", timestamp: "2025-05-15T13:00:00Z" },
  { id: "a18", userId: "u5", role: "estimator", action: "Ran estimation for Atlas Warehouse", projectId: "p3", timestamp: "2025-05-15T08:45:00Z" },
  { id: "a19", userId: "u1", role: "admin", action: "Auto-assigned 3 projects to agents", timestamp: "2025-05-08T07:00:00Z" },
  { id: "a20", userId: "u4", role: "estimator", action: "Created project Cedar Park Library", projectId: "p4", timestamp: "2025-05-08T10:00:00Z" },
];

export const pipelineSteps = [
  { icon: "🔧", message: "Preprocessing drawing...", progress: 10, delay: 1500 },
  { icon: "🤖", message: "Detecting elements (YOLO)...", progress: 35, delay: 3000 },
  { icon: "🔍", message: "Extracting dimensions (OCR)...", progress: 60, delay: 2500 },
  { icon: "📐", message: "Calculating CSI quantities...", progress: 80, delay: 2000 },
  { icon: "💰", message: "Applying RS Means pricing...", progress: 95, delay: 1500 },
  { icon: "✅", message: "Estimation Complete!", progress: 100, delay: 500 },
];

export const aiDetection = { walls: 24, doors: 12, windows: 28, slabs: 3 };

export const demoCreds: Record<Role, { email: string; password: string }> = {
  admin:     { email: "admin@estimatec.com", password: "admin123" },
  estimator: { email: "estimator@estimatec.com", password: "est123" },
  agent:     { email: "agent@estimatec.com", password: "agt123" },
};

export const findUser = (id: string) => users.find(u => u.id === id);
export const findProject = (id: string) => projects.find(p => p.id === id);
export const formatMoney = (n: number | null | undefined) =>
  (n != null && !isNaN(n) ? n : 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
