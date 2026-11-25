import { createFileRoute, Navigate } from "@tanstack/react-router";
export const Route = createFileRoute("/estimator/")({ component: () => <Navigate to="/estimator/dashboard" /> });
