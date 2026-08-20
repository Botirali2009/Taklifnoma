"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Photo = { id: string; url: string };

export function PhotoGallery({ photos, alt }: { photos: Photo[]; alt: string }) {
  const [active, setActive] = useState<Photo | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo, index) => (
          <motion.button
            key={photo.id}
            type="button"
            data-reveal
            onClick={() => setActive(photo)}
            className="overflow-hidden rounded-xl"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={alt}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover transition duration-300 hover:scale-105"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src={active.url}
              alt={alt}
              className="max-h-full max-w-full rounded-xl object-contain"
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
