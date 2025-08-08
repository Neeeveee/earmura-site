document.addEventListener('DOMContentLoaded', () => {
  // 动画把进度条拉到目标值
  const bar = document.querySelector('.progress i');
  if (bar) requestAnimationFrame(() => bar.style.width = bar.style.width || '72%');

  // 复制 Belief ID
  const copyBtn = document.getElementById('copyId');
  const toast = document.getElementById('toast');
  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1500);
  }
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyBtn.textContent.trim());
        showToast('Belief ID copied');
      } catch { showToast('Copy failed'); }
    });
  }

  // 导出 JSON（给将来接接口预留）
  const exportBtn = document.getElementById('exportJson');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = {
        beliefId: 'WXR-11·Nyrah',
        shrine: 'Windcluster Shrine · Nyrah Fold',
        wishStatus: 'Awaiting Response',
        stillnessIndex: 0.47,
        ritualCompletion: 0.72,
        lastLogin: 'Veunn Corridor / Dalkh.5',
        weekly: { whispers: 6, stillnessHours: 4.5, participation: 'Shared Silence · Group Ritual' },
        bias: { tendency: 'Quiet Recurrence', pattern: 'Looped Requests', type: 'Passive‑Emotive' },
        archive: [
          { text:'Let me forget.', status:'Received' },
          { text:'[Gesture-based wish]', status:'Translating' },
          { text:'Is anyone else listening?', status:'Echo‑Delayed' }
        ],
        lastWhisper: { hoursAgo: 2.4, type:'Unspoken / Non‑Verbal gesture' }
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'earmura-user.json'; a.click();
      URL.revokeObjectURL(url);
    });
  }

  // 简易“开始静默”按钮
  const stillBtn = document.getElementById('startStillness');
  if (stillBtn) {
    stillBtn.addEventListener('click', () => {
      showToast('Stillness timer started (15 min)');
      // 这里你将来可以接入真实计时器或任务系统
    });
  }
});
