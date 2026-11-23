(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  function selectTab(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
    document.getElementById('app-title').textContent = tab.id === 'status-tab' ? '我的狀態' : '好友狀態';
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
    });
  });
  const feedback = document.getElementById('demo-feedback');
  document.querySelectorAll('input[name="availability"]').forEach(input => {
    input.addEventListener('change', () => { feedback.textContent = '草稿已更新，按「設定」套用。'; });
  });
  const messageInput = document.getElementById('demo-message');
  const updateCount = () => { document.getElementById('character-count').textContent = `${messageInput.value.length} / 100`; };
  const durationInput = document.getElementById('demo-duration');
  updateCount();
  document.getElementById('clear-status').addEventListener('click', () => {
    document.querySelector('input[name="availability"][value="available"]').checked = true;
    durationInput.value = 'none';
    messageInput.value = '';
    updateCount(); feedback.textContent = '草稿已清除，按「設定」套用。';
  });
  document.getElementById('restore-status').addEventListener('click', () => {
    document.querySelector('input[name="availability"][value="available"]').checked = true;
    durationInput.value = 'none';
    messageInput.value = '散步中，隨時聊聊';
    updateCount(); feedback.textContent = '已帶入最近使用的狀態，按「設定」套用。';
  });
  messageInput.addEventListener('input', () => {
    updateCount();
    feedback.textContent = '草稿已更新，按「設定」套用。';
  });
  document.getElementById('demo-duration').addEventListener('change', () => {
    feedback.textContent = '草稿已更新，按「設定」套用。';
  });
  document.getElementById('publish-status').addEventListener('click', () => {
    const dnd = document.querySelector('input[name="availability"]:checked').value === 'dnd';
    const message = document.getElementById('demo-message').value.trim();
    const duration = durationInput;
    document.getElementById('current-message').textContent = message;
    document.getElementById('current-state').textContent = dnd ? '勿擾' : '有空';
    document.getElementById('current-symbol').textContent = dnd ? '☾' : '☀';
    document.getElementById('current-dot').className = `dot ${dnd ? 'purple' : 'green'}`;
    document.getElementById('last-update').textContent = duration.value === 'none' ? '上次更新：剛剛' : `上次更新：剛剛 · ${duration.options[duration.selectedIndex].text}結束`;
    document.getElementById('self-state').textContent = dnd ? '勿擾' : '有空';
    document.getElementById('self-state').className = `friend-state ${dnd ? 'dnd-text' : 'available-text'}`;
    document.getElementById('self-message').textContent = message || '未設定';
    document.getElementById('self-symbol').textContent = dnd ? '☾' : '☀';
    document.getElementById('self-symbol').className = `friend-icon ${dnd ? 'dnd-text' : 'available-text'}`;
    feedback.textContent = '已套用到示意介面，不會保存或傳送資料。';
  });
  const friendClocks = [...document.querySelectorAll('time[data-time-zone]')].map(element => ({
    element,
    formatter: new Intl.DateTimeFormat('en-GB', {
      timeZone: element.dataset.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZoneName: 'shortOffset',
    }),
  }));

  function updateFriendClocks() {
    const now = new Date();
    friendClocks.forEach(({ element, formatter }) => {
      const parts = formatter.formatToParts(now);
      const hour = parts.find(part => part.type === 'hour').value;
      const minute = parts.find(part => part.type === 'minute').value;
      const offset = parts.find(part => part.type === 'timeZoneName').value;
      element.dateTime = `${hour}:${minute}`;
      element.textContent = `${element.dateTime} · ${offset === 'GMT' ? 'UTC+0' : offset.replace('GMT', 'UTC')}`;
    });
  }

  updateFriendClocks();
  window.setInterval(updateFriendClocks, 1000);
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
