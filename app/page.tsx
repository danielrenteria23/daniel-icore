"use client";

import { useState, useEffect } from "react";
import { dummyClaims } from "@/utils/data";
import { Claim } from "@/types";
import DataTable from "@/components/DataTable";

export default function Home() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setClaims(dummyClaims);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return <DataTable data={claims} loading={loading} />;
}
