#!/usr/bin/env bash
# Migration yaratish (interaktiv bo'lmagan muhit uchun).
#
# `prisma migrate dev` ba'zi ogohlantirishlarda tasdiq so'raydi va CI/cloud
# muhitida ishlamaydi. Bu skript o'sha ishni interaktivsiz bajaradi:
#   1. schema va mavjud migrationlar farqidan SQL generatsiya qiladi
#   2. yangi migration papkasiga yozadi
#   3. bazaga qo'llaydi (migrate deploy)
#
# Foydalanish: ./scripts/create-migration.sh <migration_nomi>
# Kerak: SHADOW_DATABASE_URL (bo'sh, vaqtinchalik baza)
set -euo pipefail

NAME="${1:?migration nomini kiriting: ./scripts/create-migration.sh add_something}"
SHADOW="${SHADOW_DATABASE_URL:?SHADOW_DATABASE_URL kerak - bosh vaqtinchalik baza}"

DIR="prisma/migrations/$(date -u +%Y%m%d%H%M%S)_${NAME}"
mkdir -p "$DIR"

SHADOW_DATABASE_URL="$SHADOW" npx prisma migrate diff \
  --from-migrations ./prisma/migrations \
  --to-schema ./prisma/schema.prisma \
  --script > "$DIR/migration.sql"

if [ ! -s "$DIR/migration.sql" ]; then
  echo "O'zgarish yo'q — migration yaratilmadi."
  rmdir "$DIR"
  exit 0
fi

npx prisma migrate deploy
npx prisma generate
echo "Migration yaratildi: $DIR"
