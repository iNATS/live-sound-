
async function setupAudioProcessing() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    const volumeLevel = document.getElementById('volumeLevel');

    function calculateVolume() {
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const volume = (average / 255) * 100;

        volumeLevel.style.width = volume + '%';

        const colorValue = Math.floor((volume / 100) * 255);
        volumeLevel.style.backgroundColor = `rgb(${colorValue}, 0, ${255 - colorValue})`;

        requestAnimationFrame(calculateVolume);
    }

    calculateVolume();
}

setupAudioProcessing();
