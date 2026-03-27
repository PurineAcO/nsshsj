// 存储力学对象的列表
let mechanicsObjects = [];

// 全局单位设置
let globalUnits = {
    force: 'N',
    torque: 'N·m',
    length: 'm'
};

// 应用全局单位
function applyGlobalUnits() {
    globalUnits.force = document.getElementById('forceUnit').value;
    globalUnits.torque = document.getElementById('momentUnit').value;
    globalUnits.length = document.getElementById('lengthUnit').value;
    
    // 在日志中显示
    const logDiv = document.getElementById('log');
    logDiv.innerHTML = '<h5>【操作日志】</h5>';
    logDiv.innerHTML += `<p>全局单位已设置：</p>`;
    logDiv.innerHTML += `<p>- 力单位：${globalUnits.force}</p>`;
    logDiv.innerHTML += `<p>- 力矩单位：${globalUnits.torque}</p>`;
    logDiv.innerHTML += `<p>- 长度单位：${globalUnits.length}</p>`;
    logDiv.innerHTML += `<p>新添加的输入字段将使用这些单位</p>`;
    
    // 切换到日志标签页
    const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
    logTab.show();
}

// 标签页切换事件
document.addEventListener('DOMContentLoaded', function() {
    // 监听所有标签页切换事件（大标签页和子标签页）
    document.addEventListener('shown.bs.tab', function(event) {
        // 切换标签页后更新显示
        console.log('Tab switched, updating objects display');
        console.log('Mechanics objects count:', mechanicsObjects.length);
        displayObjects();
    });
    
    // 初始显示
    displayObjects();
});

// 核心：解析坐标点
function parsePoint(x, y) {
    return [parseExpression(x), parseExpression(y)];
}

// 解析算式
function parseExpression(expr) {
    try {
        return math.evaluate(expr);
    } catch (e) {
        throw new Error('算式解析错误');
    }
}

// 转换力单位到N
function convertForceUnit(value, unit) {
    if (unit === 'kN') {
        return value * 1000;
    } else if (unit === 'MN') {
        return value * 1000000;
    }
    return value;
}

// 转换力矩单位到N·m
function convertTorqueUnit(value, unit) {
    if (unit === 'kN·m') {
        return value * 1000;
    } else if (unit === 'MN·m') {
        return value * 1000000;
    }
    return value;
}

// 转换长度单位到m
function convertLengthUnit(value, unit) {
    if (unit === 'mm') {
        return value / 1000;
    }
    return value;
}

// 根据预设方向更新方向输入字段
function setDirection(direction) {
    switch (direction) {
        case '+X':
            document.getElementById('force-direction-x').value = '1';
            document.getElementById('force-direction-y').value = '0';
            break;
        case '-X':
            document.getElementById('force-direction-x').value = '-1';
            document.getElementById('force-direction-y').value = '0';
            break;
        case '+Y':
            document.getElementById('force-direction-x').value = '0';
            document.getElementById('force-direction-y').value = '1';
            break;
        case '-Y':
            document.getElementById('force-direction-x').value = '0';
            document.getElementById('force-direction-y').value = '-1';
            break;
    }
}

// 设置分布力方向
function setDistributedForceDirection(direction) {
    switch (direction) {
        case '+X':
            document.getElementById('distributed-force-direction-x').value = '1';
            document.getElementById('distributed-force-direction-y').value = '0';
            break;
        case '-X':
            document.getElementById('distributed-force-direction-x').value = '-1';
            document.getElementById('distributed-force-direction-y').value = '0';
            break;
        case '+Y':
            document.getElementById('distributed-force-direction-x').value = '0';
            document.getElementById('distributed-force-direction-y').value = '1';
            break;
        case '-Y':
            document.getElementById('distributed-force-direction-x').value = '0';
            document.getElementById('distributed-force-direction-y').value = '-1';
            break;
    }
}

// 设置滑动铰方向
function setSlidingDirection(direction) {
    switch (direction) {
        case '+X':
            document.getElementById('sliding-hinge-direction-x').value = '1';
            document.getElementById('sliding-hinge-direction-y').value = '0';
            break;
        case '-X':
            document.getElementById('sliding-hinge-direction-x').value = '-1';
            document.getElementById('sliding-hinge-direction-y').value = '0';
            break;
        case '+Y':
            document.getElementById('sliding-hinge-direction-x').value = '0';
            document.getElementById('sliding-hinge-direction-y').value = '1';
            break;
        case '-Y':
            document.getElementById('sliding-hinge-direction-x').value = '0';
            document.getElementById('sliding-hinge-direction-y').value = '-1';
            break;
    }
}

// 添加集中力
function addForce() {
    try {
        const magnitude = parseExpression(document.getElementById('force-magnitude').value);
        const positionX = parseExpression(document.getElementById('force-position-x').value);
        const positionY = parseExpression(document.getElementById('force-position-y').value);
        const directionX = parseExpression(document.getElementById('force-direction-x').value);
        const directionY = parseExpression(document.getElementById('force-direction-y').value);
        
        const force = {
            type: 'outerforce',
            value: convertForceUnit(magnitude, globalUnits.force),
            place: [
                convertLengthUnit(positionX, globalUnits.length),
                convertLengthUnit(positionY, globalUnits.length)
            ],
            direc: [directionX, directionY],
            originalValue: magnitude,
            unit: globalUnits.force,
            lengthUnit: globalUnits.length
        };
        
        mechanicsObjects.push(force);
        
        // 显示已添加的对象
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>集中力添加成功！</p>`;
        logDiv.innerHTML += `<p>值：${magnitude} ${globalUnits.force}</p>`;
        logDiv.innerHTML += `<p>作用点：(${positionX}, ${positionY}) ${globalUnits.length}</p>`;
        logDiv.innerHTML += `<p>方向：(${directionX}, ${directionY})</p>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    } catch (e) {
        // 在日志中显示错误
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<div class="alert alert-danger">添加集中力错误：${e.message}</div>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    }
}

// 添加集中力矩
function addMoment() {
    try {
        const magnitude = parseExpression(document.getElementById('moment-magnitude').value);
        const positionX = parseExpression(document.getElementById('moment-position-x').value);
        const positionY = parseExpression(document.getElementById('moment-position-y').value);
        const direction = parseInt(document.getElementById('moment-direction').value);
        
        const moment = {
            type: 'outertorque',
            value: convertTorqueUnit(magnitude, globalUnits.torque) * direction,
            place: [
                convertLengthUnit(positionX, globalUnits.length),
                convertLengthUnit(positionY, globalUnits.length)
            ],
            originalValue: magnitude * direction,
            unit: globalUnits.torque,
            lengthUnit: globalUnits.length
        };
        
        mechanicsObjects.push(moment);
        
        // 显示已添加的对象
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>集中力矩添加成功！</p>`;
        logDiv.innerHTML += `<p>值：${magnitude * direction} ${globalUnits.torque}</p>`;
        logDiv.innerHTML += `<p>作用点：(${positionX}, ${positionY}) ${globalUnits.length}</p>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    } catch (e) {
        // 在日志中显示错误
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<div class="alert alert-danger">添加集中力矩错误：${e.message}</div>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    }
}

// 添加分布力
function addDistributedForce() {
    try {
        const magnitude = parseExpression(document.getElementById('distributed-force-magnitude').value);
        const startX = parseExpression(document.getElementById('distributed-force-start-x').value);
        const startY = parseExpression(document.getElementById('distributed-force-start-y').value);
        const endX = parseExpression(document.getElementById('distributed-force-end-x').value);
        const endY = parseExpression(document.getElementById('distributed-force-end-y').value);
        const directionX = parseExpression(document.getElementById('distributed-force-direction-x').value);
        const directionY = parseExpression(document.getElementById('distributed-force-direction-y').value);
        
        const distributedForce = {
            type: 'fenbuforce',
            q: convertForceUnit(magnitude, globalUnits.force),
            start: [
                convertLengthUnit(startX, globalUnits.length),
                convertLengthUnit(startY, globalUnits.length)
            ],
            end: [
                convertLengthUnit(endX, globalUnits.length),
                convertLengthUnit(endY, globalUnits.length)
            ],
            direc: [directionX, directionY],
            originalQ: magnitude,
            unit: globalUnits.force + '/m',
            lengthUnit: globalUnits.length
        };
        
        mechanicsObjects.push(distributedForce);
        
        // 显示已添加的对象
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>分布力添加成功！</p>`;
        logDiv.innerHTML += `<p>集度：${magnitude} ${globalUnits.force}/m</p>`;
        logDiv.innerHTML += `<p>起点：(${startX}, ${startY}) ${globalUnits.length}</p>`;
        logDiv.innerHTML += `<p>终点：(${endX}, ${endY}) ${globalUnits.length}</p>`;
        logDiv.innerHTML += `<p>方向：(${directionX}, ${directionY})</p>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    } catch (e) {
        // 在日志中显示错误
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<div class="alert alert-danger">添加分布力错误：${e.message}</div>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    }
}

// 添加分布力矩
function addDistributedMoment() {
    try {
        const magnitude = parseExpression(document.getElementById('distributed-moment-magnitude').value);
        const startX = parseExpression(document.getElementById('distributed-moment-start-x').value);
        const startY = parseExpression(document.getElementById('distributed-moment-start-y').value);
        const endX = parseExpression(document.getElementById('distributed-moment-end-x').value);
        const endY = parseExpression(document.getElementById('distributed-moment-end-y').value);
        const direction = parseInt(document.getElementById('distributed-moment-direction').value);
        
        const distributedMoment = {
            type: 'fenbutorque',
            m: convertTorqueUnit(magnitude, globalUnits.torque) * direction,
            start: [
                convertLengthUnit(startX, globalUnits.length),
                convertLengthUnit(startY, globalUnits.length)
            ],
            end: [
                convertLengthUnit(endX, globalUnits.length),
                convertLengthUnit(endY, globalUnits.length)
            ],
            originalM: magnitude * direction,
            unit: globalUnits.torque + '/m',
            lengthUnit: globalUnits.length
        };
        
        mechanicsObjects.push(distributedMoment);
        
        // 显示已添加的对象
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>分布力矩添加成功！</p>`;
        logDiv.innerHTML += `<p>力矩集度：${magnitude * direction} ${globalUnits.torque}/m</p>`;
        logDiv.innerHTML += `<p>起点：(${startX}, ${startY}) ${globalUnits.length}</p>`;
        logDiv.innerHTML += `<p>终点：(${endX}, ${endY}) ${globalUnits.length}</p>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    } catch (e) {
        // 在日志中显示错误
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<div class="alert alert-danger">添加分布力矩错误：${e.message}</div>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    }
}

// 添加固定铰
function addFixedHinge() {
    try {
        const positionX = parseExpression(document.getElementById('fixed-hinge-position-x').value);
        const positionY = parseExpression(document.getElementById('fixed-hinge-position-y').value);
        
        const fixedHinge = {
            type: 'gdjzz',
            place: [
                convertLengthUnit(positionX, globalUnits.length),
                convertLengthUnit(positionY, globalUnits.length)
            ],
            lengthUnit: globalUnits.length
        };
        
        mechanicsObjects.push(fixedHinge);
        
        // 显示已添加的对象
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>固定铰添加成功！</p>`;
        logDiv.innerHTML += `<p>位置：(${positionX}, ${positionY}) ${globalUnits.length}</p>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    } catch (e) {
        // 在日志中显示错误
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<div class="alert alert-danger">添加固定铰错误：${e.message}</div>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    }
}

// 添加滑动铰
function addSlidingHinge() {
    try {
        const positionX = parseExpression(document.getElementById('sliding-hinge-position-x').value);
        const positionY = parseExpression(document.getElementById('sliding-hinge-position-y').value);
        const directionX = parseExpression(document.getElementById('sliding-hinge-direction-x').value);
        const directionY = parseExpression(document.getElementById('sliding-hinge-direction-y').value);
        
        const slidingHinge = {
            type: 'hdjzz',
            place: [
                convertLengthUnit(positionX, globalUnits.length),
                convertLengthUnit(positionY, globalUnits.length)
            ],
            direc: [directionX, directionY],
            lengthUnit: globalUnits.length
        };
        
        mechanicsObjects.push(slidingHinge);
        
        // 显示已添加的对象
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>滑动铰添加成功！</p>`;
        logDiv.innerHTML += `<p>位置：(${positionX}, ${positionY}) ${globalUnits.length}</p>`;
        logDiv.innerHTML += `<p>方向：(${directionX}, ${directionY})</p>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    } catch (e) {
        // 在日志中显示错误
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<div class="alert alert-danger">添加滑动铰错误：${e.message}</div>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    }
}

// 添加固定支座
function addFixed() {
    try {
        const positionX = parseExpression(document.getElementById('fixed-position-x').value);
        const positionY = parseExpression(document.getElementById('fixed-position-y').value);
        
        const fixed = {
            type: 'gdzz',
            place: [
                convertLengthUnit(positionX, globalUnits.length),
                convertLengthUnit(positionY, globalUnits.length)
            ],
            lengthUnit: globalUnits.length
        };
        
        mechanicsObjects.push(fixed);
        
        // 显示已添加的对象
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>固定支座添加成功！</p>`;
        logDiv.innerHTML += `<p>位置：(${positionX}, ${positionY}) ${globalUnits.length}</p>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    } catch (e) {
        // 在日志中显示错误
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<div class="alert alert-danger">添加固定支座错误：${e.message}</div>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    }
}

// 求解器类
class Solver {
    constructor(mechanicsObjects, n = 1) {
        this.mechanicsObjects = mechanicsObjects;
        this.n = n;
        this.restrictioncnt = 3 * n;
        this.matrixcnt = 0;
        this.restrictiondic = { gdjzz: [], hdjzz: [], gdzz: [] };
        // 直接初始化数组，而不是使用math.zeros
        this.beta = [[0], [0], [0]];
        this.A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }
    
    countEquation() {
        for (const obj of this.mechanicsObjects) {
            if (obj.type === 'gdjzz') {
                this.restrictioncnt -= 2;
                this.restrictiondic.gdjzz.push(obj);
            } else if (obj.type === 'gdzz') {
                this.restrictioncnt -= 3;
                this.restrictiondic.gdzz.push(obj);
            } else if (obj.type === 'hdjzz') {
                this.restrictioncnt -= 1;
                this.restrictiondic.hdjzz.push(obj);
            } else if (obj.type === 'outerforce') {
                const fx = obj.value * obj.direc[0];
                const fy = obj.value * obj.direc[1];
                this.beta[0][0] -= fx;
                this.beta[1][0] -= fy;
                this.beta[2][0] -= fy * obj.place[0] - fx * obj.place[1];
            } else if (obj.type === 'fenbuforce') {
                // 分布力的处理
                const length = Math.sqrt((obj.end[0] - obj.start[0])**2 + (obj.end[1] - obj.start[1])**2);
                const fx = obj.q * length * obj.direc[0];
                const fy = obj.q * length * obj.direc[1];
                // 计算分布力的等效作用点（中点）
                const placeX = (obj.start[0] + obj.end[0]) / 2;
                const placeY = (obj.start[1] + obj.end[1]) / 2;
                this.beta[0][0] -= fx;
                this.beta[1][0] -= fy;
                this.beta[2][0] -= fy * placeX - fx * placeY;
            } else if (obj.type === 'outertorque') {
                this.beta[2][0] -= obj.value;
            } else if (obj.type === 'fenbutorque') {
                // 分布力矩的处理
                this.beta[2][0] -= obj.m;
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
            this.A[0][this.matrixcnt] = 1;
            this.A[1][this.matrixcnt] = 0;
            this.A[2][this.matrixcnt] = -obj.place[1];
            this.A[0][this.matrixcnt + 1] = 0;
            this.A[1][this.matrixcnt + 1] = 1;
            this.A[2][this.matrixcnt + 1] = obj.place[0];
            this.matrixcnt += 2;
        }
        
        for (const obj of this.restrictiondic.hdjzz) {
            this.A[0][this.matrixcnt] = obj.direc[0];
            this.A[1][this.matrixcnt] = obj.direc[1];
            this.A[2][this.matrixcnt] = obj.place[0] * obj.direc[1] - obj.place[1] * obj.direc[0];
            this.matrixcnt += 1;
        }
        
        for (const obj of this.restrictiondic.gdzz) {
            this.A[0][this.matrixcnt] = 1;
            this.A[1][this.matrixcnt] = 0;
            this.A[2][this.matrixcnt] = -obj.place[1];
            this.A[0][this.matrixcnt + 1] = 0;
            this.A[1][this.matrixcnt + 1] = 1;
            this.A[2][this.matrixcnt + 1] = obj.place[0];
            this.A[0][this.matrixcnt + 2] = 0;
            this.A[1][this.matrixcnt + 2] = 0;
            this.A[2][this.matrixcnt + 2] = 1;
            this.matrixcnt += 3;
        }
        
        console.log('编译完成...');
    }
    
    solveEquation() {
        this.countEquation();
        this.compileEquation();
        
        try {
            // 将普通数组转换为math.js矩阵
            const A_matrix = math.matrix(this.A);
            const beta_matrix = math.matrix(this.beta);
            const X = math.lusolve(A_matrix, beta_matrix);
            console.log('求解完成...');
            return X;
        } catch (e) {
            throw new Error('方程无解');
        }
    }
}

// 获取对象类型的全称
function getObjectTypeName(type) {
    const typeMap = {
        'outerforce': '外力',
        'outertorque': '外力矩',
        'fenbuforce': '分布力',
        'fenbutorque': '分布力矩',
        'hdjzz': '滑动铰',
        'gdjzz': '固定铰',
        'gdzz': '固定支座'
    };
    return typeMap[type] || type;
}

// 显示对象确认对话框
function showObjectConfirmation() {
    let confirmationHTML = '<h5>【请您确认:】</h5>';
    
    // 按类型分组显示
    const objectsByType = {};
    mechanicsObjects.forEach(obj => {
        const typeName = getObjectTypeName(obj.type);
        if (!objectsByType[typeName]) {
            objectsByType[typeName] = [];
        }
        objectsByType[typeName].push(obj);
    });
    
    // 显示每种类型的对象
    for (const [typeName, objs] of Object.entries(objectsByType)) {
        confirmationHTML += `<h6 class="mt-3">${typeName} (${objs.length}个)</h6>`;
        objs.forEach((obj, idx) => {
            confirmationHTML += '<div class="border p-2 mb-2 rounded">';
            if (obj.type === 'outerforce') {
                confirmationHTML += `<p>值：${obj.originalValue} ${obj.unit}，作用点：(${obj.place[0].toFixed(3)}, ${obj.place[1].toFixed(3)}) m，方向：(${obj.direc[0]}, ${obj.direc[1]})</p>`;
            } else if (obj.type === 'outertorque') {
                confirmationHTML += `<p>值：${obj.originalValue} ${obj.unit}，作用点：(${obj.place[0].toFixed(3)}, ${obj.place[1].toFixed(3)}) m</p>`;
            } else if (obj.type === 'fenbuforce') {
                confirmationHTML += `<p>集度：${obj.originalQ} ${obj.unit}，起点：(${obj.start[0].toFixed(3)}, ${obj.start[1].toFixed(3)}) m，终点：(${obj.end[0].toFixed(3)}, ${obj.end[1].toFixed(3)}) m，方向：(${obj.direc[0]}, ${obj.direc[1]})</p>`;
            } else if (obj.type === 'fenbutorque') {
                confirmationHTML += `<p>力矩集度：${obj.originalM} ${obj.unit}，起点：(${obj.start[0].toFixed(3)}, ${obj.start[1].toFixed(3)}) m，终点：(${obj.end[0].toFixed(3)}, ${obj.end[1].toFixed(3)}) m</p>`;
            } else if (obj.type === 'hdjzz') {
                confirmationHTML += `<p>位置：(${obj.place[0].toFixed(3)}, ${obj.place[1].toFixed(3)}) m，方向：(${obj.direc[0]}, ${obj.direc[1]})</p>`;
            } else if (obj.type === 'gdjzz') {
                confirmationHTML += `<p>位置：(${obj.place[0].toFixed(3)}, ${obj.place[1].toFixed(3)}) m</p>`;
            } else if (obj.type === 'gdzz') {
                confirmationHTML += `<p>位置：(${obj.place[0].toFixed(3)}, ${obj.place[1].toFixed(3)}) m</p>`;
            }
            confirmationHTML += '</div>';
        });
    }
    
    return confirmationHTML;
}

// 求解函数
function solve() {
    if (mechanicsObjects.length === 0) {
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<div class="alert alert-warning">请先添加力学对象！</div>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
        return;
    }
    
    const logDiv = document.getElementById('log');
    const resultDiv = document.getElementById('result');
    logDiv.innerHTML = '';
    resultDiv.innerHTML = '';
    
    // 显示对象确认信息
    const confirmationHTML = showObjectConfirmation();
    logDiv.innerHTML = confirmationHTML;
    
    // 添加确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.className = 'btn btn-primary mt-3';
    confirmButton.textContent = '确认求解';
    confirmButton.onclick = function() {
        try {
            // 清空日志区域
            logDiv.innerHTML = '<h5>【求解日志】</h5>';
            
            // 记录开始时间
            const startTime = new Date();
            logDiv.innerHTML += `<p>求解开始时间：${startTime.toLocaleString()}</p>`;
            
            // 统计自由度
            let dof = 3; // 平面问题有3个自由度
            let constraints = 0;
            
            mechanicsObjects.forEach(obj => {
                if (obj.type === 'gdjzz') {
                    constraints += 2;
                } else if (obj.type === 'hdjzz') {
                    constraints += 1;
                } else if (obj.type === 'gdzz') {
                    constraints += 3;
                }
            });
            
            const remainingDof = dof - constraints;
            logDiv.innerHTML += `<p>系统自由度：${dof}</p>`;
            logDiv.innerHTML += `<p>约束数量：${constraints}</p>`;
            logDiv.innerHTML += `<p>剩余自由度：${remainingDof}</p>`;
            
            if (remainingDof === 0) {
                logDiv.innerHTML += `<p class="text-success">系统静定，可以求解</p>`;
            } else if (remainingDof > 0) {
                throw new Error('系统静不定，无法求解');
            } else {
                throw new Error('系统超静定，无法求解');
            }
            
            // 创建求解器并求解
            const sol = new Solver(mechanicsObjects);
            logDiv.innerHTML += `<p>正在求解方程...</p>`;
            const X = sol.solveEquation();
            logDiv.innerHTML += `<p class="text-success">方程求解成功</p>`;
            
            // 记录结束时间
            const endTime = new Date();
            const duration = (endTime - startTime) / 1000;
            logDiv.innerHTML += `<p>求解结束时间：${endTime.toLocaleString()}</p>`;
            logDiv.innerHTML += `<p>求解耗时：${duration.toFixed(3)} 秒</p>`;
            
            // 显示求解结果
            resultDiv.innerHTML = '<h5>【求解结果】</h5>';
            // 将math.js矩阵转换为普通数组
            const X_array = math.flatten(X).toArray();
            
            // 格式化显示结果，添加标注
            let resultHTML = '<div class="border p-3 rounded">';
            
            // 根据约束类型确定结果含义，顺序与compileEquation一致：固定铰 -> 滑动铰 -> 固定支座
            let constraintCount = 0;
            let resultLabels = [];
            
            // 先处理固定铰
            mechanicsObjects.forEach(obj => {
                if (obj.type === 'gdjzz') {
                    resultLabels.push('固定铰 (位置: (' + obj.place[0].toFixed(3) + ', ' + obj.place[1].toFixed(3) + ') m) X方向约束力');
                    resultLabels.push('固定铰 (位置: (' + obj.place[0].toFixed(3) + ', ' + obj.place[1].toFixed(3) + ') m) Y方向约束力');
                    constraintCount += 2;
                }
            });
            
            // 再处理滑动铰
            mechanicsObjects.forEach(obj => {
                if (obj.type === 'hdjzz') {
                    resultLabels.push('滑动铰 (位置: (' + obj.place[0].toFixed(3) + ', ' + obj.place[1].toFixed(3) + ') m) 滑动方向约束力');
                    constraintCount += 1;
                }
            });
            
            // 最后处理固定支座
            mechanicsObjects.forEach(obj => {
                if (obj.type === 'gdzz') {
                    resultLabels.push('固定支座 (位置: (' + obj.place[0].toFixed(3) + ', ' + obj.place[1].toFixed(3) + ') m) X方向约束力');
                    resultLabels.push('固定支座 (位置: (' + obj.place[0].toFixed(3) + ', ' + obj.place[1].toFixed(3) + ') m) Y方向约束力');
                    resultLabels.push('固定支座 (位置: (' + obj.place[0].toFixed(3) + ', ' + obj.place[1].toFixed(3) + ') m) 约束力矩');
                    constraintCount += 3;
                }
            });
            
            // 显示结果
            for (let i = 0; i < X_array.length; i++) {
                const label = resultLabels[i] || `约束力 ${i+1}`;
                const value = X_array[i].toFixed(4);
                // 根据标签判断单位
                let unit = 'N';
                if (label.includes('力矩')) {
                    unit = 'N·m';
                }
                resultHTML += `<p><strong>${label}：</strong>${value} ${unit}</p>`;
            }
            
            resultHTML += '</div>';
            resultDiv.innerHTML += resultHTML;
            
            // 切换到约束力标签页
            const constraintTab = new bootstrap.Tab(document.getElementById('constraint-tab'));
            constraintTab.show();
            
        } catch (e) {
            logDiv.innerHTML += `<div class="alert alert-danger mt-3">求解失败：${e.message}</div>`;
        }
    };
    
    logDiv.appendChild(confirmButton);
}

// 可视化模型
function visualizeModel() {
    const visualizationDiv = document.getElementById('visualization');
    visualizationDiv.innerHTML = '';
    
    // 创建SVG元素
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 800 600');
    
    // 添加网格
    for (let i = 0; i <= 800; i += 50) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', i);
        line.setAttribute('y1', 0);
        line.setAttribute('x2', i);
        line.setAttribute('y2', 600);
        line.setAttribute('stroke', '#e0e0e0');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }
    
    for (let i = 0; i <= 600; i += 50) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', 0);
        line.setAttribute('y1', i);
        line.setAttribute('x2', 800);
        line.setAttribute('y2', i);
        line.setAttribute('stroke', '#e0e0e0');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }
    
    // 转换坐标：将力学模型坐标转换为SVG坐标
    function toSVGCoord(x, y) {
        // 简单的线性变换，将 (-10, 10) 映射到 (0, 800) 和 (600, 0)
        const svgX = (x + 10) * 40;
        const svgY = (10 - y) * 30;
        return [svgX, svgY];
    }
    
    // 绘制力
    mechanicsObjects.forEach(obj => {
        if (obj.type === 'outerforce') {
            const [x, y] = toSVGCoord(obj.place[0], obj.place[1]);
            const forceLength = 50;
            const endX = x + obj.direc[0] * forceLength;
            const endY = y - obj.direc[1] * forceLength;
            
            // 绘制力的线段
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', y);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', endY);
            line.setAttribute('stroke', 'red');
            line.setAttribute('stroke-width', '2');
            svg.appendChild(line);
            
            // 绘制箭头
            const arrowSize = 10;
            const angle = Math.atan2(endY - y, endX - x);
            const arrow1X = endX - arrowSize * Math.cos(angle - Math.PI / 6);
            const arrow1Y = endY - arrowSize * Math.sin(angle - Math.PI / 6);
            const arrow2X = endX - arrowSize * Math.cos(angle + Math.PI / 6);
            const arrow2Y = endY - arrowSize * Math.sin(angle + Math.PI / 6);
            
            const arrow1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            arrow1.setAttribute('x1', endX);
            arrow1.setAttribute('y1', endY);
            arrow1.setAttribute('x2', arrow1X);
            arrow1.setAttribute('y2', arrow1Y);
            arrow1.setAttribute('stroke', 'red');
            arrow1.setAttribute('stroke-width', '2');
            svg.appendChild(arrow1);
            
            const arrow2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            arrow2.setAttribute('x1', endX);
            arrow2.setAttribute('y1', endY);
            arrow2.setAttribute('x2', arrow2X);
            arrow2.setAttribute('y2', arrow2Y);
            arrow2.setAttribute('stroke', 'red');
            arrow2.setAttribute('stroke-width', '2');
            svg.appendChild(arrow2);
        } else if (obj.type === 'gdjzz') {
            const [x, y] = toSVGCoord(obj.place[0], obj.place[1]);
            
            // 绘制固定铰
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', 15);
            circle.setAttribute('stroke', 'blue');
            circle.setAttribute('stroke-width', '2');
            circle.setAttribute('fill', 'none');
            svg.appendChild(circle);
            
            // 绘制固定铰的十字
            const cross1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            cross1.setAttribute('x1', x - 10);
            cross1.setAttribute('y1', y);
            cross1.setAttribute('x2', x + 10);
            cross1.setAttribute('y2', y);
            cross1.setAttribute('stroke', 'blue');
            cross1.setAttribute('stroke-width', '2');
            svg.appendChild(cross1);
            
            const cross2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            cross2.setAttribute('x1', x);
            cross2.setAttribute('y1', y - 10);
            cross2.setAttribute('x2', x);
            cross2.setAttribute('y2', y + 10);
            cross2.setAttribute('stroke', 'blue');
            cross2.setAttribute('stroke-width', '2');
            svg.appendChild(cross2);
        } else if (obj.type === 'hdjzz') {
            const [x, y] = toSVGCoord(obj.place[0], obj.place[1]);
            
            // 绘制滑动铰
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', 15);
            circle.setAttribute('stroke', 'green');
            circle.setAttribute('stroke-width', '2');
            circle.setAttribute('fill', 'none');
            svg.appendChild(circle);
            
            // 绘制滑动方向
            const directionLength = 30;
            const endX = x + obj.direc[0] * directionLength;
            const endY = y - obj.direc[1] * directionLength;
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x - obj.direc[0] * directionLength);
            line.setAttribute('y1', y + obj.direc[1] * directionLength);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', endY);
            line.setAttribute('stroke', 'green');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-dasharray', '5,5');
            svg.appendChild(line);
        } else if (obj.type === 'gdzz') {
            const [x, y] = toSVGCoord(obj.place[0], obj.place[1]);
            
            // 绘制固定支座
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x - 20);
            rect.setAttribute('y', y - 10);
            rect.setAttribute('width', 40);
            rect.setAttribute('height', 20);
            rect.setAttribute('stroke', 'purple');
            rect.setAttribute('stroke-width', '2');
            rect.setAttribute('fill', 'none');
            svg.appendChild(rect);
            
            // 绘制固定支座的锚点
            for (let i = -15; i <= 15; i += 10) {
                const anchor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                anchor.setAttribute('cx', x + i);
                anchor.setAttribute('cy', y + 10);
                anchor.setAttribute('r', 3);
                anchor.setAttribute('stroke', 'purple');
                anchor.setAttribute('stroke-width', '1');
                anchor.setAttribute('fill', 'purple');
                svg.appendChild(anchor);
            }
        }
    });
    
    visualizationDiv.appendChild(svg);
}

// 显示已添加的力学对象
function displayObjects() {
    const objectsList = document.getElementById('objects-list');
    if (!objectsList) {
        console.error('objects-list element not found');
        return;
    }
    
    objectsList.innerHTML = '';
    
    // 通过检查所有大标签页的class来确定当前活动的大标签页
    const globalTab = document.getElementById('global');
    const forceTab = document.getElementById('force');
    const constraintTab = document.getElementById('constraint');
    
    let activeTabId = '';
    if (globalTab && globalTab.classList.contains('active')) {
        activeTabId = 'global';
    } else if (forceTab && forceTab.classList.contains('active')) {
        activeTabId = 'force';
    } else if (constraintTab && constraintTab.classList.contains('active')) {
        activeTabId = 'constraint';
    }
    
    // 按类型分组
    const forces = mechanicsObjects.filter(obj => obj.type === 'outerforce');
    const moments = mechanicsObjects.filter(obj => obj.type === 'outertorque');
    const distributedForces = mechanicsObjects.filter(obj => obj.type === 'fenbuforce');
    const distributedMoments = mechanicsObjects.filter(obj => obj.type === 'fenbutorque');
    const fixedHinges = mechanicsObjects.filter(obj => obj.type === 'gdjzz');
    const slidingHinges = mechanicsObjects.filter(obj => obj.type === 'hdjzz');
    const fixedSupports = mechanicsObjects.filter(obj => obj.type === 'gdzz');
    
    // 调试信息
    console.log('Active tab:', activeTabId);
    console.log('Mechanics objects count:', mechanicsObjects.length);
    console.log('Forces:', forces.length);
    console.log('Moments:', moments.length);
    console.log('Distributed forces:', distributedForces.length);
    console.log('Distributed moments:', distributedMoments.length);
    console.log('Fixed hinges:', fixedHinges.length);
    console.log('Sliding hinges:', slidingHinges.length);
    console.log('Fixed supports:', fixedSupports.length);
    
    // 根据当前活动标签页显示对应的对象
    if (activeTabId === 'force') {
        // 显示力相关对象
        // 显示集中力
        if (forces.length > 0) {
            const forcesSection = document.createElement('div');
            forcesSection.className = 'mb-4';
            forcesSection.innerHTML = `<h6>集中力 (${forces.length}个)</h6>`;
            
            forces.forEach((force, index) => {
                const forceElement = document.createElement('div');
                forceElement.className = 'card mb-2';
                forceElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">值: ${force.originalValue || force.value} ${force.unit}, 作用点: (${force.place[0].toFixed(3)}, ${force.place[1].toFixed(3)}) ${force.lengthUnit}, 方向: (${force.direc[0]}, ${force.direc[1]})</p>
                        <button class="btn btn-sm btn-danger" onclick="deleteObject(${mechanicsObjects.indexOf(force)})">删除</button>
                    </div>
                `;
                forcesSection.appendChild(forceElement);
            });
            
            objectsList.appendChild(forcesSection);
        }
        
        // 显示集中力矩
        if (moments.length > 0) {
            const momentsSection = document.createElement('div');
            momentsSection.className = 'mb-4';
            momentsSection.innerHTML = `<h6>集中力矩 (${moments.length}个)</h6>`;
            
            moments.forEach((moment, index) => {
                const momentElement = document.createElement('div');
                momentElement.className = 'card mb-2';
                momentElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">值: ${moment.originalValue || moment.value} ${moment.unit}, 作用点: (${moment.place[0].toFixed(3)}, ${moment.place[1].toFixed(3)}) ${moment.lengthUnit}</p>
                        <button class="btn btn-sm btn-danger" onclick="deleteObject(${mechanicsObjects.indexOf(moment)})">删除</button>
                    </div>
                `;
                momentsSection.appendChild(momentElement);
            });
            
            objectsList.appendChild(momentsSection);
        }
        
        // 显示分布力
        if (distributedForces.length > 0) {
            const distributedForcesSection = document.createElement('div');
            distributedForcesSection.className = 'mb-4';
            distributedForcesSection.innerHTML = `<h6>分布力 (${distributedForces.length}个)</h6>`;
            
            distributedForces.forEach((force, index) => {
                const forceElement = document.createElement('div');
                forceElement.className = 'card mb-2';
                forceElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">集度: ${force.originalQ || force.q} ${force.unit}, 起点: (${force.start[0].toFixed(3)}, ${force.start[1].toFixed(3)}) ${force.lengthUnit}, 终点: (${force.end[0].toFixed(3)}, ${force.end[1].toFixed(3)}) ${force.lengthUnit}, 方向: (${force.direc[0]}, ${force.direc[1]})</p>
                        <button class="btn btn-sm btn-danger" onclick="deleteObject(${mechanicsObjects.indexOf(force)})">删除</button>
                    </div>
                `;
                distributedForcesSection.appendChild(forceElement);
            });
            
            objectsList.appendChild(distributedForcesSection);
        }
        
        // 显示分布力矩
        if (distributedMoments.length > 0) {
            const distributedMomentsSection = document.createElement('div');
            distributedMomentsSection.className = 'mb-4';
            distributedMomentsSection.innerHTML = `<h6>分布力矩 (${distributedMoments.length}个)</h6>`;
            
            distributedMoments.forEach((moment, index) => {
                const momentElement = document.createElement('div');
                momentElement.className = 'card mb-2';
                momentElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">力矩集度: ${moment.originalM || moment.m} ${moment.unit}, 起点: (${moment.start[0].toFixed(3)}, ${moment.start[1].toFixed(3)}) ${moment.lengthUnit}, 终点: (${moment.end[0].toFixed(3)}, ${moment.end[1].toFixed(3)}) ${moment.lengthUnit}</p>
                        <button class="btn btn-sm btn-danger" onclick="deleteObject(${mechanicsObjects.indexOf(moment)})">删除</button>
                    </div>
                `;
                distributedMomentsSection.appendChild(momentElement);
            });
            
            objectsList.appendChild(distributedMomentsSection);
        }
    } else if (activeTabId === 'constraint') {
        // 显示约束相关对象
        // 显示固定铰
        if (fixedHinges.length > 0) {
            const fixedHingesSection = document.createElement('div');
            fixedHingesSection.className = 'mb-4';
            fixedHingesSection.innerHTML = `<h6>固定铰 (${fixedHinges.length}个)</h6>`;
            
            fixedHinges.forEach((hinge, index) => {
                const hingeElement = document.createElement('div');
                hingeElement.className = 'card mb-2';
                hingeElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">位置: (${hinge.place[0].toFixed(3)}, ${hinge.place[1].toFixed(3)}) ${hinge.lengthUnit}</p>
                        <button class="btn btn-sm btn-danger" onclick="deleteObject(${mechanicsObjects.indexOf(hinge)})">删除</button>
                    </div>
                `;
                fixedHingesSection.appendChild(hingeElement);
            });
            
            objectsList.appendChild(fixedHingesSection);
        }
        
        // 显示滑动铰
        if (slidingHinges.length > 0) {
            const slidingHingesSection = document.createElement('div');
            slidingHingesSection.className = 'mb-4';
            slidingHingesSection.innerHTML = `<h6>滑动铰 (${slidingHinges.length}个)</h6>`;
            
            slidingHinges.forEach((hinge, index) => {
                const hingeElement = document.createElement('div');
                hingeElement.className = 'card mb-2';
                hingeElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">位置: (${hinge.place[0].toFixed(3)}, ${hinge.place[1].toFixed(3)}) ${hinge.lengthUnit}, 方向: (${hinge.direc[0]}, ${hinge.direc[1]})</p>
                        <button class="btn btn-sm btn-danger" onclick="deleteObject(${mechanicsObjects.indexOf(hinge)})">删除</button>
                    </div>
                `;
                slidingHingesSection.appendChild(hingeElement);
            });
            
            objectsList.appendChild(slidingHingesSection);
        }
        
        // 显示固定支座
        if (fixedSupports.length > 0) {
            const fixedSupportsSection = document.createElement('div');
            fixedSupportsSection.className = 'mb-4';
            fixedSupportsSection.innerHTML = `<h6>固定支座 (${fixedSupports.length}个)</h6>`;
            
            fixedSupports.forEach((support, index) => {
                const supportElement = document.createElement('div');
                supportElement.className = 'card mb-2';
                supportElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">位置: (${support.place[0].toFixed(3)}, ${support.place[1].toFixed(3)}) ${support.lengthUnit}</p>
                        <button class="btn btn-sm btn-danger" onclick="deleteObject(${mechanicsObjects.indexOf(support)})">删除</button>
                    </div>
                `;
                fixedSupportsSection.appendChild(supportElement);
            });
            
            objectsList.appendChild(fixedSupportsSection);
        }
    }
    
    // 如果没有对象，显示提示
    if (objectsList.innerHTML === '') {
        objectsList.innerHTML = '<p class="text-muted">暂无添加的对象</p>';
    }
}

// 删除对象
function deleteObject(index) {
    mechanicsObjects.splice(index, 1);
    displayObjects();
    
    // 在日志中显示
    const logDiv = document.getElementById('log');
    logDiv.innerHTML = '<h5>【操作日志】</h5>';
    logDiv.innerHTML += `<p>对象删除成功！</p>`;
    
    // 切换到日志标签页
    const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
    logTab.show();
}

// 编辑对象（简化版，实际应用中需要创建编辑表单）
function editObject(index) {
    // 在日志中显示
    const logDiv = document.getElementById('log');
    logDiv.innerHTML = '<h5>【操作日志】</h5>';
    logDiv.innerHTML += `<p>编辑功能暂未实现，敬请期待！</p>`;
    
    // 切换到日志标签页
    const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
    logTab.show();
}

// 页面加载完成后绑定事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 绑定应用全局单位按钮
    document.getElementById('applyUnits').addEventListener('click', applyGlobalUnits);
    
    // 绑定外力定义按钮
    document.getElementById('add-force').addEventListener('click', addForce);
    document.getElementById('add-moment').addEventListener('click', addMoment);
    document.getElementById('add-distributed-force').addEventListener('click', addDistributedForce);
    document.getElementById('add-distributed-moment').addEventListener('click', addDistributedMoment);
    
    // 绑定约束定义按钮
    document.getElementById('add-fixed-hinge').addEventListener('click', addFixedHinge);
    document.getElementById('add-sliding-hinge').addEventListener('click', addSlidingHinge);
    document.getElementById('add-fixed').addEventListener('click', addFixed);
    
    // 显示已添加的对象
    displayObjects();
});
