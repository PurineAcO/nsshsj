// 存储力学对象的列表
let mechanicsObjects = [];

// 核心：自动解析 (x,y) 格式坐标，提取数字
function parsePoint(s) {
    const nums = s.match(/-?\d+\.?\d*/g).map(Number);
    return [nums[0], nums[1]];
}

// 添加外力输入字段
function addForceFields() {
    const count = parseInt(document.getElementById('force-count').value);
    const container = document.getElementById('force-fields');
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'border p-3 mb-3 rounded';
        div.innerHTML = `
            <h5>第${i+1}个外力</h5>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label>值：</label>
                        <input type="number" class="form-control" id="force-value-${i}" step="0.1">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label>作用点(x,y)：</label>
                        <input type="text" class="form-control" id="force-place-${i}" placeholder="例如：(0,0)">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label>方向(x,y)：</label>
                        <input type="text" class="form-control" id="force-direc-${i}" placeholder="例如：(1,0)">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    }
}

// 添加外力矩输入字段
function addTorqueFields() {
    const count = parseInt(document.getElementById('torque-count').value);
    const container = document.getElementById('torque-fields');
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'border p-3 mb-3 rounded';
        div.innerHTML = `
            <h5>第${i+1}个外力矩</h5>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label>值：</label>
                        <input type="number" class="form-control" id="torque-value-${i}" step="0.1">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label>作用点(x,y)：</label>
                        <input type="text" class="form-control" id="torque-place-${i}" placeholder="例如：(0,0)">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    }
}

// 添加分布力输入字段
function addFenbuFields() {
    const count = parseInt(document.getElementById('fenbu-count').value);
    const container = document.getElementById('fenbu-fields');
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'border p-3 mb-3 rounded';
        div.innerHTML = `
            <h5>第${i+1}个分布力</h5>
            <div class="row">
                <div class="col-md-3">
                    <div class="form-group">
                        <label>q：</label>
                        <input type="number" class="form-control" id="fenbu-q-${i}" step="0.1">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label>起点(x,y)：</label>
                        <input type="text" class="form-control" id="fenbu-start-${i}" placeholder="例如：(0,0)">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label>终点(x,y)：</label>
                        <input type="text" class="form-control" id="fenbu-end-${i}" placeholder="例如：(1,0)">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label>方向(x,y)：</label>
                        <input type="text" class="form-control" id="fenbu-direc-${i}" placeholder="例如：(0,1)">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    }
}

// 添加分布力矩输入字段
function addFenbutorqueFields() {
    const count = parseInt(document.getElementById('fenbutorque-count').value);
    const container = document.getElementById('fenbutorque-fields');
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'border p-3 mb-3 rounded';
        div.innerHTML = `
            <h5>第${i+1}个分布力矩</h5>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label>m：</label>
                        <input type="number" class="form-control" id="fenbutorque-m-${i}" step="0.1">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label>起点(x,y)：</label>
                        <input type="text" class="form-control" id="fenbutorque-start-${i}" placeholder="例如：(0,0)">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label>终点(x,y)：</label>
                        <input type="text" class="form-control" id="fenbutorque-end-${i}" placeholder="例如：(1,0)">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    }
}

// 添加滑动铰输入字段
function addHdjzzFields() {
    const count = parseInt(document.getElementById('hdjzz-count').value);
    const container = document.getElementById('hdjzz-fields');
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'border p-3 mb-3 rounded';
        div.innerHTML = `
            <h5>第${i+1}个滑动铰</h5>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label>位置(x,y)：</label>
                        <input type="text" class="form-control" id="hdjzz-place-${i}" placeholder="例如：(0,0)">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label>方向(x,y)：</label>
                        <input type="text" class="form-control" id="hdjzz-direc-${i}" placeholder="例如：(1,0)">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    }
}

// 添加固定铰输入字段
function addGdjzzFields() {
    const count = parseInt(document.getElementById('gdjzz-count').value);
    const container = document.getElementById('gdjzz-fields');
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'border p-3 mb-3 rounded';
        div.innerHTML = `
            <h5>第${i+1}个固定铰</h5>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label>位置(x,y)：</label>
                        <input type="text" class="form-control" id="gdjzz-place-${i}" placeholder="例如：(0,0)">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    }
}

// 添加固定支座输入字段
function addGzFields() {
    const count = parseInt(document.getElementById('gz-count').value);
    const container = document.getElementById('gz-fields');
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'border p-3 mb-3 rounded';
        div.innerHTML = `
            <h5>第${i+1}个固定支座</h5>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label>位置(x,y)：</label>
                        <input type="text" class="form-control" id="gz-place-${i}" placeholder="例如：(0,0)">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    }
}

// 收集所有力学对象
function collectObjects() {
    mechanicsObjects = [];
    
    // 收集外力
    const forceCount = parseInt(document.getElementById('force-count').value);
    for (let i = 0; i < forceCount; i++) {
        try {
            const value = parseFloat(document.getElementById(`force-value-${i}`).value);
            const place = parsePoint(document.getElementById(`force-place-${i}`).value);
            const direc = parsePoint(document.getElementById(`force-direc-${i}`).value);
            mechanicsObjects.push({ type: 'outerforce', value, place, direc });
        } catch (e) {
            alert(`外力输入错误：${e.message}`);
            return false;
        }
    }
    
    // 收集外力矩
    const torqueCount = parseInt(document.getElementById('torque-count').value);
    for (let i = 0; i < torqueCount; i++) {
        try {
            const value = parseFloat(document.getElementById(`torque-value-${i}`).value);
            const place = parsePoint(document.getElementById(`torque-place-${i}`).value);
            mechanicsObjects.push({ type: 'outertorque', value, place });
        } catch (e) {
            alert(`外力矩输入错误：${e.message}`);
            return false;
        }
    }
    
    // 收集分布力
    const fenbuCount = parseInt(document.getElementById('fenbu-count').value);
    for (let i = 0; i < fenbuCount; i++) {
        try {
            const q = parseFloat(document.getElementById(`fenbu-q-${i}`).value);
            const start = parsePoint(document.getElementById(`fenbu-start-${i}`).value);
            const end = parsePoint(document.getElementById(`fenbu-end-${i}`).value);
            const direc = parsePoint(document.getElementById(`fenbu-direc-${i}`).value);
            mechanicsObjects.push({ type: 'fenbuforce', q, start, end, direc });
        } catch (e) {
            alert(`分布力输入错误：${e.message}`);
            return false;
        }
    }
    
    // 收集分布力矩
    const fenbutorqueCount = parseInt(document.getElementById('fenbutorque-count').value);
    for (let i = 0; i < fenbutorqueCount; i++) {
        try {
            const m = parseFloat(document.getElementById(`fenbutorque-m-${i}`).value);
            const start = parsePoint(document.getElementById(`fenbutorque-start-${i}`).value);
            const end = parsePoint(document.getElementById(`fenbutorque-end-${i}`).value);
            mechanicsObjects.push({ type: 'fenbutorque', m, start, end });
        } catch (e) {
            alert(`分布力矩输入错误：${e.message}`);
            return false;
        }
    }
    
    // 收集滑动铰
    const hdjzzCount = parseInt(document.getElementById('hdjzz-count').value);
    for (let i = 0; i < hdjzzCount; i++) {
        try {
            const place = parsePoint(document.getElementById(`hdjzz-place-${i}`).value);
            const direc = parsePoint(document.getElementById(`hdjzz-direc-${i}`).value);
            mechanicsObjects.push({ type: 'hdjzz', place, direc });
        } catch (e) {
            alert(`滑动铰输入错误：${e.message}`);
            return false;
        }
    }
    
    // 收集固定铰
    const gdjzzCount = parseInt(document.getElementById('gdjzz-count').value);
    for (let i = 0; i < gdjzzCount; i++) {
        try {
            const place = parsePoint(document.getElementById(`gdjzz-place-${i}`).value);
            mechanicsObjects.push({ type: 'gdjzz', place });
        } catch (e) {
            alert(`固定铰输入错误：${e.message}`);
            return false;
        }
    }
    
    // 收集固定支座
    const gzCount = parseInt(document.getElementById('gz-count').value);
    for (let i = 0; i < gzCount; i++) {
        try {
            const place = parsePoint(document.getElementById(`gz-place-${i}`).value);
            mechanicsObjects.push({ type: 'gz', place });
        } catch (e) {
            alert(`固定支座输入错误：${e.message}`);
            return false;
        }
    }
    
    return true;
}

// 求解器类
class Solver {
    constructor(mechanicsObjects, n = 1) {
        this.mechanicsObjects = mechanicsObjects;
        this.n = n;
        this.restrictioncnt = 3 * n;
        this.matrixcnt = 0;
        this.restrictiondic = { gdjzz: [], hdjzz: [], gz: [] };
        this.beta = math.zeros([3, 1]);
        this.A = math.zeros([3, 3]);
    }
    
    countEquation() {
        for (const obj of this.mechanicsObjects) {
            if (obj.type === 'gdjzz') {
                this.restrictioncnt -= 2;
                this.restrictiondic.gdjzz.push(obj);
            } else if (obj.type === 'gz') {
                this.restrictioncnt -= 3;
                this.restrictiondic.gz.push(obj);
            } else if (obj.type === 'hdjzz') {
                this.restrictioncnt -= 1;
                this.restrictiondic.hdjzz.push(obj);
            } else if (obj.type === 'outerforce' || obj.type === 'fenbuforce') {
                const fx = obj.value * obj.direc[0];
                const fy = obj.value * obj.direc[1];
                this.beta.set([0, 0], this.beta.get([0, 0]) - fx);
                this.beta.set([1, 0], this.beta.get([1, 0]) - fy);
                this.beta.set([2, 0], this.beta.get([2, 0]) - fy * obj.place[0] + fx * obj.place[1]);
            } else if (obj.type === 'outertorque' || obj.type === 'fenbutorque') {
                this.beta.set([2, 0], this.beta.get([2, 0]) - obj.value);
            }
        }
        
        if (this.restrictioncnt < 0) {
            throw new Error('系统超静定');
        } else if (this.restrictioncnt > 0) {
            throw new Error('系统静不定');
        } else if (this.restrictioncnt === 0) {
            console.log('可以求解...');
        } else {
            throw new Error('未知问题');
        }
    }
    
    compileEquation() {
        for (const obj of this.restrictiondic.gdjzz) {
            this.A.set([0, this.matrixcnt], 1);
            this.A.set([1, this.matrixcnt], 0);
            this.A.set([2, this.matrixcnt], -obj.place[1]);
            this.A.set([0, this.matrixcnt + 1], 0);
            this.A.set([1, this.matrixcnt + 1], 1);
            this.A.set([2, this.matrixcnt + 1], obj.place[0]);
            this.matrixcnt += 2;
        }
        
        for (const obj of this.restrictiondic.hdjzz) {
            this.A.set([0, this.matrixcnt], obj.direc[0]);
            this.A.set([1, this.matrixcnt], obj.direc[1]);
            this.A.set([2, this.matrixcnt], obj.place[0] * obj.direc[1] - obj.place[1] * obj.direc[0]);
            this.matrixcnt += 1;
        }
        
        for (const obj of this.restrictiondic.gz) {
            this.A.set([0, this.matrixcnt], 1);
            this.A.set([1, this.matrixcnt], 0);
            this.A.set([2, this.matrixcnt], -obj.place[1]);
            this.A.set([0, this.matrixcnt + 1], 0);
            this.A.set([1, this.matrixcnt + 1], 1);
            this.A.set([2, this.matrixcnt + 1], obj.place[0]);
            this.A.set([0, this.matrixcnt + 2], 0);
            this.A.set([1, this.matrixcnt + 2], 0);
            this.A.set([2, this.matrixcnt + 2], 1);
            this.matrixcnt += 3;
        }
        
        console.log('编译完成...');
    }
    
    solveEquation() {
        this.countEquation();
        this.compileEquation();
        
        try {
            const X = math.lusolve(this.A, this.beta);
            console.log('求解完成...');
            return X;
        } catch (e) {
            throw new Error('方程无解');
        }
    }
}

// 求解函数
function solve() {
    if (!collectObjects()) {
        return;
    }
    
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    
    try {
        // 创建求解器并求解
        const sol = new Solver(mechanicsObjects);
        const X = sol.solveEquation();
        
        // 显示对象列表
        resultDiv.innerHTML += '<h5>【对象列表预览】</h5>';
        mechanicsObjects.forEach((obj, idx) => {
            resultDiv.innerHTML += `<p>对象${idx+1} 类型：${obj.type}，参数：${JSON.stringify(obj)}</p>`;
        });
        
        // 显示求解结果
        resultDiv.innerHTML += '<h5 class="mt-3">【求解结果】</h5>';
        resultDiv.innerHTML += '<pre>' + JSON.stringify(X, null, 2) + '</pre>';
        
    } catch (e) {
        resultDiv.innerHTML += `<div class="alert alert-danger">求解失败：${e.message}</div>`;
    }
}