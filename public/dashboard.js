// public/dashboard.js (이전 단계에서 드린 내용과 동일)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase 클라이언트는 이제 dashboard.html에서 초기화된 window.supabase를 사용합니다.
const supabase = window.supabase; 

// --- 데이터 로딩 및 분석 ---
async function loadAndRenderDashboard() {
    console.log("Fetching data from Supabase...");
    // window.supabase가 제대로 설정되지 않았다면 오류 메시지 표시
    if (!supabase) {
        document.getElementById('ab-results').innerHTML = '<tr><td colspan="4" style="color: red;">Supabase URL 또는 Key가 설정되지 않았습니다. 프로젝트 루트에 .env 파일을 올바르게 설정했는지 확인해주세요.</td></tr>';
        return;
    }

    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('ts', { ascending: false })
        .limit(10000);

    if (error) {
        console.error("Error fetching data:", error);
        return;
    }
    console.log(`Fetched ${events.length} events.`);

    // --- 1. KPI 계산 ---
    const pageViews = events.filter(e => e.event_type === 'page_view').length;
    const addToCarts = events.filter(e => e.event_type === 'add_to_cart').length;
    const purchases = events.filter(e => e.event_type === 'purchase').length;

    document.getElementById('page-views').textContent = pageViews;
    document.getElementById('add-to-cart').textContent = addToCarts;
    document.getElementById('purchases').textContent = purchases;

    // --- 2. A/B 테스트 결과 분석 ---
    const pageData = {};
    for (const event of events) {
        if (!event.page) continue;
        if (!pageData[event.page]) {
            pageData[event.page] = { pv: 0, purchases: 0 };
        }
        if (event.event_type === 'page_view') {
            pageData[event.page].pv++;
        }
        if (event.event_type === 'purchase') {
            pageData[event.page].purchases++;
        }
    }

    const abResultsTable = document.getElementById('ab-results');
    abResultsTable.innerHTML = ''; // Clear previous results
    for (const page in pageData) {
        const data = pageData[page];
        const conversionRate = data.pv > 0 ? ((data.purchases / data.pv) * 100).toFixed(2) : 0;
        const row = `<tr>
            <td>${page}</td>
            <td>${data.pv}</td>
            <td>${data.purchases}</td>
            <td>${conversionRate}%</td>
        </tr>`;
        abResultsTable.innerHTML += row;
    }
    
    // --- 3. 섹션별 체류시간 분석 (간단한 버전) ---
    const dwellEvents = events.filter(e => e.event_type === 'section_dwell' && e.meta?.section_times);
    const totalDwellTimes = {};
    for (const event of dwellEvents) {
        for (const [section, time] of Object.entries(event.meta.section_times)) {
            if (!totalDwellTimes[section]) totalDwellTimes[section] = 0;
            totalDwellTimes[section] += time;
        }
    }
    
    const sortedDwell = Object.entries(totalDwellTimes).sort((a, b) => b[1] - a[1]);
    renderBarChart('dwell-time-chart', '섹션별 총 체류 시간 (ms)', sortedDwell);
}

// --- 차트 렌더링 헬퍼 함수 ---
function renderBarChart(containerId, title, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let barsHtml = '';
    const maxValue = data.length > 0 ? data[0][1] : 0;

    for (const [label, value] of data) {
        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
        barsHtml += `
            <div class="bar-wrapper">
                <div class="bar-label">${label}</div>
                <div class="bar" style="width: ${percentage}%; background-color: #${Math.floor(Math.random()*16777215).toString(16)};">
                    ${value.toLocaleString()}
                </div>
            </div>
        `;
    }
    container.innerHTML = `<h4>${title}</h4><div class="chart">${barsHtml}</div>`;
}

// --- 대시보드 실행 ---
loadAndRenderDashboard();