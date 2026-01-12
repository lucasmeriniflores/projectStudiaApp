import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

type ReqBody = { email?: string; code?: string; newPassword?: string };

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

Deno.serve(async (req) => {
  try {
    const { email, code, newPassword }: ReqBody = await req.json().catch(() => ({} as any));
    if (!email || !code || !newPassword) {
      return new Response(JSON.stringify({ ok: false, error: "email, code e newPassword são obrigatórios" }), { status: 200 });
    }

    const { data: codeRow, error: codeErr } = await supabaseAdmin
      .from("public.password_reset_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (codeErr || !codeRow) {
      return new Response(JSON.stringify({ ok: false, error: "Código inválido ou expirado" }), { status: 200 });
    }

    // Usa Admin API para localizar usuário por email
    const users: string[] = [];
    let page = 1;
    const perPage = 1000;
    let foundUserId: string | null = null;
    while (!foundUserId) {
      const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (listErr) {
        return new Response(JSON.stringify({ ok: false, error: "Falha ao listar usuários" }), { status: 200 });
      }
      for (const u of list.users ?? []) {
        if (u.email?.toLowerCase() === email.toLowerCase()) {
          foundUserId = u.id;
          break;
        }
      }
      if (!list.users || list.users.length < perPage) break;
      page += 1;
      if (page > 10) break; // evita loop grande
    }
    if (!foundUserId) {
      return new Response(JSON.stringify({ ok: false, error: "Usuário não encontrado" }), { status: 200 });
    }

    const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(foundUserId, {
      password: newPassword,
    });

    if (updErr) {
      return new Response(JSON.stringify({ ok: false, error: "Não foi possível atualizar a senha" }), { status: 200 });
    }

    await supabaseAdmin
      .from("public.password_reset_codes")
      .update({ used: true })
      .eq("id", codeRow.id);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "erro" }), { status: 200 });
  }
});


