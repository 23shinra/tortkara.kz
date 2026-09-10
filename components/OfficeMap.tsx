"use client";

import { useEffect, useId } from "react";
import { company } from "@/lib/company";

type Props = {
  openLabel: string;
  mapLabel: string;
};

type DgMap = {
  remove: () => void;
  on: (event: string, handler: () => void) => void;
};

type DgApi = {
  then: (callback: () => void) => void;
  map: (
    id: string,
    opts: { center: [number, number]; zoom: number; scrollWheelZoom?: boolean },
  ) => DgMap;
  marker: (coords: [number, number]) => { addTo: (map: DgMap) => void };
};

declare global {
  interface Window {
    DG?: DgApi;
  }
}

const SCRIPT_ID = "dg-maps-loader";
const SCRIPT_SRC = "https://maps.api.2gis.ru/2.0/loader.js?pkg=full";

function load2Gis(): Promise<void> {
  return new Promise((resolve, reject) => {
    const ready = () => {
      if (!window.DG) {
        reject(new Error("2GIS unavailable"));
        return;
      }
      window.DG.then(() => resolve());
    };

    if (document.getElementById(SCRIPT_ID)) {
      ready();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = ready;
    script.onerror = () => reject(new Error("2GIS load failed"));
    document.head.appendChild(script);
  });
}

export function OfficeMap({ openLabel, mapLabel }: Props) {
  const mapId = useId().replace(/:/g, "");

  useEffect(() => {
    let map: DgMap | null = null;
    let cancelled = false;

    load2Gis()
      .then(() => {
        if (cancelled || !window.DG || !document.getElementById(mapId)) return;

        const { mapLat, mapLng, mapZoom, mapUrl } = company;
        map = window.DG.map(mapId, {
          center: [mapLat, mapLng],
          zoom: mapZoom,
          scrollWheelZoom: false,
        });

        window.DG.marker([mapLat, mapLng]).addTo(map);
        map.on("click", () => window.open(mapUrl, "_blank", "noopener,noreferrer"));
      })
      .catch(() => {
        // Link below still opens 2GIS if the embed fails to load.
      });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [mapId]);

  return (
    <div className="mt-4 overflow-hidden border border-line bg-bg-elevated">
      <div
        id={mapId}
        role="img"
        aria-label={mapLabel}
        className="aspect-[4/3] w-full min-h-[220px] cursor-pointer bg-bg-soft"
      />
      <div className="border-t border-line px-3 py-2">
        <a
          href={company.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted hover:text-accent"
        >
          {openLabel}
        </a>
      </div>
    </div>
  );
}
