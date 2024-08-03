create policy "Enable select for authenticated users when has no owner"
on "public"."Form_Templates"
as permissive
for select
to authenticated
using (((owner IS NULL) AND (status <> 'draft'::"Form Status")));