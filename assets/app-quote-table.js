function renderHoldingEditRow(e,o,a={}){const l=holdingId(e),n=holdingInputState?.lotId||newHoldingLotId();return`
    <tr class="holding-row holding-edit-row ${e.userAdded?"user-holding-row":""}" data-holding-id="${esc(l)}" data-lot-id="${esc(n)}" title="${esc(e.key)} 보유 정보 입력">
      <td class="rownum">${o}</td>
      <td class="left holding-cell" colspan="3">
        <div class="holding-inline" data-holding-id="${esc(l)}" data-lot-id="${esc(n)}" data-after-lot-id="${esc(holdingInputState?.afterLotId||"")}" data-key="${esc(e.key)}">
          <input data-holding-avg type="text" inputmode="decimal" autocomplete="off" placeholder="평단가" value="${esc(holdingInputValue(a.avg))}" aria-label="평단가" />
          <input data-holding-qty type="text" inputmode="decimal" autocomplete="off" placeholder="수량" value="${esc(holdingInputValue(a.qty))}" aria-label="수량" />
          <button type="button" data-action="save-holding-inline" data-holding-id="${esc(l)}" data-lot-id="${esc(n)}" data-key="${esc(e.key)}">저장</button>
          <button type="button" class="inline-cancel" data-action="cancel-holding-inline" title="취소" aria-label="취소">×</button>
          <span class="holding-inline-invested" data-holding-invested aria-live="polite">${holdingInvestedLabel(a.avg,a.qty)}</span>
        </div>
      </td>
    </tr>`}document.addEventListener("input",e=>{const o=e.target;if(!o||!(o.matches&&o.matches("[data-holding-avg],[data-holding-qty]")))return;const a=o.closest(".holding-inline");if(!a)return;const l=a.querySelector("[data-holding-invested]");!l||typeof holdingInvestedLabel!="function"||(l.textContent=holdingInvestedLabel(a.querySelector("[data-holding-avg]")&&a.querySelector("[data-holding-avg]").value,a.querySelector("[data-holding-qty]")&&a.querySelector("[data-holding-qty]").value))});function renderHoldingLotRow(e,o,a,l,n){const i=holdingId(e),s=holdingDisplayCalc(e,a);if(!s)return"";const d=holdingModeMetric(s),c=cls(d.pct),r=cls(d.pnl),p=d.unavailable?"-":signedHoldingPlainAmountText(d.pnl,s.currency),y=d.unavailable?"-":signedPctOne(d.pct),v=n>1?`보유 ${l+1} · `:"",w=Number.isFinite(Number(s.dayPnl))?` · 일일 손익 ${signedHoldingAmountText(s.dayPnl,s.currency)}`:"";return`
    <tr class="holding-row holding-lot-row${`${l===0?" holding-lot-first":""}${l===n-1?" holding-lot-last":""}`} ${e.userAdded?"user-holding-row":""}" data-holding-id="${esc(i)}" data-lot-id="${esc(a.lotId)}" title="${esc(v)}평가액 ${holdingSummaryMoneyText(s.value,s.currency)} · 원금 ${holdingSummaryMoneyText(s.invested,s.currency)} · 누적 손익 ${signedHoldingSummaryMoneyText(s.pnl,s.currency)}${w} · 구매가격 ${holdingSummaryMoneyText(s.avg,s.currency)} · 수량 ${num(s.qty)}">
      <td class="rownum">${o}</td>
      <td class="left holding-cell holding-meta-cell">
        ${holdingLotMetaHtml(s,l,n,e)}
        <span class="holding-row-actions">
          <button class="holding-row-add holding-row-edit" data-action="edit-holding-lot" data-holding-id="${esc(i)}" data-lot-id="${esc(a.lotId)}" data-key="${esc(e.key)}" title="${esc(e.key)} 보유 정보 수정" aria-label="보유 정보 수정">수정</button>
          <button class="holding-row-add" data-action="add-holding-lot" data-holding-id="${esc(i)}" data-lot-id="${esc(a.lotId)}" data-key="${esc(e.key)}" title="${esc(e.key)} 보유 행 추가" aria-label="보유 행 추가">추가</button>
          ${typeof featureEnabled=="function"&&featureEnabled("averagingDownCalc")?`<button class="holding-row-add holding-row-mulmul" data-action="mulmul-holding" data-holding-id="${esc(i)}" data-lot-id="${esc(a.lotId)}" data-key="${esc(e.key)}" title="${esc(e.key)} 물타기 계산기" aria-label="물타기 계산기">물타기</button>`:""}
          <button class="holding-row-add holding-row-del" data-action="clear-holding" data-holding-id="${esc(i)}" data-lot-id="${esc(a.lotId)}" data-key="${esc(e.key)}" title="${esc(e.key)} 보유 정보 삭제" aria-label="보유 정보 삭제">삭제</button>
        </span>
      </td>
      <td class="right holding-value-cell ${r}">${esc(p)}</td>
      <td class="right holding-return-cell ${c}">${esc(y)}</td>
    </tr>`}function renderHoldingRows(e,o){if(!canHoldCard(e))return{html:"",count:0};const a=holdingId(e),l=holdingInputState&&holdingInputState.id===a;if(typeof holdingInfoVisible=="function"&&!holdingInfoVisible()&&!l)return{html:"",count:0};const n=holdingLotsForId(a),i=[];let s=o,d=!1;const c=(r={})=>{i.push(renderHoldingEditRow(e,s++,r)),d=!0};return l&&!n.length?c({}):(n.forEach((r,p)=>{l&&holdingInputState.lotId===r.lotId&&!holdingInputState.isNew?c(r):i.push(renderHoldingLotRow(e,s++,r,p,n.length)),l&&holdingInputState.isNew&&holdingInputState.afterLotId===r.lotId&&c({})}),l&&holdingInputState.isNew&&!d&&c({})),{html:i.join(""),count:s-o}}function renderHoldingsEmptyRow(e){return`
    <tr class="holding-empty-row">
      <td class="rownum">${e}</td>
      <td class="left holding-empty-cell" colspan="3">
        <span class="holding-empty-title">등록된 보유종목이 없습니다.</span>
        <span class="holding-empty-copy">종목 이름에 마우스를 올려 <b>₩</b> 버튼을 누르면 보유수량과 평단가를 입력할 수 있어요!</span>
      </td>
    </tr>`}function renderCashEditRow(e,o){const a=String(e.cashId||""),l=normalizeCashPositionMarket(e.market),n=normalizeCashPositionCurrency(e.cashCurrency,l),i=Number(e.cashAmount)>0?cashAmountText(e.cashAmount,n):"",s=normalizeCashLabel(e.key)||cashPositionDefaultLabel({market:l,currency:n});return`
    <tr class="holding-row cash-row cash-edit-row" data-cash-id="${esc(a)}" title="현금 정보 입력">
      <td class="rownum">${o}</td>
      <td class="left holding-cell" colspan="3">
        <div class="holding-inline cash-inline" data-cash-id="${esc(a)}">
          <input data-cash-label type="text" autocomplete="off" placeholder="현금" value="${esc(s)}" aria-label="현금 이름" />
          <input data-cash-amount type="text" inputmode="decimal" autocomplete="off" placeholder="금액" value="${esc(i)}" aria-label="현금 금액" />
          <select data-cash-currency aria-label="통화">
            <option value="KRW"${n==="KRW"?" selected":""}>KRW</option>
            <option value="USD"${n==="USD"?" selected":""}>USD</option>
          </select>
          <button type="button" data-action="save-cash-inline" data-cash-id="${esc(a)}">저장</button>
          <button type="button" class="inline-cancel" data-action="cancel-cash-inline" title="취소" aria-label="취소">×</button>
        </div>
      </td>
    </tr>`}function renderCashDisplayRow(e,o,a,l,n){const i=String(e.cashId||"");if(cashInputState&&cashInputState.id===i)return renderCashEditRow(e,o);const s=quoteRowOrderId(e),d=` data-row-order-id="${esc(s)}"`,c=` class="rownum quote-row-handle" data-row-order-id="${esc(s)}" title="행번호를 끌어서 순서 변경" aria-label="${esc(e.key)} 순서 변경"`,r=`<button class="row-move" data-action="move-default" data-dir="up" data-order-id="${esc(s)}" title="${esc(e.key)} 위로 이동" aria-label="위로 이동" ${a===l?"disabled":""}>▲</button><button class="row-move" data-action="move-default" data-dir="down" data-order-id="${esc(s)}" title="${esc(e.key)} 아래로 이동" aria-label="아래로 이동" ${a===n?"disabled":""}>▼</button>`,p=`<button class="row-holding is-set" data-action="edit-cash-row" data-cash-id="${esc(i)}" title="${esc(e.key)} 현금 수정" aria-label="현금 수정">₩</button>`,y=`<button class="row-x" data-action="remove-cash-row" data-cash-id="${esc(i)}" title="${esc(e.key)} 삭제" aria-label="삭제">×</button>`,v=`<span class="row-actions">${p}${r}${y}</span>`,w=normalizeCashPositionCurrency(e.cashCurrency,e.market),I=`${esc(e.market||"")} · ${esc(w)} 현금 · ${fmtDt(e.asOf)}`;return`
    <tr class="cash-row"${d} data-cash-id="${esc(i)}" data-outlook-badge="" data-outlook-tone="" title="${I}">
      <td${c}>${o}</td>
      <td class="left"><div class="metric-cell"><span class="metric-label">${esc(e.key)}</span><span class="metric-trail quote-action-trail">${v}${sourcePillHtml(e)}</span></div></td>
      <td class="right quote-price-cell">${cashAmountHtml(e.cashAmount,w)}</td>
      <td class="right flat quote-change-cell"><span class="flat">-</span></td>
    </tr>`}function shouldRenderUsDayQuoteNotice(e,o){if(!sessionHas(o,"US_DAY"))return!1;const a=String(typeof currentRenderedMarket=="string"?currentRenderedMarket:"").toUpperCase(),l=String(typeof selected=="string"?selected:"").toUpperCase();return a==="US"||l==="US"?!0:Array.isArray(e)&&e.some(n=>String(n?.market||"").toUpperCase()==="US")}function renderUsDayQuoteNoticeRow(e){return`
    <tr class="us-day-quote-notice-row">
      <td class="rownum">${e}</td>
      <td class="left us-day-quote-notice-cell" colspan="3">미장 데이장은 자동 갱신 시세 미지원. 차트를 열었을 때만 현재가가 보입니다.</td>
    </tr>`}function hlProxyBadgeHtml(e){if(!e?._hlProxy)return"";const o=e._hlTooltip||"HL/Binance 주식 퍼프 기반 24시간 참고 시세입니다.";return`<span class="hl-proxy-badge" tabindex="0" data-hl-tooltip="${esc(o)}" aria-label="${esc(o)}"><span class="hl-proxy-moon" aria-hidden="true">☾</span><span>HL 24h</span></span>`}function hlProxyHeaderRowHtml(e){return`
    <tr class="hl-proxy-header-row">
      <td class="rownum">${e}</td>
      <td class="left hl-proxy-header-cell" colspan="3"><span class="hl-proxy-header-title">HyperLiquid 24시간 시세</span><span class="hl-proxy-header-sub">— 장 종료 후에만 표시됩니다</span><span class="hl-proxy-info" tabindex="0" role="button" aria-label="이게 뭔가요? — 설명 보기">i</span></td>
    </tr>`}function hlProxyRowClass(e){if(!e?._hlProxy)return"";const o=String(e._hlQuality||"normal").toLowerCase().replace(/[^a-z0-9_-]/g,"")||"normal",a=String(e._hlStatus||"idle").toLowerCase().replace(/[^a-z0-9_-]/g,"")||"idle";return` hl-proxy-row hl-proxy-quality-${o} hl-proxy-status-${a}`}function cardRenderedCells(e){let o,a,l,n=null;if(e._momentum!==void 0&&e._momentum!==null)o='<span class="flat">-</span>',a=pct(e._momentum),l=cls(e._momentum),n=e._momentum;else if(e.sign&&e.priceUnit){const i=displayPriceUnit(e);o=e.price==null?'<span class="flat">-</span>':`${quotePriceNumberText(e.price,"",i,e.priceUnit)}${esc(i)}`,a='<span class="flat">-</span>',l="flat"}else{o=isRateOnlyCard(e.key)?"&nbsp;":cardPriceDisplayHtml(e);const i=changeValueFor(e);a=`<span class="change-wrap"><span>${shouldRenderChangeSessionTag(e)?`<span class="flat" title="본장 외 세션 표시">${esc(e.sessionTag)}</span>`:pct(i)}</span></span>`,l=cls(i),n=i}return{priceCell:o,changeCell:a,changeClass:l,previewChangeValue:n,changeTitle:changeCellTitle(e,n)}}function shouldRenderChangeSessionTag(e){return!e?.sessionTag||changeWindow!=="day"?!1:String(e.market||"").toUpperCase()==="KR"?String(e.source||"").toUpperCase().includes("NXT"):!0}function flowPillsHtml(e){return(e||[]).map(o=>{const a=Number(o.amount),l=o.amount!==null&&o.amount!==void 0&&Number.isFinite(a);return`<span class="flow-pill ${l?cls(a):"flat"}"><span class="flow-label">${esc(o.label)}</span><span>${esc(l?`${a>0?"+":""}${num(a)}억`:"-")}</span></span>`}).join('<span class="flat">/</span>')}function renderCardsTable(e,o){const a=typeof holdingInfoVisible!="function"||holdingInfoVisible();a||(e=e.filter(t=>!t?._cashRow));const l=holdingsQuoteViewActive();try{document.getElementById("cardsTable")?.classList.toggle("holdings-view",l)}catch{}const n=`
    <tr>
      <th class="rownum"></th>
      <th class="colhead">A</th><th class="colhead">B</th><th class="colhead">C</th>
    </tr>
    <tr>
      <th class="rownum">1</th>
      <th class="subhead">지표</th><th class="subhead">현재가</th><th class="subhead">${changeHeaderLabel()}</th>
    </tr>`,i=e.map((t,$)=>!t._hlProxy&&!t._hlHeader&&!t._noteRow&&!t._cashRow&&!t.userAdded&&!MOOD_PROTECTED_KEYS.has(t.key)?$:-1).filter(t=>t>=0),s=e.map((t,$)=>!t._hlProxy&&!t._hlHeader&&!t._noteRow&&!MOOD_PROTECTED_KEYS.has(t.key)?$:-1).filter(t=>t>=0),d=s[0],c=s[s.length-1];lastRenderedDefaultOrderIds=i.map(t=>cardOrderId(e[t])),lastRenderedQuoteOrderIds=e.filter(t=>!t?._hlProxy&&!t?._hlHeader).map(quoteRowOrderId);let r=2,p="";shouldRenderUsDayQuoteNotice(e,o)&&(p+=renderUsDayQuoteNoticeRow(r++)),a&&l&&!e.length?p=renderHoldingsEmptyRow(r++):p+=e.map((t,$)=>{const b=r++;if(t._hlHeader)return hlProxyHeaderRowHtml(b);if(t._noteRow){const u=String(t.noteId||""),g=quoteRowOrderId(t),h=String(t.text||""),m=` data-row-order-id="${esc(g)}"`,k=` class="rownum quote-row-handle" data-row-order-id="${esc(g)}" title="행번호를 끌어서 순서 변경" aria-label="메모 행 순서 변경"`;return`
    <tr class="quote-note-row"${m} data-note-id="${esc(u)}">
      <td${k}>${b}</td>
      <td class="left quote-note-cell" colspan="3">
        <div class="quote-note-inner">
          <div class="quote-note-content" contenteditable="true" role="textbox" spellcheck="false" data-note-id="${esc(u)}" data-placeholder="예: 장투 / 단타 / 관심만">${esc(h)}</div>
          <button class="row-x quote-note-remove" data-action="remove-note-row" data-note-id="${esc(u)}" title="빈 행 삭제" aria-label="빈 행 삭제">×</button>
        </div>
      </td>
    </tr>`}if(t._cashRow)return renderCashDisplayRow(t,b,$,d,c);const _=!!t.userAdded,F=_&&t.error?" error":"",z=_?userCardLink(t):defaultCardLink(t),A=typeof normalizeTextUrl=="function"?normalizeTextUrl(z):null,D=A?A.toString():"",W=D?`<a href="${esc(D)}" target="_blank" rel="noopener">${esc(t.key)}</a>`:esc(t.key);if(t._flows){const u=Array.isArray(t._flowsKosdaq)&&t._flowsKosdaq.length>0,g=`<span class="row-actions flow-row-actions"><button class="row-x" data-action="hide-default" data-key="${esc(t.key)}" title="수급 행 숨기기" aria-label="수급 행 숨기기">×</button></span>`,h=(m,k,x,q)=>{const S=x?`<span class="flow-market-tag">${esc(x)}</span>`:"",P=q?` data-outlook-badge="${esc(outlookBadgeText(t))}" data-outlook-tone="${esc(outlookBadgeTone(t))}"`:"",rt=q?outlookFlowPreviewHtml(t):"";return`
    <tr class="mood-row flow-row"${P} title="${esc(t.market||"")} · ${esc(t.source||"-")} · ${fmtDt(t.asOf)}">
      <td class="rownum">${m}</td>
      <td class="left flow-cell" colspan="3"><div class="metric-cell"><span class="metric-label"><span class="flow-head">${S}</span><span class="flow-line">${flowPillsHtml(k)}</span></span>${rt}<span class="metric-trail quote-action-trail">${g}${sourcePillHtml(t)}</span></div></td>
    </tr>`};if(u){const m=r++;return h(b,t._flows,"코스피",!0)+h(m,t._flowsKosdaq,"코스닥",!1)}return h(b,t._flows,"코스피",!0)}let f="";if(t._hlProxy||MOOD_PROTECTED_KEYS.has(t.key))f="";else if(_){const u=t._watchlistCode||t.code,g=t._watchlistMarket||t.market,h=`data-market="${esc(g||"")}"`,m=canHoldCard(t)?`<button class="row-holding ${holdingFor(t)?"is-set":""}" data-action="edit-holding" data-holding-id="${esc(holdingId(t))}" data-key="${esc(t.key)}" data-price="${esc(t.price??"")}" title="${esc(t.key)} 구매가격/수량" aria-label="구매가격/수량">₩</button>`:"",k=typeof quotePinButtonHtml=="function"?quotePinButtonHtml(t):"";if(t._holdingSheetStock)f=`<span class="row-actions">${m}${k}<button class="row-x" data-action="remove-holding-sheet-stock" data-holding-id="${esc(holdingId(t))}" data-key="${esc(t.key)}" title="${esc(t.key)} 이 시트에서 삭제" aria-label="이 시트에서 삭제">×</button></span>`;else{const x=t._watchlistStored!==!1,q=x?`<button class="row-move" data-action="move-row" data-dir="up" data-code="${esc(u)}" ${h} title="${esc(t.key)} 위로 이동" aria-label="위로 이동" ${$===d?"disabled":""}>▲</button><button class="row-move" data-action="move-row" data-dir="down" data-code="${esc(u)}" ${h} title="${esc(t.key)} 아래로 이동" aria-label="아래로 이동" ${$===c?"disabled":""}>▼</button>`:"",S=t._mergedDefault?`${t.key} 관심종목에서 삭제 (기본 시세는 유지)`:`${t.key} 삭제`,P=x?`<button class="row-x" data-action="remove-row" data-code="${esc(u)}" ${h} title="${esc(S)}" aria-label="삭제">×</button>`:"";f=`<span class="row-actions">${m}${k}${q}${P}</span>`}}else{const u=cardOrderId(t),g=canHoldCard(t)?`<button class="row-holding ${holdingFor(t)?"is-set":""}" data-action="edit-holding" data-holding-id="${esc(holdingId(t))}" data-key="${esc(t.key)}" data-price="${esc(t.price??"")}" title="${esc(t.key)} 구매가격/수량" aria-label="구매가격/수량">₩</button>`:"",h=typeof quotePinButtonHtml=="function"?quotePinButtonHtml(t):"",m=`<button class="row-move" data-action="move-default" data-dir="up" data-order-id="${esc(u)}" title="${esc(t.key)} 위로 이동" aria-label="위로 이동" ${$===d?"disabled":""}>▲</button><button class="row-move" data-action="move-default" data-dir="down" data-order-id="${esc(u)}" title="${esc(t.key)} 아래로 이동" aria-label="아래로 이동" ${$===c?"disabled":""}>▼</button>`;f=`<span class="row-actions">${g}${h}${m}<button class="row-x" data-action="hide-default" data-key="${esc(t.key)}" title="${esc(t.key)} 숨기기" aria-label="숨기기">×</button></span>`}const Q=t._hlProxy?"":liveBadgeHtml(t,o),Y=t._hlProxy?hlProxyRowClass(t):`${MOOD_PROTECTED_KEYS.has(t.key)?" mood-row":""}${t._quotePinned?" quote-pinned-row":""}`,E=quoteRowOrderId(t),B=!t._hlProxy,j=B?` data-row-order-id="${esc(E)}"`:"",G=B?` class="rownum quote-row-handle" data-row-order-id="${esc(E)}" title="행번호를 끌어서 순서 변경" aria-label="${esc(t.key)} 순서 변경"`:' class="rownum"',{priceCell:X,changeCell:J,changeClass:Z,previewChangeValue:tt,changeTitle:O}=cardRenderedCells(t),L=t._hlProxy?hlProxyQuoteId(t):quoteTokenForCard(t),C=t._hlProxy?"":tradingViewSymbolForCard(t),et=tradingViewTipPreferred(t,C)?"1":"",at=C?`<button class="tv-chart-button" data-action="open-tv-chart" data-token="${esc(L)}" data-tv-symbol="${esc(C)}" data-label="${esc(t.key)}" title="${esc(t.key)} TradingView 차트" aria-label="${esc(t.key)} TradingView 차트">차트</button>`:"",R=renderHoldingRows(t,r),ot=R.html?" quote-with-holding":"",M=t._hlProxy?"":`${t.market||""} · ${t.source||"-"} · ${fmtDt(t.asOf)}`,lt=M?` title="${esc(M)}"`:"",st=t._hlProxy?` data-hl-proxy-id="${esc(t._hlId||"")}"`:"",nt="",U=t.price===null||t.price===void 0||t.price===""?null:Number(t.price),it=Number.isFinite(U)?` data-quote-price-value="${esc(U)}"`:"";let V=`
    <tr class="${_?"user-row"+F:""}${Y}${ot}" data-quote-id="${esc(L)}"${j}${st}${it} data-chart-label="${esc(t.key)}" data-tv-symbol="${esc(C)}" data-tv-tip-preferred="${et}" data-outlook-badge="${esc(outlookBadgeText(t))}" data-outlook-tone="${esc(outlookBadgeTone(t))}"${lt}>
      <td${G}>${b}</td>
      <td class="left"><div class="metric-cell"><span class="metric-label">${W}${nt}${Q}</span>${at}${outlookPreviewHtml(t,tt)}<span class="metric-trail ${f?"quote-action-trail":""}">${f}${t._hlProxy?hlProxyBadgeHtml(t):sourcePillHtml(t)}</span></div></td>
      <td class="right quote-price-cell">${X}</td>
      <td class="right ${Z} quote-change-cell"${O?` title="${esc(O)}"`:""}>${J}</td>
    </tr>`;return R.html&&(V+=R.html,r+=R.count),V}).join("");const y=renderHoldingSummaryRows(e,r);r+=y.count;const v=`
    <tr class="summary-sheet-note-blank-row" aria-hidden="true">
      <td class="rownum">${r}</td>
      <td class="left"></td>
      <td class="right"></td>
      <td class="right"></td>
    </tr>
    <tr class="summary-sheet-note-row" data-xk-area="summary" data-xk-position="summary-bottom" data-xk-id="sponsor-open" data-xk-label="알림" data-xk-variant-index="0" data-xk-variant-text="이곳에 한줄 광고를 넣어주실 광고주를 모십니다.">
      <td class="rownum">${r+1}</td>
      <td class="left summary-sheet-note-cell" colspan="3">
        <span class="notice-badge" data-xk-label>알림</span>
        <span class="community-text-note"><a class="notice-copy" href="mailto:excelkospi@outlook.com" data-xk-click="1">이곳에 한줄 광고를 넣어주실 광고주를 모십니다.</a></span>
      </td>
    </tr>`,w=80,I=r-2,H=r,T=Math.max(0,w-I),N=makeEmptyRows(H,T,3).replaceAll('class="empty-row"','class="empty-row summary-desktop-empty-row"'),K=makeEmptyRows(H+2,Math.max(0,T-2),3).replaceAll('class="empty-row"','class="empty-row summary-native-empty-row"');return n+p+y.html+v+N+K}
