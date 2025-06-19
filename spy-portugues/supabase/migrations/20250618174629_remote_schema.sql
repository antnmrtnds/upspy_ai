create table "public"."ads" (
    "id" uuid not null default uuid_generate_v4(),
    "competitor_id" uuid,
    "user_id" uuid,
    "platform" text not null,
    "ad_id" text,
    "creative_url" text,
    "creative_type" text,
    "ad_copy" text,
    "headline" text,
    "call_to_action" text,
    "target_audience" jsonb,
    "estimated_spend_eur" numeric(10,2),
    "impressions" integer,
    "engagement_rate" numeric(5,2),
    "first_seen_at" timestamp with time zone,
    "last_seen_at" timestamp with time zone,
    "is_active" boolean default true,
    "regions" text[],
    "property_types" text[],
    "price_mentioned" text,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."ads" enable row level security;

create table "public"."alert_rules" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "name" text not null,
    "type" text,
    "conditions" jsonb not null,
    "is_active" boolean default true,
    "notification_methods" text[] default '{email}'::text[],
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."competitors" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "name" text not null,
    "description" text,
    "website" text,
    "facebook_url" text,
    "instagram_url" text,
    "tiktok_url" text,
    "logo_url" text,
    "regions" text[] default '{}'::text[],
    "property_types" text[] default '{}'::text[],
    "is_active" boolean default true,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."competitors" enable row level security;

create table "public"."content" (
    "id" uuid not null default uuid_generate_v4(),
    "competitor_id" uuid,
    "user_id" uuid,
    "platform" text not null,
    "post_id" text,
    "post_url" text,
    "media_url" text,
    "media_type" text,
    "caption" text,
    "hashtags" text[],
    "likes" integer default 0,
    "comments" integer default 0,
    "shares" integer default 0,
    "views" integer default 0,
    "engagement_rate" numeric(5,2),
    "posted_at" timestamp with time zone,
    "regions" text[],
    "property_types" text[],
    "performance_score" integer,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."content" enable row level security;

create table "public"."notifications" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "type" text not null,
    "title" text not null,
    "message" text,
    "payload" jsonb default '{}'::jsonb,
    "is_read" boolean default false,
    "sent_via" text,
    "sent_at" timestamp with time zone,
    "created_at" timestamp with time zone default now()
);


alter table "public"."notifications" enable row level security;

create table "public"."prices" (
    "id" uuid not null default uuid_generate_v4(),
    "competitor_id" uuid,
    "user_id" uuid,
    "source_type" text,
    "source_id" uuid,
    "property_type" text,
    "region" text,
    "price_eur" numeric(12,2),
    "price_per_sqm_eur" numeric(8,2),
    "property_size_sqm" integer,
    "price_context" text,
    "detected_at" timestamp with time zone default now(),
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now()
);


alter table "public"."prices" enable row level security;

create table "public"."profiles" (
    "id" uuid not null default uuid_generate_v4(),
    "clerk_user_id" text not null,
    "email" text,
    "full_name" text,
    "role" text default 'user'::text,
    "preferences" jsonb default '{}'::jsonb,
    "subscription_tier" text default 'free'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."profiles" enable row level security;

CREATE INDEX ads_competitor_id_idx ON public.ads USING btree (competitor_id);

CREATE INDEX ads_first_seen_at_idx ON public.ads USING btree (first_seen_at);

CREATE INDEX ads_is_active_idx ON public.ads USING btree (is_active);

CREATE UNIQUE INDEX ads_pkey ON public.ads USING btree (id);

CREATE INDEX ads_platform_idx ON public.ads USING btree (platform);

CREATE INDEX ads_user_id_idx ON public.ads USING btree (user_id);

CREATE INDEX alert_rules_is_active_idx ON public.alert_rules USING btree (is_active);

CREATE UNIQUE INDEX alert_rules_pkey ON public.alert_rules USING btree (id);

CREATE INDEX alert_rules_type_idx ON public.alert_rules USING btree (type);

CREATE INDEX alert_rules_user_id_idx ON public.alert_rules USING btree (user_id);

CREATE UNIQUE INDEX competitors_pkey ON public.competitors USING btree (id);

CREATE INDEX competitors_property_types_idx ON public.competitors USING gin (property_types);

CREATE INDEX competitors_regions_idx ON public.competitors USING gin (regions);

CREATE INDEX competitors_user_id_idx ON public.competitors USING btree (user_id);

CREATE INDEX content_competitor_id_idx ON public.content USING btree (competitor_id);

CREATE INDEX content_performance_score_idx ON public.content USING btree (performance_score);

CREATE UNIQUE INDEX content_pkey ON public.content USING btree (id);

CREATE INDEX content_platform_idx ON public.content USING btree (platform);

CREATE INDEX content_posted_at_idx ON public.content USING btree (posted_at);

CREATE INDEX content_user_id_idx ON public.content USING btree (user_id);

CREATE INDEX notifications_created_at_idx ON public.notifications USING btree (created_at);

CREATE INDEX notifications_is_read_idx ON public.notifications USING btree (is_read);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE INDEX notifications_type_idx ON public.notifications USING btree (type);

CREATE INDEX notifications_user_id_idx ON public.notifications USING btree (user_id);

CREATE INDEX prices_competitor_id_idx ON public.prices USING btree (competitor_id);

CREATE INDEX prices_detected_at_idx ON public.prices USING btree (detected_at);

CREATE UNIQUE INDEX prices_pkey ON public.prices USING btree (id);

CREATE INDEX prices_property_type_idx ON public.prices USING btree (property_type);

CREATE INDEX prices_region_idx ON public.prices USING btree (region);

CREATE INDEX prices_user_id_idx ON public.prices USING btree (user_id);

CREATE INDEX profiles_clerk_user_id_idx ON public.profiles USING btree (clerk_user_id);

CREATE UNIQUE INDEX profiles_clerk_user_id_key ON public.profiles USING btree (clerk_user_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."ads" add constraint "ads_pkey" PRIMARY KEY using index "ads_pkey";

alter table "public"."alert_rules" add constraint "alert_rules_pkey" PRIMARY KEY using index "alert_rules_pkey";

alter table "public"."competitors" add constraint "competitors_pkey" PRIMARY KEY using index "competitors_pkey";

alter table "public"."content" add constraint "content_pkey" PRIMARY KEY using index "content_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."prices" add constraint "prices_pkey" PRIMARY KEY using index "prices_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."ads" add constraint "ads_competitor_id_fkey" FOREIGN KEY (competitor_id) REFERENCES competitors(id) ON DELETE CASCADE not valid;

alter table "public"."ads" validate constraint "ads_competitor_id_fkey";

alter table "public"."ads" add constraint "ads_creative_type_check" CHECK ((creative_type = ANY (ARRAY['image'::text, 'video'::text, 'carousel'::text]))) not valid;

alter table "public"."ads" validate constraint "ads_creative_type_check";

alter table "public"."ads" add constraint "ads_platform_check" CHECK ((platform = ANY (ARRAY['facebook'::text, 'instagram'::text]))) not valid;

alter table "public"."ads" validate constraint "ads_platform_check";

alter table "public"."ads" add constraint "ads_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."ads" validate constraint "ads_user_id_fkey";

alter table "public"."alert_rules" add constraint "alert_rules_type_check" CHECK ((type = ANY (ARRAY['new_ads'::text, 'price_changes'::text, 'trending_content'::text]))) not valid;

alter table "public"."alert_rules" validate constraint "alert_rules_type_check";

alter table "public"."alert_rules" add constraint "alert_rules_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."alert_rules" validate constraint "alert_rules_user_id_fkey";

alter table "public"."competitors" add constraint "competitors_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."competitors" validate constraint "competitors_user_id_fkey";

alter table "public"."content" add constraint "content_competitor_id_fkey" FOREIGN KEY (competitor_id) REFERENCES competitors(id) ON DELETE CASCADE not valid;

alter table "public"."content" validate constraint "content_competitor_id_fkey";

alter table "public"."content" add constraint "content_media_type_check" CHECK ((media_type = ANY (ARRAY['image'::text, 'video'::text, 'reel'::text, 'story'::text]))) not valid;

alter table "public"."content" validate constraint "content_media_type_check";

alter table "public"."content" add constraint "content_platform_check" CHECK ((platform = ANY (ARRAY['tiktok'::text, 'instagram'::text]))) not valid;

alter table "public"."content" validate constraint "content_platform_check";

alter table "public"."content" add constraint "content_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."content" validate constraint "content_user_id_fkey";

alter table "public"."notifications" add constraint "notifications_sent_via_check" CHECK ((sent_via = ANY (ARRAY['email'::text, 'in_app'::text, 'both'::text]))) not valid;

alter table "public"."notifications" validate constraint "notifications_sent_via_check";

alter table "public"."notifications" add constraint "notifications_type_check" CHECK ((type = ANY (ARRAY['new_competitor'::text, 'new_ad'::text, 'price_change'::text, 'trending_content'::text, 'weekly_summary'::text]))) not valid;

alter table "public"."notifications" validate constraint "notifications_type_check";

alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

alter table "public"."prices" add constraint "prices_competitor_id_fkey" FOREIGN KEY (competitor_id) REFERENCES competitors(id) ON DELETE CASCADE not valid;

alter table "public"."prices" validate constraint "prices_competitor_id_fkey";

alter table "public"."prices" add constraint "prices_source_type_check" CHECK ((source_type = ANY (ARRAY['ad'::text, 'content'::text, 'website'::text]))) not valid;

alter table "public"."prices" validate constraint "prices_source_type_check";

alter table "public"."prices" add constraint "prices_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."prices" validate constraint "prices_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_clerk_user_id_key" UNIQUE using index "profiles_clerk_user_id_key";

alter table "public"."profiles" add constraint "profiles_role_check" CHECK ((role = ANY (ARRAY['user'::text, 'admin'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_role_check";

alter table "public"."profiles" add constraint "profiles_subscription_tier_check" CHECK ((subscription_tier = ANY (ARRAY['free'::text, 'pro'::text, 'enterprise'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_subscription_tier_check";

grant delete on table "public"."ads" to "anon";

grant insert on table "public"."ads" to "anon";

grant references on table "public"."ads" to "anon";

grant select on table "public"."ads" to "anon";

grant trigger on table "public"."ads" to "anon";

grant truncate on table "public"."ads" to "anon";

grant update on table "public"."ads" to "anon";

grant delete on table "public"."ads" to "authenticated";

grant insert on table "public"."ads" to "authenticated";

grant references on table "public"."ads" to "authenticated";

grant select on table "public"."ads" to "authenticated";

grant trigger on table "public"."ads" to "authenticated";

grant truncate on table "public"."ads" to "authenticated";

grant update on table "public"."ads" to "authenticated";

grant delete on table "public"."ads" to "service_role";

grant insert on table "public"."ads" to "service_role";

grant references on table "public"."ads" to "service_role";

grant select on table "public"."ads" to "service_role";

grant trigger on table "public"."ads" to "service_role";

grant truncate on table "public"."ads" to "service_role";

grant update on table "public"."ads" to "service_role";

grant delete on table "public"."alert_rules" to "anon";

grant insert on table "public"."alert_rules" to "anon";

grant references on table "public"."alert_rules" to "anon";

grant select on table "public"."alert_rules" to "anon";

grant trigger on table "public"."alert_rules" to "anon";

grant truncate on table "public"."alert_rules" to "anon";

grant update on table "public"."alert_rules" to "anon";

grant delete on table "public"."alert_rules" to "authenticated";

grant insert on table "public"."alert_rules" to "authenticated";

grant references on table "public"."alert_rules" to "authenticated";

grant select on table "public"."alert_rules" to "authenticated";

grant trigger on table "public"."alert_rules" to "authenticated";

grant truncate on table "public"."alert_rules" to "authenticated";

grant update on table "public"."alert_rules" to "authenticated";

grant delete on table "public"."alert_rules" to "service_role";

grant insert on table "public"."alert_rules" to "service_role";

grant references on table "public"."alert_rules" to "service_role";

grant select on table "public"."alert_rules" to "service_role";

grant trigger on table "public"."alert_rules" to "service_role";

grant truncate on table "public"."alert_rules" to "service_role";

grant update on table "public"."alert_rules" to "service_role";

grant delete on table "public"."competitors" to "anon";

grant insert on table "public"."competitors" to "anon";

grant references on table "public"."competitors" to "anon";

grant select on table "public"."competitors" to "anon";

grant trigger on table "public"."competitors" to "anon";

grant truncate on table "public"."competitors" to "anon";

grant update on table "public"."competitors" to "anon";

grant delete on table "public"."competitors" to "authenticated";

grant insert on table "public"."competitors" to "authenticated";

grant references on table "public"."competitors" to "authenticated";

grant select on table "public"."competitors" to "authenticated";

grant trigger on table "public"."competitors" to "authenticated";

grant truncate on table "public"."competitors" to "authenticated";

grant update on table "public"."competitors" to "authenticated";

grant delete on table "public"."competitors" to "service_role";

grant insert on table "public"."competitors" to "service_role";

grant references on table "public"."competitors" to "service_role";

grant select on table "public"."competitors" to "service_role";

grant trigger on table "public"."competitors" to "service_role";

grant truncate on table "public"."competitors" to "service_role";

grant update on table "public"."competitors" to "service_role";

grant delete on table "public"."content" to "anon";

grant insert on table "public"."content" to "anon";

grant references on table "public"."content" to "anon";

grant select on table "public"."content" to "anon";

grant trigger on table "public"."content" to "anon";

grant truncate on table "public"."content" to "anon";

grant update on table "public"."content" to "anon";

grant delete on table "public"."content" to "authenticated";

grant insert on table "public"."content" to "authenticated";

grant references on table "public"."content" to "authenticated";

grant select on table "public"."content" to "authenticated";

grant trigger on table "public"."content" to "authenticated";

grant truncate on table "public"."content" to "authenticated";

grant update on table "public"."content" to "authenticated";

grant delete on table "public"."content" to "service_role";

grant insert on table "public"."content" to "service_role";

grant references on table "public"."content" to "service_role";

grant select on table "public"."content" to "service_role";

grant trigger on table "public"."content" to "service_role";

grant truncate on table "public"."content" to "service_role";

grant update on table "public"."content" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."prices" to "anon";

grant insert on table "public"."prices" to "anon";

grant references on table "public"."prices" to "anon";

grant select on table "public"."prices" to "anon";

grant trigger on table "public"."prices" to "anon";

grant truncate on table "public"."prices" to "anon";

grant update on table "public"."prices" to "anon";

grant delete on table "public"."prices" to "authenticated";

grant insert on table "public"."prices" to "authenticated";

grant references on table "public"."prices" to "authenticated";

grant select on table "public"."prices" to "authenticated";

grant trigger on table "public"."prices" to "authenticated";

grant truncate on table "public"."prices" to "authenticated";

grant update on table "public"."prices" to "authenticated";

grant delete on table "public"."prices" to "service_role";

grant insert on table "public"."prices" to "service_role";

grant references on table "public"."prices" to "service_role";

grant select on table "public"."prices" to "service_role";

grant trigger on table "public"."prices" to "service_role";

grant truncate on table "public"."prices" to "service_role";

grant update on table "public"."prices" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "System can delete ads"
on "public"."ads"
as permissive
for delete
to public
using (true);


create policy "System can insert ads"
on "public"."ads"
as permissive
for insert
to public
with check (true);


create policy "System can update ads"
on "public"."ads"
as permissive
for update
to public
using (true)
with check (true);


create policy "Users can view ads from own competitors"
on "public"."ads"
as permissive
for select
to public
using ((competitor_id IN ( SELECT competitors.id
   FROM competitors
  WHERE (competitors.user_id = ( SELECT profiles.id
           FROM profiles
          WHERE (profiles.clerk_user_id = (auth.jwt() ->> 'sub'::text)))))));


create policy "Users can delete own competitors"
on "public"."competitors"
as permissive
for delete
to public
using ((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.clerk_user_id = (auth.jwt() ->> 'sub'::text)))));


create policy "Users can insert own competitors"
on "public"."competitors"
as permissive
for insert
to public
with check ((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.clerk_user_id = (auth.jwt() ->> 'sub'::text)))));


create policy "Users can update own competitors"
on "public"."competitors"
as permissive
for update
to public
using ((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.clerk_user_id = (auth.jwt() ->> 'sub'::text)))))
with check ((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.clerk_user_id = (auth.jwt() ->> 'sub'::text)))));


create policy "Users can view own competitors"
on "public"."competitors"
as permissive
for select
to public
using ((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.clerk_user_id = (auth.jwt() ->> 'sub'::text)))));


create policy "System can delete content"
on "public"."content"
as permissive
for delete
to public
using (true);


create policy "System can insert content"
on "public"."content"
as permissive
for insert
to public
with check (true);


create policy "System can update content"
on "public"."content"
as permissive
for update
to public
using (true)
with check (true);


create policy "Users can view content from own competitors"
on "public"."content"
as permissive
for select
to public
using ((competitor_id IN ( SELECT competitors.id
   FROM competitors
  WHERE (competitors.user_id = ( SELECT profiles.id
           FROM profiles
          WHERE (profiles.clerk_user_id = (auth.jwt() ->> 'sub'::text)))))));


create policy "System can insert notifications"
on "public"."notifications"
as permissive
for insert
to public
with check (true);


create policy "Users can delete own notifications"
on "public"."notifications"
as permissive
for delete
to public
using ((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.clerk_user_id = (auth.jwt() ->> 'sub'::text)))));


create policy "Users can update own notifications"
on "public"."notifications"
as permissive
for update
to public
using ((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.clerk_user_id = (auth.jwt() ->> 'sub'::text)))))
with check ((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.clerk_user_id = (auth.jwt() ->> 'sub'::text)))));


create policy "Users can view own notifications"
on "public"."notifications"
as permissive
for select
to public
using ((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.clerk_user_id = (auth.jwt() ->> 'sub'::text)))));


create policy "System can delete prices"
on "public"."prices"
as permissive
for delete
to public
using (true);


create policy "System can insert prices"
on "public"."prices"
as permissive
for insert
to public
with check (true);


create policy "System can update prices"
on "public"."prices"
as permissive
for update
to public
using (true)
with check (true);


create policy "Users can view prices from own competitors"
on "public"."prices"
as permissive
for select
to public
using ((competitor_id IN ( SELECT competitors.id
   FROM competitors
  WHERE (competitors.user_id = ( SELECT profiles.id
           FROM profiles
          WHERE (profiles.clerk_user_id = (auth.jwt() ->> 'sub'::text)))))));


create policy "Users can delete own profile"
on "public"."profiles"
as permissive
for delete
to public
using ((clerk_user_id = (auth.jwt() ->> 'sub'::text)));


create policy "Users can insert own profile"
on "public"."profiles"
as permissive
for insert
to public
with check ((clerk_user_id = (auth.jwt() ->> 'sub'::text)));


create policy "Users can update own profile"
on "public"."profiles"
as permissive
for update
to public
using ((clerk_user_id = (auth.jwt() ->> 'sub'::text)))
with check ((clerk_user_id = (auth.jwt() ->> 'sub'::text)));


create policy "Users can view own profile"
on "public"."profiles"
as permissive
for select
to public
using ((clerk_user_id = (auth.jwt() ->> 'sub'::text)));



