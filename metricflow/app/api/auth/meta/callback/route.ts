import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const clientId = searchParams.get("state"); 

  if (!code || !clientId) {
    return NextResponse.json({ error: "Code d'autorisation manquant" }, { status: 400 });
  }

  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/meta/callback`;

  try {
    const tokenResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`);
    const tokenData = await tokenResponse.json();
    if (tokenData.error) throw new Error(tokenData.error.message);

    const longLivedResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${tokenData.access_token}`);
    const longLivedData = await longLivedResponse.json();
    if (longLivedData.error) throw new Error(longLivedData.error.message);

    // FIX RLS : On récupère ton cookie de session pour autoriser l'écriture
    const cookieStore = await cookies();
    const token = cookieStore.get('sb-metricflow-auth')?.value;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', 
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { error: dbError } = await supabase.from("agency_clients").update({ meta_access_token: longLivedData.access_token }).eq("id", clientId);
    if (dbError) throw new Error(dbError.message);

    return NextResponse.redirect(`${origin}/client/${clientId}`);

  } catch (error: any) {
    return NextResponse.json({ error: "Erreur critique : " + error.message }, { status: 500 });
  }
}