"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface EnquiryItem {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  message: string;
  source: "enquiry" | "register-interest" | "contact";
  status: "New" | "Contacted" | "Closed";
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  new: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }
      if (statusFilter !== "All") {
        params.set("status", statusFilter);
      }

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load enquiries.");
      }

      setEnquiries(data.enquiries || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Unable to load enquiries.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update status.");
      }

      // Update in state
      setEnquiries((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, status: newStatus as EnquiryItem["status"] }
            : item
        )
      );

      // Refresh stats if status changed to/from 'New'
      const updatedTotal = stats.total;
      const countNew =
        newStatus === "New"
          ? enquiries.filter((e) => e._id !== id && e.status === "New").length + 1
          : enquiries.filter((e) => e._id !== id && e.status === "New").length;
      setStats({ total: updatedTotal, new: countNew });
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to update enquiry status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      window.location.href = "/admin/login";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "register-interest":
        return "Register Interest";
      case "contact":
        return "Contact Section";
      case "enquiry":
      default:
        return "Enquiry Modal";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#232323] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-[#EAE1D1] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A568] font-semibold block">
                PORTAL
              </span>
              <h1 className="font-serif text-xl sm:text-2xl font-normal text-[#0D5A46] tracking-tight">
                VANAE Admin
              </h1>
            </div>

            {/* Quick Metrics */}
            <div className="hidden sm:flex items-center space-x-4 border-l border-[#EAE1D1] pl-6">
              <div className="text-xs">
                <span className="text-[#736B63]">Total enquiries: </span>
                <span className="font-semibold text-[#232323]">
                  {stats.total}
                </span>
              </div>
              <div className="text-xs">
                <span className="text-[#736B63]">New enquiries: </span>
                <span className="font-semibold text-[#0D5A46] bg-[#0D5A46]/10 px-2 py-0.5 rounded">
                  {stats.new}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile metrics display */}
            <div className="sm:hidden text-right mr-1">
              <div className="text-[11px] text-[#736B63]">
                Total: <strong className="text-[#232323]">{stats.total}</strong> · New:{" "}
                <strong className="text-[#0D5A46]">{stats.new}</strong>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium text-[#736B63] hover:text-[#0D5A46] hover:bg-[#FAF7F2] border border-[#EAE1D1] rounded-lg transition-colors cursor-pointer"
            >
              {isLoggingOut ? "Exiting..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* Controls: Search & Status Filters */}
        <div className="bg-white border border-[#EAE1D1] rounded-xl p-4 sm:p-5 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="flex-1 max-w-md">
            <label className="sr-only">Search</label>
            <input
              type="text"
              placeholder="Search by visitor name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#EAE1D1] rounded-lg focus:border-[#0D5A46] focus:bg-white text-[#232323] outline-none transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-[#736B63] mr-1 hidden sm:inline">
              Status:
            </span>
            {["All", "New", "Contacted", "Closed"].map((s) => {
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${active
                    ? "bg-[#0D5A46] text-white"
                    : "bg-[#FAF7F2] text-[#736B63] hover:text-[#232323] border border-[#EAE1D1]"
                    }`}
                >
                  {s}
                </button>
              );
            })}

            <button
              onClick={() => fetchEnquiries()}
              className="px-3 py-1.5 text-xs text-[#736B63] hover:text-[#0D5A46] bg-[#FAF7F2] border border-[#EAE1D1] rounded-lg cursor-pointer ml-1"
              title="Refresh enquiries"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Feedback Alert States */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs sm:text-sm mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchEnquiries()}
              className="underline font-semibold ml-4 hover:text-rose-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Data Table Container */}
        <div className="bg-white border border-[#EAE1D1] rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs sm:text-sm text-[#736B63]">
              Loading enquiries...
            </div>
          ) : enquiries.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-serif text-lg text-[#0D5A46] mb-1">
                No enquiries found
              </p>
              <p className="text-xs text-[#736B63]">
                {searchTerm || statusFilter !== "All"
                  ? "Try adjusting your search criteria or status filter."
                  : "New website enquiries will appear here in real-time."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#EAE1D1] text-[#736B63] text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Visitor</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4 max-w-xs">Message / Context</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4 whitespace-nowrap">Submitted</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE1D1]">
                  {enquiries.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-[#FAF7F2]/50 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4 font-medium text-[#232323]">
                        {item.fullName}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-[#232323] whitespace-nowrap">
                        <a
                          href={`tel:${item.phone}`}
                          className="hover:text-[#0D5A46] hover:underline"
                        >
                          {item.phone}
                        </a>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-[#736B63]">
                        {item.email ? (
                          <a
                            href={`mailto:${item.email}`}
                            className="hover:text-[#0D5A46] hover:underline"
                          >
                            {item.email}
                          </a>
                        ) : (
                          <span className="text-[#A49A8E]">—</span>
                        )}
                      </td>

                      {/* Message */}
                      <td className="py-3.5 px-4 text-[#736B63] max-w-xs">
                        <span className="line-clamp-2" title={item.message}>
                          {item.message || (
                            <span className="text-[#A49A8E] italic">
                              No message provided
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#F0EBE1] text-[#44382D] border border-[#EAE1D1]">
                          {getSourceLabel(item.source)}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-[#736B63] whitespace-nowrap text-xs">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={item.status}
                          disabled={updatingId === item._id}
                          onChange={(e) =>
                            handleStatusChange(item._id, e.target.value)
                          }
                          className={`text-xs px-2.5 py-1 rounded font-medium border outline-none cursor-pointer transition-colors ${item.status === "New"
                            ? "bg-[#0D5A46]/10 text-[#0D5A46] border-[#0D5A46]/30"
                            : item.status === "Contacted"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : "bg-neutral-100 text-neutral-600 border-neutral-300"
                            } disabled:opacity-50`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-[#EAE1D1] bg-white py-4 text-center text-xs text-[#736B63]">
        VANAE Residences Administration Panel · Real-time MongoDB Atlas
      </footer>
    </div>
  );
}
