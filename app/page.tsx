"use client";

import { useState, useEffect, Suspense } from "react";
import { dummyClaims } from "@/utils/data";
import { Claim } from "@/types";
import DataTable from "@/components/DataTable";

function DataTableWrapper() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClaims(dummyClaims);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return <DataTable data={claims} loading={loading} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <DataTableWrapper />
    </Suspense>
  );
}
