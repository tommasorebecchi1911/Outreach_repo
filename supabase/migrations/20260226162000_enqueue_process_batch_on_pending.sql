CREATE OR REPLACE FUNCTION "public"."enqueue_process_batch_on_pending_rows"() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM new_rows
    WHERE status_processo = 'pending'
  ) THEN
    BEGIN
      PERFORM public.trigger_process_batch();
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'trigger_process_batch failed: %', SQLERRM;
    END;
  END IF;

  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."enqueue_process_batch_on_pending_rows"() OWNER TO "postgres";


DROP TRIGGER IF EXISTS "aziende_enqueue_process_batch" ON "public"."aziende";
DROP TRIGGER IF EXISTS "aziende_enqueue_process_batch_after_insert" ON "public"."aziende";
DROP TRIGGER IF EXISTS "aziende_enqueue_process_batch_after_update" ON "public"."aziende";


CREATE TRIGGER "aziende_enqueue_process_batch_after_insert"
AFTER INSERT ON "public"."aziende"
REFERENCING NEW TABLE AS "new_rows"
FOR EACH STATEMENT
EXECUTE FUNCTION "public"."enqueue_process_batch_on_pending_rows"();


CREATE TRIGGER "aziende_enqueue_process_batch_after_update"
AFTER UPDATE ON "public"."aziende"
REFERENCING NEW TABLE AS "new_rows"
FOR EACH STATEMENT
EXECUTE FUNCTION "public"."enqueue_process_batch_on_pending_rows"();


GRANT ALL ON FUNCTION "public"."enqueue_process_batch_on_pending_rows"() TO "anon";
GRANT ALL ON FUNCTION "public"."enqueue_process_batch_on_pending_rows"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enqueue_process_batch_on_pending_rows"() TO "service_role";
