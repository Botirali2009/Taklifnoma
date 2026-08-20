"use client";

import { useState } from "react";
import {
  EventTypeChart,
  TrendChart,
  type EventTypePoint,
  type TrendPoint,
} from "./AdminCharts";

type Props = {
  trend: TrendPoint[];
  eventTypes: EventTypePoint[];
};

/**
 * Grafiklar + jadval ko'rinishi.
 * Ranglar yolg'iz ma'no tashimasligi uchun har grafik jadval bilan ham beriladi.
 */
export function AdminChartsSection({ trend, eventTypes }: Props) {
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-neutral-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-medium text-neutral-900">So&apos;nggi 30 kun</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Ro&apos;yxatdan o&apos;tish va taklifnoma yaratish tendensiyasi
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowTable((current) => !current)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            {showTable ? "Grafik" : "Jadval"}
          </button>
        </div>

        <div className="mt-6">
          {showTable ? (
            <div className="max-h-72 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-neutral-500">
                  <tr>
                    <th className="py-2 pr-4">Sana</th>
                    <th className="py-2 pr-4">Ro&apos;yxatdan o&apos;tganlar</th>
                    <th className="py-2">Taklifnomalar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {trend.map((point) => (
                    <tr key={point.date}>
                      <td className="py-2 pr-4 text-neutral-600">{point.date}</td>
                      <td className="py-2 pr-4 text-neutral-900">{point.users}</td>
                      <td className="py-2 text-neutral-900">{point.invitations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <TrendChart data={trend} />
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 p-6">
        <h2 className="font-medium text-neutral-900">Tadbir turlari bo&apos;yicha</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Barcha taklifnomalar taqsimoti
        </p>

        <div className="mt-6">
          <EventTypeChart data={eventTypes} />
        </div>
      </section>
    </div>
  );
}
