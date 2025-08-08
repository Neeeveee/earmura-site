// === 获取元素 ===
const recordBtn = document.getElementById('recordBtn');
const recordIcon = document.getElementById('recordIcon');
const submitBtn = document.getElementById('submitBtn');
const statusText = document.getElementById('recording-status');
const timerText = document.getElementById('timer');
const waveformCanvas = document.getElementById('waveform');
const ctx = waveformCanvas.getContext('2d');

let mediaRecorder, audioChunks = [], audioContext, analyser, dataArray, source;
let isRecording = false;
let timerInterval;
let seconds = 0;
let animationId;

// === 设置音轨画布尺寸 ===
function resizeCanvas() {
  waveformCanvas.width = window.innerWidth * 0.8;
  waveformCanvas.height = 60;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// === 渲染音轨动画 ===
function drawWaveform() {
  animationId = requestAnimationFrame(drawWaveform);
  analyser.getByteTimeDomainData(dataArray);

  ctx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#fffefa';

  const sliceWidth = waveformCanvas.width / dataArray.length;
  let x = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * waveformCanvas.height) / 2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    x += sliceWidth;
  }
  ctx.lineTo(waveformCanvas.width, waveformCanvas.height / 2);
  ctx.stroke();
}

// === 计时器控制 ===
function startTimer() {
  timerText.style.display = 'block';
  timerInterval = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerText.textContent = `${mins}:${secs}`;
  }, 1000);
}
function stopTimer() {
  clearInterval(timerInterval);
}
function resetTimer() {
  seconds = 0;
  timerText.textContent = '00:00';
  timerText.style.display = 'none';
}

// === 点击录音按钮逻辑 ===
recordBtn.addEventListener('click', async () => {
  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
      mediaRecorder.onstop = () => {
        submitBtn.style.display = 'block';
        cancelAnimationFrame(animationId);
      };

      mediaRecorder.start();
      isRecording = true;

      statusText.style.display = 'block';
      recordIcon.src = 'images/stop-icon.png';
      submitBtn.style.display = 'none';
      waveformCanvas.style.display = 'block';

      // 初始化音轨渲染
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
      drawWaveform();

      // 开始计时
      resetTimer();
      startTimer();

    } catch (err) {
      console.error('录音失败:', err);
      alert('无法访问麦克风，请检查权限设置。');
    }
  } else {
    // 停止录音
    mediaRecorder.stop();
    isRecording = false;

    statusText.style.display = 'none';
    recordIcon.src = 'images/mic-icon.png';
    stopTimer();
  }
});

// === 提交按钮重置状态 ===
submitBtn.addEventListener('click', () => {
  recordIcon.src = 'images/mic-icon.png';
  submitBtn.style.display = 'none';
  waveformCanvas.style.display = 'none';
  resetTimer();
});
