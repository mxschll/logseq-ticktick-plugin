import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Redis } from "https://deno.land/x/upstash_redis/mod.ts";
import { Ratelimit } from "https://cdn.skypack.dev/@upstash/ratelimit@latest"

const TICKTICK_AUTH_URL = "https://ticktick.com/oauth/token"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const redis = new Redis({
    url: Deno.env.get("UPSTASH_REDIS_REST_URL"),
    token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN"),
  })

  const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, "30 s"),
  });

  const ip = "any"
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new Response(
      JSON.stringify({ error: "rate_limit_exceeded", error_description: "Rate limit exceeded" }),
      { status: 429, headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      } },
    )
  }

  const { client_id, client_secret, code, redirect_uri } = await req.json()

  if (!client_id || !client_secret || !code || !redirect_uri) {
    return new Response(
      JSON.stringify({ error: "missing_parameter", error_description: "Missing parameter: client_id, client_secret, code, redirect_uri" }),
      { status: 400, headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      } },
    )
  }

  const response = await fetch(TICKTICK_AUTH_URL, {
    method: "POST",
    body: new URLSearchParams({
      client_id,
      client_secret,
      code,
      redirect_uri,
      grant_type: "authorization_code",
    }),
  })

  if(!response.ok) {
    return new Response(
      JSON.stringify({ error: "unauthorized", error_description: "Unauthorized" }),
      { status: 400, headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      } },
    )
  }

  return new Response(
    JSON.stringify(await response.json()),
    { status: 200, headers: 
      { "Content-Type": "application/json",
      ...corsHeaders
    } },
  )
})