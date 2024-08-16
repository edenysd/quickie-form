alter table "public"."Survey_Summaries" alter column "updated_at" drop default;

alter table "public"."Surveys" add column "is_statistics_shared" boolean default false;


