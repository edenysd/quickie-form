create type "public"."Survey Status" as enum ('open', 'closed');

create table "public"."Surveys" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "owner" uuid,
    "template_id" bigint,
    "survey_variant" "Survey Variants" default 'public_with_no_verification'::"Survey Variants",
    "survey_status" "Survey Status" default 'open'::"Survey Status"
);


alter table "public"."Surveys" enable row level security;

CREATE UNIQUE INDEX "Surveys_1_pkey" ON public."Surveys" USING btree (id);

alter table "public"."Surveys" add constraint "Surveys_1_pkey" PRIMARY KEY using index "Surveys_1_pkey";

alter table "public"."Surveys" add constraint "Surveys_1_owner_fkey" FOREIGN KEY (owner) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Surveys" validate constraint "Surveys_1_owner_fkey";

alter table "public"."Surveys" add constraint "Surveys_1_template_id_fkey" FOREIGN KEY (template_id) REFERENCES "Form_Templates"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Surveys" validate constraint "Surveys_1_template_id_fkey";

grant delete on table "public"."Surveys" to "anon";

grant insert on table "public"."Surveys" to "anon";

grant references on table "public"."Surveys" to "anon";

grant select on table "public"."Surveys" to "anon";

grant trigger on table "public"."Surveys" to "anon";

grant truncate on table "public"."Surveys" to "anon";

grant update on table "public"."Surveys" to "anon";

grant delete on table "public"."Surveys" to "authenticated";

grant insert on table "public"."Surveys" to "authenticated";

grant references on table "public"."Surveys" to "authenticated";

grant select on table "public"."Surveys" to "authenticated";

grant trigger on table "public"."Surveys" to "authenticated";

grant truncate on table "public"."Surveys" to "authenticated";

grant update on table "public"."Surveys" to "authenticated";

grant delete on table "public"."Surveys" to "service_role";

grant insert on table "public"."Surveys" to "service_role";

grant references on table "public"."Surveys" to "service_role";

grant select on table "public"."Surveys" to "service_role";

grant trigger on table "public"."Surveys" to "service_role";

grant truncate on table "public"."Surveys" to "service_role";

grant update on table "public"."Surveys" to "service_role";


