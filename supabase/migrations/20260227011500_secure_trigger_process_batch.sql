create or replace function public.trigger_process_batch()
returns void
language plpgsql
security definer
as $$
declare
  supabase_url text := current_setting('app.settings.supabase_url', true);
  service_role_key text := current_setting('app.settings.service_role_key', true);
begin
  if coalesce(supabase_url, '') = '' or coalesce(service_role_key, '') = '' then
    raise warning 'Missing app.settings.supabase_url or app.settings.service_role_key';
    return;
  end if;

  perform net.http_post(
    url := supabase_url || '/functions/v1/process-batch',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := '{}'::jsonb
  );
end;
$$;
