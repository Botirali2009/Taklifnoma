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
      <section className="card-pad">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">So&apos;nggi 30 kun</h2>
            <p className="mt-1 text-sm text-ink-faint">
              Ro&apos;yxatdan o&apos;tish va taklifnoma yaratish tendensiyasi
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowTable((current) => !current)}
            className="btn-ghost btn-sm"
          >
            {showTable ? "Grafik" : "Jadval"}
          </button>
        </div>

        <div className="mt-6">
          {showTable ? (
            <div className="max-h-72 overflow-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Ro&apos;yxatdan o&apos;tganlar</th>
                    <th>Taklifnomalar</th>
                  </tr>
                </thead>
                <tbody>
                  {trend.map((point) => (
                    <tr key={point.date}>
                      <td className="text-ink-soft">{point.date}</td>
                      <td>{point.users}</td>
                      <td>{point.invitations}</td>
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

      <section className="card-pad">
        <h2 className="text-base font-semibold">Tadbir turlari bo&apos;yicha</h2>
        <p className="mt-1 text-sm text-ink-faint">
          Barcha taklifnomalar taqsimoti
        </p>

        <div className="mt-6">
          <EventTypeChart data={eventTypes} />
        </div>
      </section>
    </div>
  );
}
