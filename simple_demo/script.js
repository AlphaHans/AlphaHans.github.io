// 简单的JavaScript函数，用于显示Hello World
function showHelloWorld() {
    // 获取输出区域的元素
    var outputElement = document.getElementById("output");
    
    // 在输出区域显示Hello World
    outputElement.innerHTML = "<h3>Hello World!</h3><p>这是通过JavaScript函数显示的消息。</p>";
    
    // 添加一些样式效果
    outputElement.style.backgroundColor = "#e8f5e9";
    outputElement.style.borderLeftColor = "#4caf50";
    
    // 3秒后恢复原始样式
    setTimeout(function() {
        outputElement.style.backgroundColor = "";
        outputElement.style.borderLeftColor = "";
    }, 3000);
}

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function() {
    console.log("页面加载完成，JavaScript文件已成功引入！");
});