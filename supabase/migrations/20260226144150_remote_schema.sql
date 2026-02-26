


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."crea_profilo_utente"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Specifichiamo public.profili per evitare ambiguità
    INSERT INTO public.profili (user_id, ruolo)
    VALUES (NEW.id, 'utente');
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."crea_profilo_utente"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."aziende" (
    "id_azienda" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "partita_iva" "text" NOT NULL,
    "nome_azienda" "text" NOT NULL,
    "indirizzo" "text",
    "comune" "text",
    "cap" "text",
    "provincia" "text",
    "regione" "text",
    "status_processo" "text" DEFAULT 'pending'::"text",
    "google_search_query" "text",
    "website_url" "text",
    "dati_contatto_raw" "jsonb",
    "email_target" "text",
    "email_generata_oggetto" "text",
    "email_generata_corpo" "text",
    "log_errori" "text",
    "last_processed_at" timestamp with time zone,
    "email_inviata" boolean DEFAULT false,
    "website_from_excel" "text",
    "descrizione_attivita" "text",
    "rna_data" "jsonb",
    "has_subsidy_2024" boolean,
    "contact_page_url" "text",
    "info_utili" "text",
    CONSTRAINT "aziende_status_processo_check" CHECK (("status_processo" = ANY (ARRAY['pending'::"text", 'processing'::"text", 'completed'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."aziende" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_next_batch_aziende"("batch_size" integer DEFAULT 5) RETURNS SETOF "public"."aziende"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  selected_ids BIGINT[];
BEGIN
  -- Seleziona gli ID da processare
  SELECT ARRAY(
    SELECT id_azienda FROM aziende
    WHERE status_processo = 'pending'
    ORDER BY id_azienda ASC
    FOR UPDATE SKIP LOCKED
    LIMIT batch_size
  ) INTO selected_ids;

  -- Segna subito come processing
  UPDATE aziende
  SET status_processo = 'processing'
  WHERE id_azienda = ANY(selected_ids);

  -- Restituisce le righe
  RETURN QUERY
  SELECT * FROM aziende
  WHERE id_azienda = ANY(selected_ids);
END;
$$;


ALTER FUNCTION "public"."get_next_batch_aziende"("batch_size" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_process_batch"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://rafqtnyehkwwnglovpkq.supabase.co/functions/v1/process-batch',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZnF0bnllaGt3d25nbG92cGtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAxMjY3MCwiZXhwIjoyMDg3NTg4NjcwfQ.lPRWtuC9capj87EWjilsHf8i-W2qXGc7yFZRrtAMVFU'
    ),
    body := '{}'::jsonb
  );
END;
$$;


ALTER FUNCTION "public"."trigger_process_batch"() OWNER TO "postgres";


ALTER TABLE "public"."aziende" ALTER COLUMN "id_azienda" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."aziende_id_azienda_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profili" (
    "user_id" "uuid" NOT NULL,
    "ruolo" "text" DEFAULT 'utente'::"text" NOT NULL,
    CONSTRAINT "profili_ruolo_check" CHECK (("ruolo" = ANY (ARRAY['utente'::"text", 'admin'::"text"])))
);


ALTER TABLE "public"."profili" OWNER TO "postgres";


ALTER TABLE ONLY "public"."aziende"
    ADD CONSTRAINT "aziende_pkey" PRIMARY KEY ("id_azienda");



ALTER TABLE ONLY "public"."aziende"
    ADD CONSTRAINT "aziende_user_id_partita_iva_key" UNIQUE ("user_id", "partita_iva");



ALTER TABLE ONLY "public"."profili"
    ADD CONSTRAINT "profili_pkey" PRIMARY KEY ("user_id");



CREATE INDEX "idx_piva_global" ON "public"."aziende" USING "btree" ("partita_iva");



CREATE INDEX "idx_queue_status" ON "public"."aziende" USING "btree" ("status_processo");



ALTER TABLE ONLY "public"."aziende"
    ADD CONSTRAINT "aziende_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profili"
    ADD CONSTRAINT "profili_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Delete aziende" ON "public"."aziende" FOR DELETE USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."profili"
  WHERE (("profili"."user_id" = "auth"."uid"()) AND ("profili"."ruolo" = 'admin'::"text"))))));



CREATE POLICY "Insert aziende" ON "public"."aziende" FOR INSERT WITH CHECK ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."profili"
  WHERE (("profili"."user_id" = "auth"."uid"()) AND ("profili"."ruolo" = 'admin'::"text"))))));



CREATE POLICY "Select aziende" ON "public"."aziende" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."profili"
  WHERE (("profili"."user_id" = "auth"."uid"()) AND ("profili"."ruolo" = 'admin'::"text"))))));



CREATE POLICY "Select profilo" ON "public"."profili" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Update aziende" ON "public"."aziende" FOR UPDATE USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."profili"
  WHERE (("profili"."user_id" = "auth"."uid"()) AND ("profili"."ruolo" = 'admin'::"text")))))) WITH CHECK ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."profili"
  WHERE (("profili"."user_id" = "auth"."uid"()) AND ("profili"."ruolo" = 'admin'::"text"))))));



CREATE POLICY "Update profilo solo admin" ON "public"."profili" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profili" "profili_1"
  WHERE (("profili_1"."user_id" = "auth"."uid"()) AND ("profili_1"."ruolo" = 'admin'::"text")))));



ALTER TABLE "public"."aziende" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profili" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."aziende";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."profili";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

















































































































































































GRANT ALL ON FUNCTION "public"."crea_profilo_utente"() TO "anon";
GRANT ALL ON FUNCTION "public"."crea_profilo_utente"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."crea_profilo_utente"() TO "service_role";



GRANT ALL ON TABLE "public"."aziende" TO "anon";
GRANT ALL ON TABLE "public"."aziende" TO "authenticated";
GRANT ALL ON TABLE "public"."aziende" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_next_batch_aziende"("batch_size" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_next_batch_aziende"("batch_size" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_next_batch_aziende"("batch_size" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_process_batch"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_process_batch"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_process_batch"() TO "service_role";
























GRANT ALL ON SEQUENCE "public"."aziende_id_azienda_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."aziende_id_azienda_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."aziende_id_azienda_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profili" TO "anon";
GRANT ALL ON TABLE "public"."profili" TO "authenticated";
GRANT ALL ON TABLE "public"."profili" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

create extension if not exists "pg_net" with schema "public";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.crea_profilo_utente();


