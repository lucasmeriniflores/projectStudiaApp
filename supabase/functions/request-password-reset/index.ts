import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";
import { Resend } from "npm:resend@3.4.0";

type ReqBody = { email?: string };

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL")!;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const resend = new Resend(RESEND_API_KEY);

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

Deno.serve(async (req) => {
  try {
    const { email }: ReqBody = await req.json().catch(() => ({} as any));
    if (!email) {
      return new Response(JSON.stringify({ ok: false, error: "email é obrigatório" }), { status: 200 });
    }

    // Evita consultar auth.users via PostgREST (pode falhar). Mantemos resposta genérica.

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertErr } = await supabaseAdmin
      .from("public.password_reset_codes")
      .insert({ email, code, expires_at: expiresAt, used: false });

    if (insertErr) {
      return new Response(JSON.stringify({ ok: false, error: "erro ao gerar código" }), { status: 200 });
    }

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Código de recuperação de senha",
        text: `Seu código de recuperação é: ${code}\nEle expira em 10 minutos.`,
      });
    } catch (_e) {
      // Não quebra o fluxo: código já foi gerado. Informe ok=false.
      return new Response(JSON.stringify({ ok: false, error: "falha ao enviar email" }), { status: 200 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "erro" }), { status: 200 });
  }
});


