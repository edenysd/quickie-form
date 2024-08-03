drop type "public"."Publish Type";

alter table "public"."Form_Templates" add constraint "Form_Templates_owner_fkey" FOREIGN KEY (owner) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Form_Templates" validate constraint "Form_Templates_owner_fkey";


