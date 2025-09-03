
import { createClient } from '@supabase/supabase-js';

// 사용자님의 Supabase 정보를 코드에 직접 입력합니다.
const SUPABASE_URL = 'https://eweoumauqncfdrqybyjz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZW91bWF1cW5jZmRycXlieWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAxNjgsImV4cCI6MjA3MjI1NjE2OH0.pt_XspiK-ZjnegWpq0gnuGrLnBvk41i1ZWYhePMgwwc';

// 키가 있는지 확인합니다.
if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Supabase URL or Key is not set directly in the script.");
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function simulate() {
    console.log("🌱 Deleting old data from Supabase...");
    // 테이블의 모든 데이터를 삭제합니다.
    const { error: deleteError } = await supabase.from('events').delete().gt('id', 0);
    if (deleteError) {
        console.error("❌ Error deleting old data:", deleteError);
        return;
    }

    console.log("🌱 Seeding Supabase with new story-driven data...");
    const events = [];
    const now = new Date();
    const days = 14;

    for (let d = days; d > 0; d--) {
        const day = new Date(now);
        day.setDate(now.getDate() - d);

        const pv_a = random(60, 120);
        const pv_b = random(90, 180);

        for (const [page, pv] of Object.entries({ "version-a.html": pv_a, "version-b.html": pv_b })) {
            for (let i = 0; i < pv; i++) {
                const visitTime = new Date(day);
                visitTime.setHours(random(9, 21), random(0, 59));
                const sess = `${page.replace('.html', '')}-${d}-${i}-${random(1000, 9999)}`;

                events.push({ event_type: "page_view", page, session_id: sess, ts: visitTime.toISOString(), meta: { referrer: "google" } });

                let time_on_page_ms, max_scroll, section_times, add_cart_p, purchase_p;
                if (page === "version-a.html") {
                    time_on_page_ms = random(8000, 90000); max_scroll = random(30, 90);
                    section_times = { "hero": 3000, "images": 2000, "detail": 10000, "reviews": 5000 };
                    [add_cart_p, purchase_p] = [0.35, 0.15];
                } else {
                    time_on_page_ms = random(20000, 240000); max_scroll = random(50, 100);
                    section_times = { "hero": 4000, "images": 20000, "detail": 5000, "reviews": 2000 };
                    [add_cart_p, purchase_p] = [0.28, 0.09];
                }

                const exitTime = new Date(visitTime.getTime() + time_on_page_ms);
                events.push({ event_type: "scroll", page, session_id: sess, ts: exitTime.toISOString(), meta: { max_scroll_pct: max_scroll, time_on_page_ms } });
                events.push({ event_type: "section_dwell", page, session_id: sess, ts: exitTime.toISOString(), meta: { section_times } });

                if (Math.random() < purchase_p) {
                    const purchaseTime = new Date(visitTime.getTime() + random(5, 60) * 60 * 1000);
                    events.push({ event_type: "purchase", page, session_id: sess, ts: purchaseTime.toISOString(), meta: { source: "direct" } });
                }
            }
        }
    }

    const { error } = await supabase.from('events').insert(events);
    if (error) {
        console.error("❌ Error seeding data:", error);
    } else {
        console.log(`✅ Seed complete. ${events.length} events inserted.`);
    }
}

simulate();