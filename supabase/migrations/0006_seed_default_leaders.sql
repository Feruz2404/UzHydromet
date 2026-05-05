-- 0006: Seed the 5 default leaders into public.leaders, ONLY if the table is empty.
--
-- Why this exists:
--   src/context/AdminContext.tsx switches between DB and the hardcoded
--   DEFAULT_LEADERS based on whether the leaders table has any rows:
--
--     leaders = (state.dbLeaders.length > 0 ? state.dbLeaders : DEFAULT_LEADERS)
--
--   So as long as the table is empty, the public site shows the hardcoded
--   leaders and the admin panel can't edit them. Seeding the 5 default
--   leaders into the DB unblocks editing without changing any code.
--
-- Idempotency:
--   Wrapped in a count check so re-running on a non-empty table is a no-op.
--   You can safely paste this SQL repeatedly without creating duplicates.
--
-- Prerequisite:
--   Run migration 0005_leaders_news_columns.sql first (or apply its SQL
--   manually) so every column referenced below exists.

do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.leaders;
  if v_count = 0 then
    insert into public.leaders (
      full_name,
      position,
      photo_url,
      reception_day,
      reception_time,
      phone,
      email,
      website_url,
      address,
      responsibilities,
      biography,
      sort_order,
      is_active
    )
    values
      (
        'Xabibullayev Sherzod Xabibullaxo''jayevich',
        'Agentlik direktori',
        null,
        'Payshanba',
        '11:00 - 13:00',
        '55 503 1222 (100)',
        'info@meteo.uz',
        'https://gov.uz/oz/hydromet',
        'Toshkent shahri, Yunusobod tumani, Osiyo ko''chasi, 72',
        null,
        null,
        1,
        true
      ),
      (
        'Karimov Ibratjon Alijonovich',
        'Agentlik direktori o''rinbosari',
        null,
        'Seshanba',
        '10:00 - 12:00',
        '78 150-86-35',
        'i.karimov@meteo.uz',
        'https://gov.uz/oz/hydromet',
        'Toshkent shahri, Yunusobod tumani, Osiyo ko''chasi, 72',
        null,
        null,
        2,
        true
      ),
      (
        'Vakant',
        'Direktorning raqamli texnologiyalarni rivojlantirish bo''yicha maslahatchisi',
        null,
        'Chorshanba',
        '10:00 - 12:00',
        '55-503-21-20 (103)',
        'sfi@meteo.uz',
        'https://gov.uz/oz/hydromet',
        'Toshkent shahri, Yunusobod tumani, Osiyo ko''chasi, 72',
        null,
        null,
        3,
        true
      ),
      (
        'Tashxodjayeva Nigora Baxtiyor qizi',
        'Direktorning axborot siyosati masalalari bo''yicha maslahatchisi — Matbuot kotibi',
        null,
        'Juma',
        '10:00 - 13:00',
        '55-503-21-20 (203)',
        'is@meteo.uz',
        'https://gov.uz/oz/hydromet',
        'Toshkent shahri, Yunusobod tumani, Osiyo ko''chasi, 72',
        null,
        null,
        4,
        true
      ),
      (
        'Kulumbetov Qudratjon Mamasharifovich',
        'Direktorning ma''naviy-ma''rifiy ishlar bo''yicha maslahatchisi',
        null,
        'Payshanba',
        '14:00 - 16:00',
        '55 503 1222',
        '',
        'https://gov.uz/oz/hydromet',
        'Toshkent shahri, Yunusobod tumani, Osiyo ko''chasi, 72',
        null,
        null,
        5,
        true
      );
  end if;
end
$$;

-- Make PostgREST refresh its cache.
notify pgrst, 'reload schema';
