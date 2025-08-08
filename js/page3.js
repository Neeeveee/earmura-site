// === page3.js：requestAnimationFrame 无限丝滑滚动（无跳帧）===

// 获取窗口与内容容器
const windowEl = document.querySelector('.carousel-window');   // 显示窗口（固定高度）
const wrapper = document.querySelector('.scroll-wrapper');     // 滚动容器（将持续上移）

// 克隆一次内容用于滚动循环（总共有两份内容）
const clone = wrapper.cloneNode(true); // 复制原内容
wrapper.appendChild(clone);            // 添加到容器末尾

// 设置初始滚动位置为 0
let scrollPos = 0;

// 控制滚动速度（越小越快，单位：像素/帧）
const speed = 0.5;

// 每帧执行的函数
function scrollLoop() {
  scrollPos += speed; // 向上滚动指定像素
  // 如果滚动超过一半（即原始内容高度），就回到起点
  if (scrollPos >= wrapper.scrollHeight / 2) {
    scrollPos = 0; // 重置回顶部
  }
  windowEl.scrollTop = scrollPos; // 设置滚动位置
  requestAnimationFrame(scrollLoop); // 继续下一帧
}

// 启动滚动动画
scrollLoop();

// === page3.js：绑定愿望提交按钮事件（适配 textarea + .submit-btn）===

// 获取 textarea 和提交按钮
const textarea = document.querySelector('.wish-input-box textarea'); // 获取文本区域
const submitBtn = document.querySelector('.submit-btn');             // 获取提交按钮

// 绑定点击事件
submitBtn.addEventListener('click', function () {
  const content = textarea.value.trim(); // 获取输入内容并去空格
  if (content === '') {
    showToast('Please enter your wish before submitting.');
    return;
  }

  // 这里你可以做上传、展示等操作
  console.log('已提交愿望：', content);

  // 清空输入框
  textarea.value = '';

  // 提示反馈（可自定义）
  showToast('Your voice has been heard.');
});

// === 显示自定义提示框 toast ===
function showToast(message) {
  const toast = document.getElementById('toast-message');
  toast.textContent = message;
  toast.classList.add('show');

  // 3 秒后自动隐藏
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.style.display = 'none';
    }, 500); // 等待透明度淡出动画完成后隐藏
  }, 3000);

  toast.style.display = 'block';
}
