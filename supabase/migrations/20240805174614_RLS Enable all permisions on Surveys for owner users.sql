create policy "Enable all for owner users"
on "public"."Surveys"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = owner))
with check ((( SELECT auth.uid() AS uid) = owner));



