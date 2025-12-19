"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Claim, ClaimStatus, SortField, SortConfig } from "@/types";
import { getUserColor, STATUS_OPTIONS } from "@/utils/data";
import {
  FiArrowUp,
  FiArrowDown,
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
  FiSearch,
  FiLoader,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import InsuranceTypeBadge from "@/components/InsuranceTypeBadge";
import PMSSyncStatusBadge from "@/components/PMSSyncStatusBadge";

interface DataTableProps {
  data: Claim[];
  loading?: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 20, 25, 50];

export default function DataTable({ data, loading = false }: DataTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "">(
    (searchParams.get("status") as ClaimStatus) || "",
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: (searchParams.get("sortField") as SortField) || null,
    direction: (searchParams.get("sortDir") as "asc" | "desc") || "asc",
  });
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("pageSize")) || 20,
  );
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Update URL when filters change
  const updateUrl = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname;

      router.push(newUrl, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput);
        setCurrentPage(1);
        updateUrl({ search: searchInput || null, page: null });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, updateUrl]);

  // Sync URL when status filter changes
  const handleStatusChange = (value: ClaimStatus | "") => {
    setStatusFilter(value);
    setCurrentPage(1);
    updateUrl({ status: value || null, page: null });
  };

  // Sync URL when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl({ page: page > 1 ? String(page) : null });
  };

  // Sync URL when page size changes
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    updateUrl({
      pageSize: newSize !== 20 ? String(newSize) : null,
      page: null,
    });
  };

  // Sync URL when sort changes
  const handleSort = (field: SortField) => {
    const newDirection =
      sortConfig.field === field && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ field, direction: newDirection });
    updateUrl({
      sortField: field,
      sortDir: newDirection,
    });
  };

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter((claim) => {
      const fullName =
        `${claim.patientFirstName} ${claim.patientLastName}`.toLowerCase();
      const matchesSearch =
        searchQuery === "" || fullName.includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "" || claim.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.field) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortConfig.field) {
        case "patientLastName":
          aValue = `${a.patientLastName} ${a.patientFirstName}`.toLowerCase();
          bValue = `${b.patientLastName} ${b.patientFirstName}`.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "serviceDate":
          aValue = new Date(a.serviceDate).getTime();
          bValue = new Date(b.serviceDate).getTime();
          break;
        case "lastUpdated":
          aValue = new Date(a.lastUpdated).getTime();
          bValue = new Date(b.lastUpdated).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return null;
    }
    return sortConfig.direction === "asc" ? (
      <FiArrowUp className="ml-1 h-4 w-4" aria-hidden="true" />
    ) : (
      <FiArrowDown className="ml-1 h-4 w-4" aria-hidden="true" />
    );
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy URL to clipboard");
    }
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setStatusFilter("");
    setCurrentPage(1);
    setSortConfig({ field: null, direction: "asc" });
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "";

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium">Search</label>
              <input
                type="text"
                placeholder="Search by patient name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-64">
              <label className="mb-1.5 block text-sm font-medium">Status</label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  handleStatusChange(e.target.value as ClaimStatus | "")
                }
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset + Copy */}
            <div className="flex w-full items-center gap-2 lg:w-auto">
              <button
                onClick={handleResetFilters}
                disabled={!hasActiveFilters || loading}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 lg:flex-none"
              >
                Reset All Filters
              </button>
              <div className="relative">
                <button
                  onClick={handleCopyUrl}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  disabled={loading}
                  className={`rounded-lg border bg-white p-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    copied
                      ? "border-green-500 text-green-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-label="Copy URL to easily share filtered results"
                >
                  {copied ? (
                    <FiCheck className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <FiCopy className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
                {showTooltip && !copied && (
                  <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium whitespace-nowrap text-white shadow-lg">
                    Copy URL to easily share filtered results
                    <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
                {copied && (
                  <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium whitespace-nowrap text-white shadow-lg">
                    Copied!
                    <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 border-4 border-transparent border-t-green-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-gray-200 bg-white py-20">
          <FiLoader
            className="h-10 w-10 animate-spin text-blue-600"
            aria-hidden="true"
          />
          <p className="mt-4">Loading claims...</p>
        </div>
      ) : data.length === 0 ? (
        /* Empty state (different from no results) */
        /* Won't actually get rendered, but in case there was no data at all */
        <div>No claims found</div>
      ) : sortedData.length === 0 ? (
        /* No results after filter */
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-gray-200 bg-white py-20">
          <FiSearch className="h-16 w-16 text-gray-300" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-medium">No matching claims</h3>
          <p className="mt-1">Try adjusting your search or filter criteria.</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Table Container */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-sm text-[#545866]">
                    <th className="px-4 py-5 leading-none font-normal">
                      <button
                        onClick={() => handleSort("patientLastName")}
                        className="flex cursor-pointer items-center whitespace-nowrap"
                      >
                        Patient
                        {getSortIcon("patientLastName")}
                      </button>
                    </th>
                    <th className="px-2 py-5 leading-none font-normal">
                      <button
                        onClick={() => handleSort("serviceDate")}
                        className="flex cursor-pointer items-center whitespace-nowrap"
                      >
                        Service Date
                        {getSortIcon("serviceDate")}
                      </button>
                    </th>
                    <th className="px-2 py-5 leading-none font-normal">
                      Insurance Carrier
                    </th>
                    <th className="px-2 py-5 text-left leading-none font-normal">
                      Amount
                    </th>
                    <th className="px-2 py-5 text-left leading-none font-normal">
                      <button
                        onClick={() => handleSort("status")}
                        className="flex cursor-pointer items-center"
                      >
                        Status
                        {getSortIcon("status")}
                      </button>
                    </th>
                    <th className="px-2 py-5 text-left leading-none font-normal">
                      <button
                        onClick={() => handleSort("lastUpdated")}
                        className="flex cursor-pointer items-center whitespace-nowrap"
                      >
                        Last Updated
                        {getSortIcon("lastUpdated")}
                      </button>
                    </th>
                    <th className="px-1 py-5 leading-none font-normal">User</th>
                    <th className="px-2 py-5 text-left leading-none font-normal">
                      Date Sent
                    </th>
                    <th className="px-2 py-5 text-left leading-none font-normal">
                      Date Sent Orig
                    </th>
                    <th className="px-2 py-5 text-left leading-none font-normal">
                      PMS Sync Status
                    </th>
                    <th className="px-2 py-5 text-left leading-none font-normal">
                      Provider
                    </th>
                  </tr>
                </thead>
                {/* Table rows */}
                <tbody className="divide-y divide-gray-100 bg-white text-xs">
                  {paginatedData.map((claim) => (
                    <tr
                      key={claim.id}
                      className="text-[#112A24] hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>
                            {claim.patientFirstName} {claim.patientLastName}
                          </span>
                          <span className="text-xs text-[#B3B3B3]">
                            ID: {claim.patientId}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap">
                        {claim.serviceDate}
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs">
                            {claim.insuranceCarrier}
                          </span>
                          <InsuranceTypeBadge type={claim.insuranceType} />
                        </div>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        $
                        {claim.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {claim.status}
                      </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>
                            {claim.lastUpdated.split(" ").slice(0, 3).join(" ")}
                          </span>
                          <span className="text-xs text-gray-500">
                            {claim.lastUpdated.split(" ").slice(3).join(" ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap">
                        <span
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${getUserColor(claim.user)}`}
                        >
                          {claim.user}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap">
                        {claim.dateSent}
                      </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap">
                        {claim.dateSentOrig}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <PMSSyncStatusBadge
                          status={claim.pmsSyncStatus}
                          statusModified={claim.pmsSyncStatusModified}
                        />
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {claim.providerFirstName} {claim.providerLastName}
                          </span>
                          <span className="text-gray-400">
                            {claim.providerId}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-5">
              <div className="flex flex-col items-center gap-1 lg:flex-row lg:gap-2">
                <span className="text-sm">Rows per page</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col items-center gap-1 lg:flex-row lg:gap-4">
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="rounded border border-gray-300 p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="First page"
                  >
                    <FiChevronsLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded border border-gray-300 p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded border border-gray-300 p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Next page"
                  >
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="rounded border border-gray-300 p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Last page"
                  >
                    <FiChevronsRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
