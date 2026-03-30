import { notFound } from "next/navigation"

/**
 * Catch-all route for admin to ensure the admin sidebar is preserved 
 * when a non-existent admin sub-route is accessed.
 */
export default function AdminCatchAll() {
  notFound()
}
