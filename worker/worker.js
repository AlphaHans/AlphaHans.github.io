// complex-worker.js - 专用于复杂计算的 Web Worker

// 模拟复杂计算1：大规模矩阵乘法
function matrixMultiply(a, b, size) {
    const result = new Array(size);
    for (let i = 0; i < size; i++) {
        result[i] = new Array(size);
        for (let j = 0; j < size; j++) {
            let sum = 0;
            for (let k = 0; k < size; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

// 模拟复杂计算2：蒙特卡洛模拟
function monteCarloPi(iterations) {
    let insideCircle = 0;
    for (let i = 0; i < iterations; i++) {
        const x = Math.random();
        const y = Math.random();
        if (x * x + y * y <= 1) insideCircle++;
    }
    return (insideCircle / iterations) * 4;
}

// 模拟复杂计算3：快速傅里叶变换 (简化版)
function fft(input) {
    const n = input.length;
    if (n <= 1) return input;

    const even = fft(input.filter((_, i) => i % 2 === 0));
    const odd = fft(input.filter((_, i) => i % 2 === 1));

    const output = new Array(n);
    for (let k = 0; k < n / 2; k++) {
        const angle = -2 * Math.PI * k / n;
        const exp = { re: Math.cos(angle), im: Math.sin(angle) };

        const re = exp.re * odd[k].re - exp.im * odd[k].im;
        const im = exp.re * odd[k].im + exp.im * odd[k].re;

        output[k] = {
            re: even[k].re + re,
            im: even[k].im + im
        };
        output[k + n/2] = {
            re: even[k].re - re,
            im: even[k].im - im
        };
    }
    return output;
}

// Worker 消息处理器
self.onmessage = function(e) {
    const { task, data } = e.data;
    let result;
    let startTime = performance.now();

    try {
        switch(task) {
            case 'matrix':
                const size = data.size || 100;
                // 生成随机矩阵
                const a = Array.from({length: size}, () =>
                    Array.from({length: size}, () => Math.random()));
                const b = Array.from({length: size}, () =>
                    Array.from({length: size}, () => Math.random()));
                result = matrixMultiply(a, b, size);
                break;

            case 'montecarlo':
                result = monteCarloPi(data.iterations || 10000000);
                break;

            case 'fft':
                // 准备复数输入数据
                const input = Array.from({length: 1024}, (_, i) => ({
                    re: Math.sin(i * 0.1),
                    im: 0
                }));
                result = fft(input);
                break;

            case 'benchmark':
                // 综合性能测试
                const matrixResult = matrixMultiply(
                    Array.from({length: 50}, () =>
                        Array.from({length: 50}, () => Math.random())),
                    Array.from({length: 50}, () =>
                        Array.from({length: 50}, () => Math.random())),
                    50
                );

                const pi = monteCarloPi(5000000);

                const fftResult = fft(
                    Array.from({length: 512}, (_, i) => ({
                        re: Math.sin(i * 0.2),
                        im: 0
                    }))
                );

                result = {
                    matrix: matrixResult[0][0], // 示例值
                    piEstimate: pi,
                    fftMagnitude: Math.sqrt(
                        fftResult[10].re * fftResult[10].re +
                        fftResult[10].im * fftResult[10].im
                    )
                };
                break;

            default:
                throw new Error(`未知任务类型: ${task}`);
        }

        const endTime = performance.now();

        self.postMessage({
            status: 'success',
            task: task,
            result: task === 'benchmark' ? result : result instanceof Array ? '计算结果为数组' : result,
            duration: (endTime - startTime).toFixed(2) + 'ms'
        });

    } catch (error) {
        self.postMessage({
            status: 'error',
            task: task,
            error: error.message
        });
    }
};

// 错误处理
self.onerror = function(error) {
    self.postMessage({
        status: 'error',
        error: 'Worker 内部错误: ' + error.message
    });
};