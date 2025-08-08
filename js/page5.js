document.addEventListener("DOMContentLoaded", () => {
  // ✅ checkbox 部分逻辑
  const confirmBtn = document.getElementById('confirmBtn');
  const volunteerCheckbox = document.getElementById('volunteerCheckbox');
  const homePrayCheckbox = document.getElementById('homePrayCheckbox');
  const volunteerText = document.getElementById('volunteerText');
  const homePrayText = document.getElementById('homePrayText');

  volunteerCheckbox.addEventListener('change', () => {
    volunteerText.style.fontWeight = volunteerCheckbox.checked ? 'bold' : 'normal';
  });
  homePrayCheckbox.addEventListener('change', () => {
    homePrayText.style.fontWeight = homePrayCheckbox.checked ? 'bold' : 'normal';
  });

  // ✅ 自定义下拉菜单逻辑
  document.querySelectorAll('.custom-select').forEach(wrapper => {
    const selected = wrapper.querySelector('.select-selected');
    const items = wrapper.querySelector('.select-items');

    // 展开/收起下拉菜单
    selected.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllSelect(selected);

      const isHidden = items.classList.contains('select-hide');

      if (isHidden) {
        items.classList.remove('select-hide');
        items.style.display = 'block'; // ✅ 显示下拉
      } else {
        items.classList.add('select-hide');
        items.style.display = 'none';  // ✅ 收起下拉
      }

      selected.classList.toggle('select-arrow-active');
    });

    // 点击选项
    items.querySelectorAll('div').forEach(option => {
      option.addEventListener('click', () => {
        selected.textContent = option.textContent;
        items.querySelectorAll('div').forEach(opt => opt.classList.remove('same-as-selected'));
        option.classList.add('same-as-selected');

        items.classList.add('select-hide');
        items.style.display = 'none'; // ✅ 收起菜单
        selected.classList.remove('select-arrow-active');
      });
    });
  });

  // ✅ 点击空白处关闭所有菜单
  document.addEventListener('click', () => {
    closeAllSelect();
  });

  // ✅ 封装：关闭所有菜单函数
  function closeAllSelect(except) {
    document.querySelectorAll('.select-items').forEach(items => {
      items.classList.add('select-hide');
      items.style.display = 'none'; // ✅ 强制隐藏
    });
    document.querySelectorAll('.select-selected').forEach(sel => {
      if (sel !== except) sel.classList.remove('select-arrow-active');
    });
  }

  // ✅ Confirm 按钮逻辑：重置所有状态
  confirmBtn.addEventListener('click', () => {
    document.querySelectorAll('.custom-select').forEach(wrapper => {
      const selected = wrapper.querySelector('.select-selected');
      const items = wrapper.querySelectorAll('.select-items div');
      const placeholder = wrapper.getAttribute("data-placeholder") || "...";
      selected.textContent = placeholder;
      items.forEach(opt => opt.classList.remove('same-as-selected'));

      // ✅ 隐藏菜单
      const menu = wrapper.querySelector('.select-items');
      menu.classList.add('select-hide');
      menu.style.display = 'none';
    });

    volunteerCheckbox.checked = false;
    homePrayCheckbox.checked = false;
    volunteerText.style.fontWeight = 'normal';
    homePrayText.style.fontWeight = 'normal';
  });
});
