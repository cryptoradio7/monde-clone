"use client";

import { useEffect } from "react";

interface Props {
  slug: string;
}

export default function ViewTracker({ slug }: Props) {
  useEffect(() => {
    fetch(`/api/article/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
