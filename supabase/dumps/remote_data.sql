SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict 5rHGzPhgft0RvXJZWtmFEBvYeE3zy7N62a2egPj4X8KhXtimcEzUEjhbfotyhmk

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."custom_oauth_providers" ("id", "provider_type", "identifier", "name", "client_id", "client_secret", "acceptable_client_ids", "scopes", "pkce_enabled", "attribute_mapping", "authorization_params", "enabled", "email_optional", "issuer", "discovery_url", "skip_nonce_check", "cached_discovery", "discovery_cached_at", "authorization_url", "token_url", "userinfo_url", "jwks_uri", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	17129c2d-6077-46a2-8ac0-947c923a55c1	authenticated	authenticated	tommasorebecchiyt@gmail.com	$2a$10$IJgU.FUH.zvmM/yhSkSiouvO1C00sF3S.rbGOjElJfFhyMAxDIfIO	2026-02-25 16:31:37.291144+00	\N		2026-02-25 16:31:19.382422+00		\N			\N	2026-02-26 13:54:35.367265+00	{"provider": "email", "providers": ["email"]}	{"sub": "17129c2d-6077-46a2-8ac0-947c923a55c1", "email": "tommasorebecchiyt@gmail.com", "email_verified": true, "phone_verified": false}	\N	2026-02-25 16:31:19.366332+00	2026-02-26 14:27:29.954913+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
17129c2d-6077-46a2-8ac0-947c923a55c1	17129c2d-6077-46a2-8ac0-947c923a55c1	{"sub": "17129c2d-6077-46a2-8ac0-947c923a55c1", "email": "tommasorebecchiyt@gmail.com", "email_verified": true, "phone_verified": false}	email	2026-02-25 16:31:19.376168+00	2026-02-25 16:31:19.37622+00	2026-02-25 16:31:19.37622+00	a2029eee-7038-44f1-a8f2-79d18abd72e0
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type", "token_endpoint_auth_method") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
baebdc76-ddb7-4f84-894e-e4a125a3dcfa	17129c2d-6077-46a2-8ac0-947c923a55c1	2026-02-26 09:59:50.640892+00	2026-02-26 13:28:21.961239+00	\N	aal1	\N	2026-02-26 13:28:21.961112	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	5.144.189.214	\N	\N	\N	\N	\N
c2dc0ab1-ca95-4e1f-8761-d8c58178e223	17129c2d-6077-46a2-8ac0-947c923a55c1	2026-02-26 13:54:35.368264+00	2026-02-26 13:54:35.368264+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	5.144.189.214	\N	\N	\N	\N	\N
9d4bafbd-4b88-446b-be09-a7ae917a4ce4	17129c2d-6077-46a2-8ac0-947c923a55c1	2026-02-25 16:31:37.297721+00	2026-02-26 14:27:29.967327+00	\N	aal1	\N	2026-02-26 14:27:29.967204	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	5.144.189.214	\N	\N	\N	\N	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
9d4bafbd-4b88-446b-be09-a7ae917a4ce4	2026-02-25 16:31:37.311469+00	2026-02-25 16:31:37.311469+00	otp	c7424d0d-4ba8-41ce-bd53-52535326cb3c
baebdc76-ddb7-4f84-894e-e4a125a3dcfa	2026-02-26 09:59:50.689227+00	2026-02-26 09:59:50.689227+00	password	8bcf4794-7b78-43f6-ad84-1560e483e02c
c2dc0ab1-ca95-4e1f-8761-d8c58178e223	2026-02-26 13:54:35.428186+00	2026-02-26 13:54:35.428186+00	password	4ff9646a-b792-4df6-964d-4dccc9bdd1da
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	1	kebwb3desjy7	17129c2d-6077-46a2-8ac0-947c923a55c1	t	2026-02-25 16:31:37.303438+00	2026-02-26 10:17:47.700176+00	\N	9d4bafbd-4b88-446b-be09-a7ae917a4ce4
00000000-0000-0000-0000-000000000000	3	o2ip2whnv4q6	17129c2d-6077-46a2-8ac0-947c923a55c1	t	2026-02-26 10:17:47.714743+00	2026-02-26 11:17:20.438485+00	kebwb3desjy7	9d4bafbd-4b88-446b-be09-a7ae917a4ce4
00000000-0000-0000-0000-000000000000	2	cbz4a6n3mvy6	17129c2d-6077-46a2-8ac0-947c923a55c1	t	2026-02-26 09:59:50.668551+00	2026-02-26 13:28:21.922116+00	\N	baebdc76-ddb7-4f84-894e-e4a125a3dcfa
00000000-0000-0000-0000-000000000000	5	gzj275sjkhpr	17129c2d-6077-46a2-8ac0-947c923a55c1	f	2026-02-26 13:28:21.939054+00	2026-02-26 13:28:21.939054+00	cbz4a6n3mvy6	baebdc76-ddb7-4f84-894e-e4a125a3dcfa
00000000-0000-0000-0000-000000000000	4	cnappvdlkpbe	17129c2d-6077-46a2-8ac0-947c923a55c1	t	2026-02-26 11:17:20.456103+00	2026-02-26 13:28:26.860045+00	o2ip2whnv4q6	9d4bafbd-4b88-446b-be09-a7ae917a4ce4
00000000-0000-0000-0000-000000000000	7	xje6f4jlmypg	17129c2d-6077-46a2-8ac0-947c923a55c1	f	2026-02-26 13:54:35.397958+00	2026-02-26 13:54:35.397958+00	\N	c2dc0ab1-ca95-4e1f-8761-d8c58178e223
00000000-0000-0000-0000-000000000000	6	iabqzhdptrjo	17129c2d-6077-46a2-8ac0-947c923a55c1	t	2026-02-26 13:28:26.861108+00	2026-02-26 14:27:29.92964+00	cnappvdlkpbe	9d4bafbd-4b88-446b-be09-a7ae917a4ce4
00000000-0000-0000-0000-000000000000	8	52cgmoxkg4nn	17129c2d-6077-46a2-8ac0-947c923a55c1	f	2026-02-26 14:27:29.948043+00	2026-02-26 14:27:29.948043+00	iabqzhdptrjo	9d4bafbd-4b88-446b-be09-a7ae917a4ce4
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: aziende; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."aziende" ("id_azienda", "user_id", "partita_iva", "nome_azienda", "indirizzo", "comune", "cap", "provincia", "regione", "status_processo", "google_search_query", "website_url", "dati_contatto_raw", "email_target", "email_generata_oggetto", "email_generata_corpo", "log_errori", "last_processed_at", "email_inviata", "website_from_excel", "descrizione_attivita", "rna_data", "has_subsidy_2024", "contact_page_url", "info_utili") FROM stdin;
19	17129c2d-6077-46a2-8ac0-947c923a55c1	00834510365	Euroknit S.r.l.	Via Lama 12	Carpi	41012	Modena	Emilia-Romagna	processing	\N	\N	\N	\N	\N	\N	\N	2026-02-26 14:22:00.797+00	f	\N	\N	\N	\N	\N	\N
20	17129c2d-6077-46a2-8ac0-947c923a55c1	02198760361	Carpi Fashion Group S.r.l.	Via Nuova Ponente 8	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:52:28.889+00	f	\N	\N	\N	\N	\N	\N
4	17129c2d-6077-46a2-8ac0-947c923a55c1	02614070362	Blauer S.p.A.	Via Peruzzi 7	Carpi	41012	Modena	Emilia-Romagna	processing	\N	\N	\N	\N	\N	\N	\N	2026-02-26 14:43:06.086+00	f	\N	\N	\N	\N	\N	\N
1	17129c2d-6077-46a2-8ac0-947c923a55c1	4021750361	Bonobo Studio	Str. Attiraglio 1/A	Modena	41022	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:47:55.084+00	f	\N	\N	\N	\N	\N	\N
2	17129c2d-6077-46a2-8ac0-947c923a55c1	02137900364	Penelope S.p.A.	Via Marx 92	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:47:56.644+00	f	\N	\N	\N	\N	\N	\N
3	17129c2d-6077-46a2-8ac0-947c923a55c1	01256360364	Fogs S.r.l.	Via Moglia 10	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:48:02.771+00	f	\N	\N	\N	\N	\N	\N
6	17129c2d-6077-46a2-8ac0-947c923a55c1	01643710365	Liu Jo S.p.A.	Via Copparo 1	Carpi	41012	Modena	Emilia-Romagna	processing	\N	\N	\N	\N	\N	\N	\N	2026-02-26 14:44:04.064+00	f	\N	\N	\N	\N	\N	\N
5	17129c2d-6077-46a2-8ac0-947c923a55c1	00681640363	Caleido Group S.p.A.	Via Industria 16	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:48:23.635+00	f	\N	\N	\N	\N	\N	\N
7	17129c2d-6077-46a2-8ac0-947c923a55c1	02461670361	Marville S.r.l.	Via Lama 44	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:48:25.614+00	f	\N	\N	\N	\N	\N	\N
8	17129c2d-6077-46a2-8ac0-947c923a55c1	01038550364	Sartoria Italiana S.r.l.	Via Cesare Battisti 18	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:48:28.524+00	f	\N	\N	\N	\N	\N	\N
9	17129c2d-6077-46a2-8ac0-947c923a55c1	02893040363	Ellesse Italia S.r.l.	Via Peruzzi 5	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:48:29.774+00	f	\N	\N	\N	\N	\N	\N
14	17129c2d-6077-46a2-8ac0-947c923a55c1	00912340362	Manifattura Corona S.r.l.	Via Cesare Battisti 30	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:50:58.517+00	f	\N	\N	\N	\N	\N	\N
15	17129c2d-6077-46a2-8ac0-947c923a55c1	02741880360	Knitware S.r.l.	Via dell'Industria 8	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:50:59.954+00	f	\N	\N	\N	\N	\N	\N
16	17129c2d-6077-46a2-8ac0-947c923a55c1	01589230364	Studio Commerciale Rossi e Associati	Piazza Martiri 12	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:52:30.465+00	f	\N	\N	\N	\N	\N	\N
17	17129c2d-6077-46a2-8ac0-947c923a55c1	02304110363	Carpitex S.r.l.	Via Remesina Interna 6	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:52:32.537+00	f	\N	\N	\N	\N	\N	\N
18	17129c2d-6077-46a2-8ac0-947c923a55c1	01765430362	Officine Meccaniche Carpi S.r.l.	Via Peruzzi 33	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:52:33.618+00	f	\N	\N	\N	\N	\N	\N
21	17129c2d-6077-46a2-8ac0-947c923a55c1	01456320363	Manifattura Emiliana S.r.l.	Via Industria 44	Carpi	41012	Modena	Emilia-Romagna	processing	\N	\N	\N	\N	\N	\N	\N	2026-02-26 14:38:13.32+00	f	\N	\N	\N	\N	\N	\N
10	17129c2d-6077-46a2-8ac0-947c923a55c1	01174230362	Modatex S.r.l.	Via Remesina Esterna 18	Carpi	41012	Modena	Emilia-Romagna	error	\N	\N	\N	\N	\N	\N	OpenRouter error: Provider returned error	2026-02-26 14:48:40.943+00	f	\N	\N	\N	\N	\N	\N
11	17129c2d-6077-46a2-8ac0-947c923a55c1	02015490368	Abifin S.r.l.	Via Berengario 7	Carpi	41012	Modena	Emilia-Romagna	processing	\N	\N	\N	\N	\N	\N	\N	2026-02-26 14:46:02.165+00	f	\N	\N	\N	\N	\N	\N
12	17129c2d-6077-46a2-8ac0-947c923a55c1	01327890361	Tessitura Monti S.r.l.	Via Guastalla 22	Carpi	41012	Modena	Emilia-Romagna	processing	\N	\N	\N	\N	\N	\N	\N	2026-02-26 14:46:03.201+00	f	\N	\N	\N	\N	\N	\N
13	17129c2d-6077-46a2-8ac0-947c923a55c1	03102450361	Carpidiem S.r.l.	Via Nuova Ponente 50	Carpi	41012	Modena	Emilia-Romagna	processing	\N	\N	\N	\N	\N	\N	\N	2026-02-26 14:46:06.267+00	f	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: profili; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."profili" ("user_id", "ruolo") FROM stdin;
17129c2d-6077-46a2-8ac0-947c923a55c1	utente
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 8, true);


--
-- Name: aziende_id_azienda_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."aziende_id_azienda_seq"', 21, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict 5rHGzPhgft0RvXJZWtmFEBvYeE3zy7N62a2egPj4X8KhXtimcEzUEjhbfotyhmk

RESET ALL;
