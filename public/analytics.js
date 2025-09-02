(function(){
	// Supabase 클라이언트는 HTML 파일에서 window.supabase로 먼저 초기화되어야 합니다.
	if (typeof supabase === 'undefined') {
		console.error('Supabase client is not available. Make sure to include it before analytics.js');
		return;
	}

	// --- 1. 초기 설정 (ID, 페이지 정보) ---
	let userId = localStorage.getItem('user_id');
	if (!userId) {
		userId = crypto.randomUUID();
		localStorage.setItem('user_id', userId);
	}
	const sessionId = crypto.randomUUID();
	const page = location.pathname.split('/').pop() || 'index.html';

	// GA4 gtag 함수가 없을 경우를 대비한 stub
	window.dataLayer = window.dataLayer || [];
	function gtag() { dataLayer.push(arguments); }

	// --- 2. 핵심 데이터 전송 함수 ---
	async function send(eventType, meta = {}) {
		const eventData = {
			// ts는 Supabase에서 자동으로 추가됩니다.
			event_type: eventType,
			page,
			session_id: sessionId,
			user_id: userId,
			meta
		};

		// 1) Supabase로 전송
		try {
			const { error } = await supabase.from('events').insert(eventData);
			if (error) console.error('Supabase tracking error:', error);
		} catch (e) {
			console.error('Supabase tracking failed', e);
		}

		// 2) GA4로 미러링 (선택 사항)
		try {
			const commonParams = { page_title: document.title, page_location: location.href, session_id: sessionId };
			let gaEventName = eventType;
			let gaParams = { ...commonParams, ...meta };

			if (eventType === 'section_dwell') {
				gaParams = { ...commonParams, section_times_json: JSON.stringify(meta.section_times || {}) };
			} else if (eventType === 'purchase') {
				gaParams = { ...commonParams, ...meta, value: 1, currency: 'KRW' };
			} else if (eventType === 'scroll') {
				gaParams = { ...commonParams, percent_scrolled: meta.max_scroll_pct };
			}

			gtag('event', gaEventName, gaParams);
		} catch (e) {
			console.error("GA4 tracking failed", e);
		}
	}

	// --- 3. 이벤트 트래킹 로직 ---

	// Page View
	const pageViewStartTime = Date.now();
	send('page_view');

	// Scroll Tracking
	let maxScrollPct = 0;
	const scrollHandler = () => {
		const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
		if (scrollableHeight <= 0) {
			maxScrollPct = 100;
			return;
		}
		const currentScroll = window.scrollY;
		const pct = Math.round((currentScroll / scrollableHeight) * 100);
		if (pct > maxScrollPct) {
			maxScrollPct = pct;
		}
	};
	window.addEventListener('scroll', scrollHandler, { passive: true });

	// Section Dwell Time Tracking
	const sectionTimes = {};
	let currentSection = null;
	let sectionStartTime = null;

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			const sectionName = entry.target.classList[0] || 'unknown-section';
			if (entry.isIntersecting) {
				if (currentSection && sectionStartTime) {
					sectionTimes[currentSection] = (sectionTimes[currentSection] || 0) + (Date.now() - sectionStartTime);
				}
				currentSection = sectionName;
				sectionStartTime = Date.now();
			} else if (entry.target.classList.contains(currentSection)) {
				if (sectionStartTime) {
					sectionTimes[currentSection] = (sectionTimes[currentSection] || 0) + (Date.now() - sectionStartTime);
				}
				currentSection = null;
				sectionStartTime = null;
			}
		});
	}, { threshold: 0.5 });

	document.querySelectorAll('.track-section').forEach(el => observer.observe(el));

	// Click Event Tracking (Add to Cart, Purchase)
	let cartAddTime = null;
	document.getElementById('add-cart')?.addEventListener('click', () => {
		cartAddTime = Date.now();
		send('add_to_cart');
	});

	document.getElementById('buy-now')?.addEventListener('click', () => {
		const meta = { source: cartAddTime ? 'cart' : 'direct' };
		if (cartAddTime) {
			meta.ms_since_cart = Date.now() - cartAddTime;
		}
		send('purchase', meta);
	});

	// Page Unload: 최종 데이터 전송
	// sendBeacon은 Supabase 인증 헤더를 쉽게 추가할 수 없어 안정적인 전송이 어렵습니다.
	// 대신, 페이지를 떠나기 직전 마지막 데이터를 동기적으로 전송하도록 시도합니다.
	window.addEventListener('pagehide', () => {
		if (currentSection && sectionStartTime) {
			sectionTimes[currentSection] = (sectionTimes[currentSection] || 0) + (Date.now() - sectionStartTime);
		}
		send('scroll', { max_scroll_pct: maxScrollPct, time_on_page_ms: Date.now() - pageViewStartTime });
		if (Object.keys(sectionTimes).length > 0) {
			send('section_dwell', { section_times: sectionTimes });
		}
	});
})();
