// 单位转换函数
function convertForceUnit(value, fromUnit) {
    const toUnit = globalUnits.force;
    const units = {
        'N': 1,
        'kN': 1000,
        'MN': 1000000
    };
    return value * units[fromUnit] / units[toUnit];
}

function convertTorqueUnit(value, fromUnit) {
    const toUnit = globalUnits.torque;
    const units = {
        'N·m': 1,
        'kN·m': 1000,
        'MN·m': 1000000
    };
    return value * units[fromUnit] / units[toUnit];
}

function convertLengthUnit(value, fromUnit) {
    const toUnit = globalUnits.length;
    const units = {
        'm': 1,
        'cm': 0.01,
        'mm': 0.001,
        'km': 1000
    };
    return value * units[fromUnit] / units[toUnit];
}

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
    document.addEventListener('shown.bs.tab', function() {
        // 切换标签页后更新显示
        console.log('Tab switched, updating objects display');
        console.log('Mechanics objects count:', mechanicsObjects.length);
        displayObjects();
    });
    
    // 预览梁按钮点击事件
    document.getElementById('preview-beam').addEventListener('click', function() {
        previewBeam();
    });
    
    // 初始化梁方向按钮样式
    setBeamDirection('+X');
    
    // 初始化力、分布力和滑动铰的方向按钮样式
    setDirection('+X');
    
    // 初始显示
    displayObjects();
});

// 设置梁的方向
function setBeamDirection(direction) {
    document.getElementById('beam-direction').value = direction;
    
    // 更新方向按钮的样式
    const buttons = document.querySelectorAll('.beam-direction-btn');
    buttons.forEach(button => {
        if (button.dataset.direction === direction) {
            button.classList.remove('btn-secondary');
            button.classList.add('btn-primary');
        } else {
            button.classList.remove('btn-primary');
            button.classList.add('btn-secondary');
        }
    });
}

// 根据预设方向更新方向输入字段
function setDirection(direction) {
    switch (direction) {
        case '+X':
            document.getElementById('force-direction-x').value = '1';
            document.getElementById('force-direction-y').value = '0';
            document.getElementById('distributed-force-direction-x').value = '1';
            document.getElementById('distributed-force-direction-y').value = '0';
            document.getElementById('sliding-hinge-direction-x').value = '1';
            document.getElementById('sliding-hinge-direction-y').value = '0';
            break;
        case '-X':
            document.getElementById('force-direction-x').value = '-1';
            document.getElementById('force-direction-y').value = '0';
            document.getElementById('distributed-force-direction-x').value = '-1';
            document.getElementById('distributed-force-direction-y').value = '0';
            document.getElementById('sliding-hinge-direction-x').value = '-1';
            document.getElementById('sliding-hinge-direction-y').value = '0';
            break;
        case '+Y':
            document.getElementById('force-direction-x').value = '0';
            document.getElementById('force-direction-y').value = '1';
            document.getElementById('distributed-force-direction-x').value = '0';
            document.getElementById('distributed-force-direction-y').value = '1';
            document.getElementById('sliding-hinge-direction-x').value = '0';
            document.getElementById('sliding-hinge-direction-y').value = '1';
            break;
        case '-Y':
            document.getElementById('force-direction-x').value = '0';
            document.getElementById('force-direction-y').value = '-1';
            document.getElementById('distributed-force-direction-x').value = '0';
            document.getElementById('distributed-force-direction-y').value = '-1';
            document.getElementById('sliding-hinge-direction-x').value = '0';
            document.getElementById('sliding-hinge-direction-y').value = '-1';
            break;
    }
    
    // 更新所有方向按钮的样式
    const buttons = document.querySelectorAll('.direction-btn');
    buttons.forEach(button => {
        if (button.dataset.direction === direction) {
            button.classList.remove('btn-secondary');
            button.classList.add('btn-primary');
        } else {
            button.classList.remove('btn-primary');
            button.classList.add('btn-secondary');
        }
    });
}
// 添加集中力
function addForce() {
    try {
        // 获取输入值
        const value = parseExpression(document.getElementById('force-value').value);
        const unit = document.getElementById('force-unit').value;
        const placeX = parseExpression(document.getElementById('force-place-x').value);
        const placeY = parseExpression(document.getElementById('force-place-y').value);
        const directionX = parseExpression(document.getElementById('force-direction-x').value);
        const directionY = parseExpression(document.getElementById('force-direction-y').value);
        
        // 计算方向向量的模长
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        if (magnitude === 0) {
            throw new Error('方向向量不能为零');
        }
        
        // 归一化方向向量
        const direcX = directionX / magnitude;
        const direcY = directionY / magnitude;
        
        // 转换单位
        const convertedValue = convertForceUnit(value, unit);
        
        // 创建力对象
        const force = {
            type: 'outerforce',
            value: convertedValue,
            originalValue: value,
            unit: unit,
            place: [placeX, placeY],
            direc: [direcX, direcY],
            lengthUnit: globalUnits.length
        };
        
        // 添加到力学对象列表
        mechanicsObjects.push(force);
        
        // 更新显示
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>集中力添加成功！</p>`;
        logDiv.innerHTML += `<p>值：${value} ${unit}</p>`;
        logDiv.innerHTML += `<p>作用点：(${placeX.toFixed(2)}, ${placeY.toFixed(2)})</p>`;
        logDiv.innerHTML += `<p>方向：(${direcX.toFixed(2)}, ${direcY.toFixed(2)})</p>`;
        
        // 清空输入字段
        document.getElementById('force-value').value = '';
        document.getElementById('force-place-x').value = '0';
        document.getElementById('force-place-y').value = '0';
        document.getElementById('force-direction-x').value = '1';
        document.getElementById('force-direction-y').value = '0';
        setDirection('+X');
        
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
        // 获取输入值
        const value = parseExpression(document.getElementById('moment-value').value);
        const unit = document.getElementById('moment-unit').value;
        const placeX = parseExpression(document.getElementById('moment-place-x').value);
        const placeY = parseExpression(document.getElementById('moment-place-y').value);
        
        // 转换单位
        const convertedValue = convertTorqueUnit(value, unit);
        
        // 创建力矩对象
        const moment = {
            type: 'outertorque',
            value: convertedValue,
            originalValue: value,
            unit: unit,
            place: [placeX, placeY],
            lengthUnit: globalUnits.length
        };
        
        // 添加到力学对象列表
        mechanicsObjects.push(moment);
        
        // 更新显示
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>集中力矩添加成功！</p>`;
        logDiv.innerHTML += `<p>值：${value} ${unit}</p>`;
        logDiv.innerHTML += `<p>作用点：(${placeX.toFixed(2)}, ${placeY.toFixed(2)})</p>`;
        
        // 清空输入字段
        document.getElementById('moment-value').value = '';
        document.getElementById('moment-place-x').value = '0';
        document.getElementById('moment-place-y').value = '0';
        
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
        // 获取输入值
        const q = parseExpression(document.getElementById('distributed-force-value').value);
        const unit = document.getElementById('distributed-force-unit').value;
        const startX = parseExpression(document.getElementById('distributed-force-start-x').value);
        const startY = parseExpression(document.getElementById('distributed-force-start-y').value);
        const endX = parseExpression(document.getElementById('distributed-force-end-x').value);
        const endY = parseExpression(document.getElementById('distributed-force-end-y').value);
        const directionX = parseExpression(document.getElementById('distributed-force-direction-x').value);
        const directionY = parseExpression(document.getElementById('distributed-force-direction-y').value);
        
        // 计算方向向量的模长
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        if (magnitude === 0) {
            throw new Error('方向向量不能为零');
        }
        
        // 归一化方向向量
        const direcX = directionX / magnitude;
        const direcY = directionY / magnitude;
        
        // 转换单位
        const convertedQ = convertForceUnit(q, unit);
        
        // 创建分布力对象
        const distributedForce = {
            type: 'fenbuforce',
            q: convertedQ,
            originalQ: q,
            unit: unit,
            start: [startX, startY],
            end: [endX, endY],
            direc: [direcX, direcY],
            lengthUnit: globalUnits.length
        };
        
        // 添加到力学对象列表
        mechanicsObjects.push(distributedForce);
        
        // 更新显示
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>分布力添加成功！</p>`;
        logDiv.innerHTML += `<p>集度：${q} ${unit}</p>`;
        logDiv.innerHTML += `<p>起点：(${startX.toFixed(2)}, ${startY.toFixed(2)})</p>`;
        logDiv.innerHTML += `<p>终点：(${endX.toFixed(2)}, ${endY.toFixed(2)})</p>`;
        logDiv.innerHTML += `<p>方向：(${direcX.toFixed(2)}, ${direcY.toFixed(2)})</p>`;
        
        // 清空输入字段
        document.getElementById('distributed-force-value').value = '';
        document.getElementById('distributed-force-start-x').value = '0';
        document.getElementById('distributed-force-start-y').value = '0';
        document.getElementById('distributed-force-end-x').value = '0';
        document.getElementById('distributed-force-end-y').value = '0';
        document.getElementById('distributed-force-direction-x').value = '0';
        document.getElementById('distributed-force-direction-y').value = '1';
        setDirection('+Y');
        
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



// 添加固定铰
function addFixedHinge() {
    try {
        // 获取输入值
        const placeX = parseExpression(document.getElementById('fixed-hinge-position-x').value);
        const placeY = parseExpression(document.getElementById('fixed-hinge-position-y').value);
        
        // 创建固定铰对象
        const fixedHinge = {
            type: 'gdjzz',
            place: [placeX, placeY],
            lengthUnit: globalUnits.length
        };
        
        // 添加到力学对象列表
        mechanicsObjects.push(fixedHinge);
        
        // 更新显示
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>固定铰添加成功！</p>`;
        logDiv.innerHTML += `<p>位置：(${placeX.toFixed(2)}, ${placeY.toFixed(2)})</p>`;
        
        // 清空输入字段
        document.getElementById('fixed-hinge-position-x').value = '0';
        document.getElementById('fixed-hinge-position-y').value = '0';
        
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
        // 获取输入值
        const placeX = parseExpression(document.getElementById('sliding-hinge-position-x').value);
        const placeY = parseExpression(document.getElementById('sliding-hinge-position-y').value);
        const directionX = parseExpression(document.getElementById('sliding-hinge-direction-x').value);
        const directionY = parseExpression(document.getElementById('sliding-hinge-direction-y').value);
        
        // 计算方向向量的模长
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        if (magnitude === 0) {
            throw new Error('方向向量不能为零');
        }
        
        // 归一化方向向量
        const direcX = directionX / magnitude;
        const direcY = directionY / magnitude;
        
        // 创建滑动铰对象
        const slidingHinge = {
            type: 'hdjzz',
            place: [placeX, placeY],
            direc: [direcX, direcY],
            lengthUnit: globalUnits.length
        };
        
        // 添加到力学对象列表
        mechanicsObjects.push(slidingHinge);
        
        // 更新显示
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>滑动铰添加成功！</p>`;
        logDiv.innerHTML += `<p>位置：(${placeX.toFixed(2)}, ${placeY.toFixed(2)})</p>`;
        logDiv.innerHTML += `<p>方向：(${direcX.toFixed(2)}, ${direcY.toFixed(2)})</p>`;
        
        // 清空输入字段
        document.getElementById('sliding-hinge-position-x').value = '0';
        document.getElementById('sliding-hinge-position-y').value = '0';
        document.getElementById('sliding-hinge-direction-x').value = '1';
        document.getElementById('sliding-hinge-direction-y').value = '0';
        setDirection('+X');
        
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
        // 获取输入值
        const placeX = parseExpression(document.getElementById('fixed-position-x').value);
        const placeY = parseExpression(document.getElementById('fixed-position-y').value);
        
        // 创建固定支座对象
        const fixed = {
            type: 'gdzz',
            place: [placeX, placeY],
            lengthUnit: globalUnits.length
        };
        
        // 添加到力学对象列表
        mechanicsObjects.push(fixed);
        
        // 更新显示
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>固定支座添加成功！</p>`;
        logDiv.innerHTML += `<p>位置：(${placeX.toFixed(2)}, ${placeY.toFixed(2)})</p>`;
        
        // 清空输入字段
        document.getElementById('fixed-position-x').value = '0';
        document.getElementById('fixed-position-y').value = '0';
        
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

// 求解
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
    
    // 直接求解，跳过确认步骤
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
        
        // 计算内力图
        const beams = mechanicsObjects.filter(obj => obj.type === 'beam');
        if (beams.length > 0) {
            const beam = beams[0];
            
            // 提取约束力
            const constraintForces = [];
            let forceIndex = 0;
            
            // 固定铰约束力
            mechanicsObjects.forEach(obj => {
                if (obj.type === 'gdjzz') {
                    constraintForces.push({
                        value: X_array[forceIndex],
                        position: obj.place,
                        direction: [1, 0],
                        type: 'constraint'
                    });
                    forceIndex++;
                    constraintForces.push({
                        value: X_array[forceIndex],
                        position: obj.place,
                        direction: [0, 1],
                        type: 'constraint'
                    });
                    forceIndex++;
                }
            });
            
            // 滑动铰约束力
            mechanicsObjects.forEach(obj => {
                if (obj.type === 'hdjzz') {
                    constraintForces.push({
                        value: X_array[forceIndex],
                        position: obj.place,
                        direction: obj.direc,
                        type: 'constraint'
                    });
                    forceIndex++;
                }
            });
            
            // 固定支座约束力
            mechanicsObjects.forEach(obj => {
                if (obj.type === 'gdzz') {
                    constraintForces.push({
                        value: X_array[forceIndex],
                        position: obj.place,
                        direction: [1, 0],
                        type: 'constraint'
                    });
                    forceIndex++;
                    constraintForces.push({
                        value: X_array[forceIndex],
                        position: obj.place,
                        direction: [0, 1],
                        type: 'constraint'
                    });
                    forceIndex++;
                    constraintForces.push({
                        value: X_array[forceIndex],
                        position: obj.place,
                        direction: [0, 0],
                        type: 'constraint'
                    });
                    forceIndex++;
                }
            });
            
            // 计算内力
            const internalForcesData = calculateInternalForces(beam, mechanicsObjects, constraintForces);
            
            // 绘制内力图
            drawInternalForcesDiagram(internalForcesData, 'internal-forces');
            
            logDiv.innerHTML += `<p class="text-success">内力图计算完成</p>`;
        }
        
        // 切换到约束力标签页
        const constraintTab = new bootstrap.Tab(document.getElementById('constraint-tab'));
        constraintTab.show();
        
    } catch (e) {
        logDiv.innerHTML += `<div class="alert alert-danger mt-3">求解失败：${e.message}</div>`;
    }
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
    
    // 转换坐标：将SVG坐标转换为力学模型坐标
    function fromSVGCoord(svgX, svgY) {
        const x = (svgX / 40) - 10;
        const y = 10 - (svgY / 30);
        return [x, y];
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
        } else if (obj.type === 'beam') {
            const [startX, startY] = toSVGCoord(obj.start[0], obj.start[1]);
            const [endX, endY] = toSVGCoord(obj.end[0], obj.end[1]);
            
            // 绘制梁
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', startX);
            line.setAttribute('y1', startY);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', endY);
            line.setAttribute('stroke', 'black');
            line.setAttribute('stroke-width', '3');
            svg.appendChild(line);
            
            // 绘制起点和终点
            const startPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            startPoint.setAttribute('cx', startX);
            startPoint.setAttribute('cy', startY);
            startPoint.setAttribute('r', '5');
            startPoint.setAttribute('fill', 'red');
            svg.appendChild(startPoint);
            
            const endPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            endPoint.setAttribute('cx', endX);
            endPoint.setAttribute('cy', endY);
            endPoint.setAttribute('r', '5');
            endPoint.setAttribute('fill', 'blue');
            svg.appendChild(endPoint);
        }
    });
    
    // 添加点击事件，支持画布选点
    svg.addEventListener('click', function(e) {
        const rect = svg.getBoundingClientRect();
        const svgX = e.clientX - rect.left;
        const svgY = e.clientY - rect.top;
        
        // 转换为SVG内部坐标（考虑viewBox）
        const viewBox = svg.getAttribute('viewBox').split(' ').map(Number);
        const scaleX = viewBox[2] / rect.width;
        const scaleY = viewBox[3] / rect.height;
        const internalSVGX = svgX * scaleX;
        const internalSVGY = svgY * scaleY;
        
        // 转换为力学模型坐标
        const [modelX, modelY] = fromSVGCoord(internalSVGX, internalSVGY);
        
        // 查找当前活动的输入字段
        const activeInput = document.activeElement;
        if (activeInput && activeInput.type === 'text') {
            // 检查是否是坐标输入字段
            if (activeInput.id.includes('-x') || activeInput.id.includes('-y')) {
                if (activeInput.id.includes('-x')) {
                    activeInput.value = modelX.toFixed(2);
                } else if (activeInput.id.includes('-y')) {
                    activeInput.value = modelY.toFixed(2);
                }
            }
        }
    });
    
    visualizationDiv.appendChild(svg);
}

// 预览梁的几何图形
function previewBeam() {
    try {
        // 检查是否已经存在梁
        const existingBeams = mechanicsObjects.filter(obj => obj.type === 'beam');
        if (existingBeams.length > 0) {
            throw new Error('目前只允许有一个梁的存在');
        }
        
        // 获取输入的梁长度和方向
        const length = parseExpression(document.getElementById('beam-length').value);
        const direction = document.getElementById('beam-direction').value;
        
        // 获取梁的起点坐标
        const startX = parseExpression(document.getElementById('beam-start-x').value);
        const startY = parseExpression(document.getElementById('beam-start-y').value);
        let endX, endY;
        
        switch (direction) {
            case '+X':
                endX = startX + length;
                endY = startY;
                break;
            case '-X':
                endX = startX - length;
                endY = startY;
                break;
            case '+Y':
                endX = startX;
                endY = startY + length;
                break;
            case '-Y':
                endX = startX;
                endY = startY - length;
                break;
            default:
                throw new Error('无效的梁方向');
        }
        
        // 确定梁的方向类型
        const isHorizontal = direction === '+X' || direction === '-X';
        const isVertical = direction === '+Y' || direction === '-Y';
        
        // 获取可视化区域
        const visualizationDiv = document.getElementById('visualization');
        visualizationDiv.innerHTML = '';
        
        // 创建SVG元素
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 400 300');
        
        // 计算缩放和平移，使梁的中点位于画布中央
        const minX = Math.min(startX, endX);
        const maxX = Math.max(startX, endX);
        const minY = Math.min(startY, endY);
        const maxY = Math.max(startY, endY);
        const width = maxX - minX;
        const height = maxY - minY;
        const padding = 50;
        const scaleX = (400 - 2 * padding) / (width || 1);
        const scaleY = (300 - 2 * padding) / (height || 1);
        const scale = Math.min(scaleX, scaleY);
        
        // 计算梁的中点
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        // 计算平移，使梁的中点位于画布中央
        const canvasCenterX = 200; // 画布宽度的一半
        const canvasCenterY = 150; // 画布高度的一半
        const translateX = canvasCenterX - midX * scale;
        const translateY = canvasCenterY - midY * scale;
        
        // 绘制梁
        const beamElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        beamElement.setAttribute('x1', startX * scale + translateX);
        beamElement.setAttribute('y1', startY * scale + translateY);
        beamElement.setAttribute('x2', endX * scale + translateX);
        beamElement.setAttribute('y2', endY * scale + translateY);
        beamElement.setAttribute('stroke', 'black');
        beamElement.setAttribute('stroke-width', '3');
        svg.appendChild(beamElement);
        
        // 绘制起点和终点（不显示标签）
        const startPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        startPoint.setAttribute('cx', startX * scale + translateX);
        startPoint.setAttribute('cy', startY * scale + translateY);
        startPoint.setAttribute('r', '5');
        startPoint.setAttribute('fill', 'red');
        svg.appendChild(startPoint);
        
        const endPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        endPoint.setAttribute('cx', endX * scale + translateX);
        endPoint.setAttribute('cy', endY * scale + translateY);
        endPoint.setAttribute('r', '5');
        endPoint.setAttribute('fill', 'blue');
        svg.appendChild(endPoint);
        
        // 添加梁到可视化区域
        visualizationDiv.appendChild(svg);
        
        // 创建梁对象并添加到力学对象数组
        const beam = {
            type: 'beam',
            start: [startX, startY],
            end: [endX, endY],
            lengthUnit: globalUnits.length
        };
        mechanicsObjects.push(beam);
        
        // 更新工作树显示
        displayObjects();
        
        // 在日志中显示
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<p>梁添加成功！</p>`;
        logDiv.innerHTML += `<p>长度：${length} ${globalUnits.length}</p>`;
        logDiv.innerHTML += `<p>方向：${direction}</p>`;
        logDiv.innerHTML += `<p>起点：(${startX.toFixed(2)}, ${startY.toFixed(2)})</p>`;
        logDiv.innerHTML += `<p>终点：(${endX.toFixed(2)}, ${endY.toFixed(2)})</p>`;
        
        // 清空输入字段
        document.getElementById('beam-length').value = '1';
        document.getElementById('beam-start-x').value = '0';
        document.getElementById('beam-start-y').value = '0';
        setBeamDirection('+X');
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    } catch (e) {
        // 在日志中显示错误
        const logDiv = document.getElementById('log');
        logDiv.innerHTML = '<h5>【操作日志】</h5>';
        logDiv.innerHTML += `<div class="alert alert-danger">添加梁错误：${e.message}</div>`;
        
        // 切换到日志标签页
        const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
        logTab.show();
    }
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
    const geometryTab = document.getElementById('geometry');
    const forceTab = document.getElementById('force');
    const constraintTab = document.getElementById('constraint');
    
    let activeTabId = '';
    if (globalTab && globalTab.classList.contains('active')) {
        activeTabId = 'global';
    } else if (geometryTab && geometryTab.classList.contains('active')) {
        activeTabId = 'geometry';
    } else if (forceTab && forceTab.classList.contains('active')) {
        activeTabId = 'force';
    } else if (constraintTab && constraintTab.classList.contains('active')) {
        activeTabId = 'constraint';
    }
    
    // 按类型分组
    const beams = mechanicsObjects.filter(obj => obj.type === 'beam');
    const forces = mechanicsObjects.filter(obj => obj.type === 'outerforce');
    const moments = mechanicsObjects.filter(obj => obj.type === 'outertorque');
    const distributedForces = mechanicsObjects.filter(obj => obj.type === 'fenbuforce');
    const fixedHinges = mechanicsObjects.filter(obj => obj.type === 'gdjzz');
    const slidingHinges = mechanicsObjects.filter(obj => obj.type === 'hdjzz');
    const fixedSupports = mechanicsObjects.filter(obj => obj.type === 'gdzz');
    
    // 调试信息
    console.log('Active tab:', activeTabId);
    console.log('Mechanics objects count:', mechanicsObjects.length);
    console.log('Beams:', beams.length);
    console.log('Forces:', forces.length);
    console.log('Moments:', moments.length);
    console.log('Distributed forces:', distributedForces.length);
    console.log('Fixed hinges:', fixedHinges.length);
    console.log('Sliding hinges:', slidingHinges.length);
    console.log('Fixed supports:', fixedSupports.length);
    
    // 根据当前活动标签页显示对应的对象
    if (activeTabId === 'geometry') {
        // 显示几何相关对象
        // 显示梁
        if (beams.length > 0) {
            const beamsSection = document.createElement('div');
            beamsSection.className = 'mb-4';
            beamsSection.innerHTML = `<h6>梁 (${beams.length}个)</h6>`;
            
            beams.forEach((beam, index) => {
                const beamElement = document.createElement('div');
                beamElement.className = 'card mb-2';
                beamElement.style.cursor = 'pointer';
                beamElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">起点: (${beam.start[0].toFixed(3)}, ${beam.start[1].toFixed(3)}) ${beam.lengthUnit}, 终点: (${beam.end[0].toFixed(3)}, ${beam.end[1].toFixed(3)}) ${beam.lengthUnit}</p>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteObject(${mechanicsObjects.indexOf(beam)})">删除</button>
                    </div>
                `;
                beamElement.addEventListener('click', () => editObject(beam));
                beamsSection.appendChild(beamElement);
            });
            
            objectsList.appendChild(beamsSection);
        }
    } else if (activeTabId === 'force') {
        // 显示力相关对象
        // 显示集中力
        if (forces.length > 0) {
            const forcesSection = document.createElement('div');
            forcesSection.className = 'mb-4';
            forcesSection.innerHTML = `<h6>集中力 (${forces.length}个)</h6>`;
            
            forces.forEach((force, index) => {
                const forceElement = document.createElement('div');
                forceElement.className = 'card mb-2';
                forceElement.style.cursor = 'pointer';
                forceElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">值: ${force.originalValue || force.value} ${force.unit}, 作用点: (${force.place[0].toFixed(3)}, ${force.place[1].toFixed(3)}) ${force.lengthUnit}, 方向: (${force.direc[0]}, ${force.direc[1]})</p>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteObject(${mechanicsObjects.indexOf(force)})">删除</button>
                    </div>
                `;
                forceElement.addEventListener('click', () => editObject(force));
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
                momentElement.style.cursor = 'pointer';
                momentElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">值: ${moment.originalValue || moment.value} ${moment.unit}, 作用点: (${moment.place[0].toFixed(3)}, ${moment.place[1].toFixed(3)}) ${moment.lengthUnit}</p>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteObject(${mechanicsObjects.indexOf(moment)})">删除</button>
                    </div>
                `;
                momentElement.addEventListener('click', () => editObject(moment));
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
                forceElement.style.cursor = 'pointer';
                forceElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">集度: ${force.originalQ || force.q} ${force.unit}, 起点: (${force.start[0].toFixed(3)}, ${force.start[1].toFixed(3)}) ${force.lengthUnit}, 终点: (${force.end[0].toFixed(3)}, ${force.end[1].toFixed(3)}) ${force.lengthUnit}, 方向: (${force.direc[0]}, ${force.direc[1]})</p>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteObject(${mechanicsObjects.indexOf(force)})">删除</button>
                    </div>
                `;
                forceElement.addEventListener('click', () => editObject(force));
                distributedForcesSection.appendChild(forceElement);
            });
            
            objectsList.appendChild(distributedForcesSection);
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
                hingeElement.style.cursor = 'pointer';
                hingeElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">位置: (${hinge.place[0].toFixed(3)}, ${hinge.place[1].toFixed(3)}) ${hinge.lengthUnit}</p>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteObject(${mechanicsObjects.indexOf(hinge)})">删除</button>
                    </div>
                `;
                hingeElement.addEventListener('click', () => editObject(hinge));
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
                hingeElement.style.cursor = 'pointer';
                hingeElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">位置: (${hinge.place[0].toFixed(3)}, ${hinge.place[1].toFixed(3)}) ${hinge.lengthUnit}, 方向: (${hinge.direc[0]}, ${hinge.direc[1]})</p>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteObject(${mechanicsObjects.indexOf(hinge)})">删除</button>
                    </div>
                `;
                hingeElement.addEventListener('click', () => editObject(hinge));
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
                supportElement.style.cursor = 'pointer';
                supportElement.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="mb-0">位置: (${support.place[0].toFixed(3)}, ${support.place[1].toFixed(3)}) ${support.lengthUnit}</p>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteObject(${mechanicsObjects.indexOf(support)})">删除</button>
                    </div>
                `;
                supportElement.addEventListener('click', () => editObject(support));
                fixedSupportsSection.appendChild(supportElement);
            });
            
            objectsList.appendChild(fixedSupportsSection);
        }
    }
    
}

// 编辑对象
function editObject(obj) {
    let content = '';
    let title = '';
    
    switch (obj.type) {
        case 'beam':
            title = '编辑梁';
            content = `
                <div class="mb-3">
                    <label class="form-label">起点X坐标:</label>
                    <input type="text" id="edit-beam-start-x" class="form-control" value="${obj.start[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">起点Y坐标:</label>
                    <input type="text" id="edit-beam-start-y" class="form-control" value="${obj.start[1]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">终点X坐标:</label>
                    <input type="text" id="edit-beam-end-x" class="form-control" value="${obj.end[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">终点Y坐标:</label>
                    <input type="text" id="edit-beam-end-y" class="form-control" value="${obj.end[1]}">
                </div>
            `;
            break;
        case 'outerforce':
            title = '编辑集中力';
            content = `
                <div class="mb-3">
                    <label class="form-label">力的大小:</label>
                    <input type="text" id="edit-force-value" class="form-control" value="${obj.originalValue || obj.value}">
                </div>
                <div class="mb-3">
                    <label class="form-label">作用点X坐标:</label>
                    <input type="text" id="edit-force-place-x" class="form-control" value="${obj.place[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">作用点Y坐标:</label>
                    <input type="text" id="edit-force-place-y" class="form-control" value="${obj.place[1]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">方向X分量:</label>
                    <input type="text" id="edit-force-direction-x" class="form-control" value="${obj.direc[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">方向Y分量:</label>
                    <input type="text" id="edit-force-direction-y" class="form-control" value="${obj.direc[1]}">
                </div>
            `;
            break;
        case 'outertorque':
            title = '编辑集中力矩';
            content = `
                <div class="mb-3">
                    <label class="form-label">力矩大小:</label>
                    <input type="text" id="edit-moment-value" class="form-control" value="${obj.originalValue || obj.value}">
                </div>
                <div class="mb-3">
                    <label class="form-label">作用点X坐标:</label>
                    <input type="text" id="edit-moment-place-x" class="form-control" value="${obj.place[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">作用点Y坐标:</label>
                    <input type="text" id="edit-moment-place-y" class="form-control" value="${obj.place[1]}">
                </div>
            `;
            break;
        case 'fenbuforce':
            title = '编辑分布力';
            content = `
                <div class="mb-3">
                    <label class="form-label">集度:</label>
                    <input type="text" id="edit-distributed-force-value" class="form-control" value="${obj.originalQ || obj.q}">
                </div>
                <div class="mb-3">
                    <label class="form-label">起点X坐标:</label>
                    <input type="text" id="edit-distributed-force-start-x" class="form-control" value="${obj.start[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">起点Y坐标:</label>
                    <input type="text" id="edit-distributed-force-start-y" class="form-control" value="${obj.start[1]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">终点X坐标:</label>
                    <input type="text" id="edit-distributed-force-end-x" class="form-control" value="${obj.end[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">终点Y坐标:</label>
                    <input type="text" id="edit-distributed-force-end-y" class="form-control" value="${obj.end[1]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">方向X分量:</label>
                    <input type="text" id="edit-distributed-force-direction-x" class="form-control" value="${obj.direc[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">方向Y分量:</label>
                    <input type="text" id="edit-distributed-force-direction-y" class="form-control" value="${obj.direc[1]}">
                </div>
            `;
            break;
        case 'gdjzz':
            title = '编辑固定铰';
            content = `
                <div class="mb-3">
                    <label class="form-label">位置X坐标:</label>
                    <input type="text" id="edit-fixed-hinge-position-x" class="form-control" value="${obj.place[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">位置Y坐标:</label>
                    <input type="text" id="edit-fixed-hinge-position-y" class="form-control" value="${obj.place[1]}">
                </div>
            `;
            break;
        case 'hdjzz':
            title = '编辑滑动铰';
            content = `
                <div class="mb-3">
                    <label class="form-label">位置X坐标:</label>
                    <input type="text" id="edit-sliding-hinge-position-x" class="form-control" value="${obj.place[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">位置Y坐标:</label>
                    <input type="text" id="edit-sliding-hinge-position-y" class="form-control" value="${obj.place[1]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">方向X分量:</label>
                    <input type="text" id="edit-sliding-hinge-direction-x" class="form-control" value="${obj.direc[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">方向Y分量:</label>
                    <input type="text" id="edit-sliding-hinge-direction-y" class="form-control" value="${obj.direc[1]}">
                </div>
            `;
            break;
        case 'gdzz':
            title = '编辑固定支座';
            content = `
                <div class="mb-3">
                    <label class="form-label">位置X坐标:</label>
                    <input type="text" id="edit-fixed-position-x" class="form-control" value="${obj.place[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">位置Y坐标:</label>
                    <input type="text" id="edit-fixed-position-y" class="form-control" value="${obj.place[1]}">
                </div>
            `;
            break;
    }
    
    const modalHtml = `
        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editModalLabel">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" onclick="saveObjectEdit(${mechanicsObjects.indexOf(obj)})">保存</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
    
    document.getElementById('editModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// 保存对象编辑
function saveObjectEdit(index) {
    const obj = mechanicsObjects[index];
    
    try {
        switch (obj.type) {
            case 'beam':
                obj.start[0] = parseExpression(document.getElementById('edit-beam-start-x').value);
                obj.start[1] = parseExpression(document.getElementById('edit-beam-start-y').value);
                obj.end[0] = parseExpression(document.getElementById('edit-beam-end-x').value);
                obj.end[1] = parseExpression(document.getElementById('edit-beam-end-y').value);
                break;
            case 'outerforce':
                const newForceValue = parseExpression(document.getElementById('edit-force-value').value);
                obj.originalValue = newForceValue;
                obj.value = convertForceUnit(newForceValue, obj.unit);
                obj.place[0] = parseExpression(document.getElementById('edit-force-place-x').value);
                obj.place[1] = parseExpression(document.getElementById('edit-force-place-y').value);
                const newForceDirX = parseExpression(document.getElementById('edit-force-direction-x').value);
                const newForceDirY = parseExpression(document.getElementById('edit-force-direction-y').value);
                const forceMagnitude = Math.sqrt(newForceDirX * newForceDirX + newForceDirY * newForceDirY);
                if (forceMagnitude === 0) {
                    throw new Error('方向向量不能为零');
                }
                obj.direc[0] = newForceDirX / forceMagnitude;
                obj.direc[1] = newForceDirY / forceMagnitude;
                break;
            case 'outertorque':
                const newMomentValue = parseExpression(document.getElementById('edit-moment-value').value);
                obj.originalValue = newMomentValue;
                obj.value = convertTorqueUnit(newMomentValue, obj.unit);
                obj.place[0] = parseExpression(document.getElementById('edit-moment-place-x').value);
                obj.place[1] = parseExpression(document.getElementById('edit-moment-place-y').value);
                break;
            case 'fenbuforce':
                const newQ = parseExpression(document.getElementById('edit-distributed-force-value').value);
                obj.originalQ = newQ;
                obj.q = convertForceUnit(newQ, obj.unit);
                obj.start[0] = parseExpression(document.getElementById('edit-distributed-force-start-x').value);
                obj.start[1] = parseExpression(document.getElementById('edit-distributed-force-start-y').value);
                obj.end[0] = parseExpression(document.getElementById('edit-distributed-force-end-x').value);
                obj.end[1] = parseExpression(document.getElementById('edit-distributed-force-end-y').value);
                const newDistDirX = parseExpression(document.getElementById('edit-distributed-force-direction-x').value);
                const newDistDirY = parseExpression(document.getElementById('edit-distributed-force-direction-y').value);
                const distMagnitude = Math.sqrt(newDistDirX * newDistDirX + newDistDirY * newDistDirY);
                if (distMagnitude === 0) {
                    throw new Error('方向向量不能为零');
                }
                obj.direc[0] = newDistDirX / distMagnitude;
                obj.direc[1] = newDistDirY / distMagnitude;
                break;
            case 'gdjzz':
                obj.place[0] = parseExpression(document.getElementById('edit-fixed-hinge-position-x').value);
                obj.place[1] = parseExpression(document.getElementById('edit-fixed-hinge-position-y').value);
                break;
            case 'hdjzz':
                obj.place[0] = parseExpression(document.getElementById('edit-sliding-hinge-position-x').value);
                obj.place[1] = parseExpression(document.getElementById('edit-sliding-hinge-position-y').value);
                const newHingeDirX = parseExpression(document.getElementById('edit-sliding-hinge-direction-x').value);
                const newHingeDirY = parseExpression(document.getElementById('edit-sliding-hinge-direction-y').value);
                const hingeMagnitude = Math.sqrt(newHingeDirX * newHingeDirX + newHingeDirY * newHingeDirY);
                if (hingeMagnitude === 0) {
                    throw new Error('方向向量不能为零');
                }
                obj.direc[0] = newHingeDirX / hingeMagnitude;
                obj.direc[1] = newHingeDirY / hingeMagnitude;
                break;
            case 'gdzz':
                obj.place[0] = parseExpression(document.getElementById('edit-fixed-position-x').value);
                obj.place[1] = parseExpression(document.getElementById('edit-fixed-position-y').value);
                break;
        }
        
        displayObjects();
        updateVisualization();
        
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        editModal.hide();
    } catch (e) {
        alert('编辑错误：' + e.message);
    }
}

// 删除对象
function deleteObject(index) {
    const deletedObject = mechanicsObjects[index];
    mechanicsObjects.splice(index, 1);
    displayObjects();
    
    // 如果删除的是梁，更新可视化区域
    if (deletedObject.type === 'beam') {
        updateVisualization();
    }
    
    // 在日志中显示
    const logDiv = document.getElementById('log');
    logDiv.innerHTML = '<h5>【操作日志】</h5>';
    logDiv.innerHTML += `<p>对象删除成功！</p>`;
    
    // 切换到日志标签页
    const logTab = new bootstrap.Tab(document.getElementById('log-tab'));
    logTab.show();
}

// 更新可视化区域
function updateVisualization() {
    const visualizationDiv = document.getElementById('visualization');
    visualizationDiv.innerHTML = '';
    
    // 检查是否有梁对象
    const beams = mechanicsObjects.filter(obj => obj.type === 'beam');
    if (beams.length > 0) {
        // 只显示第一个梁
        const beam = beams[0];
        const startX = beam.start[0];
        const startY = beam.start[1];
        const endX = beam.end[0];
        const endY = beam.end[1];
        
        // 创建SVG元素
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 400 300');
        
        // 计算缩放和平移，使梁的中点位于画布中央
        const minX = Math.min(startX, endX);
        const maxX = Math.max(startX, endX);
        const minY = Math.min(startY, endY);
        const maxY = Math.max(startY, endY);
        const width = maxX - minX;
        const height = maxY - minY;
        const padding = 50;
        const scaleX = (400 - 2 * padding) / (width || 1);
        const scaleY = (300 - 2 * padding) / (height || 1);
        const scale = Math.min(scaleX, scaleY);
        
        // 计算梁的中点
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        // 计算平移，使梁的中点位于画布中央
        const canvasCenterX = 200; // 画布宽度的一半
        const canvasCenterY = 150; // 画布高度的一半
        const translateX = canvasCenterX - midX * scale;
        const translateY = canvasCenterY - midY * scale;
        
        // 绘制梁
        const beamElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        beamElement.setAttribute('x1', startX * scale + translateX);
        beamElement.setAttribute('y1', startY * scale + translateY);
        beamElement.setAttribute('x2', endX * scale + translateX);
        beamElement.setAttribute('y2', endY * scale + translateY);
        beamElement.setAttribute('stroke', 'black');
        beamElement.setAttribute('stroke-width', '3');
        svg.appendChild(beamElement);
        
        // 绘制起点和终点（不显示标签）
        const startPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        startPoint.setAttribute('cx', startX * scale + translateX);
        startPoint.setAttribute('cy', startY * scale + translateY);
        startPoint.setAttribute('r', '5');
        startPoint.setAttribute('fill', 'red');
        svg.appendChild(startPoint);
        
        const endPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        endPoint.setAttribute('cx', endX * scale + translateX);
        endPoint.setAttribute('cy', endY * scale + translateY);
        endPoint.setAttribute('r', '5');
        endPoint.setAttribute('fill', 'blue');
        svg.appendChild(endPoint);
        
        // 添加梁到可视化区域
        visualizationDiv.appendChild(svg);
    } else {
        // 如果没有梁，清空可视化区域
        visualizationDiv.innerHTML = '';
    }
}

// 绘制内力图（剪力、弯矩、轴力）
function drawInternalForcesDiagram(internalForcesData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    container.innerHTML = '';
    
    const { beamLength, internalForces } = internalForcesData;
    
    // 创建网格容器
    const gridContainer = document.createElement('div');
    gridContainer.className = 'row';
    
    // 创建三个子图：剪力图、弯矩图、轴力图
    const diagrams = [
        { title: '剪力图', data: internalForces.map(f => f.shearForce), color: '#e74c3c' },
        { title: '弯矩图', data: internalForces.map(f => f.bendingMoment), color: '#3498db' },
        { title: '轴力图', data: internalForces.map(f => f.axialForce), color: '#2ecc71' }
    ];
    
    diagrams.forEach((diagram, index) => {
        const diagramContainer = document.createElement('div');
        diagramContainer.className = 'col-md-6 mb-4';
        diagramContainer.innerHTML = `
            <h6 class="mb-3">${diagram.title}</h6>
            <svg width="100%" height="150" viewBox="0 0 400 150">
                <g transform="translate(40, 75)">
                    <!-- 坐标轴 -->
                    <line x1="0" y1="-60" x2="0" y2="60" stroke="#333" stroke-width="1"/>
                    <line x1="0" y1="0" x2="320" y2="0" stroke="#333" stroke-width="1"/>
                    
                    <!-- 箭头 -->
                    <polygon points="0,-65 -5,-55 5,-55" fill="#333"/>
                    <polygon points="325,0 315,-5 315,5" fill="#333"/>
                    
                    <!-- 坐标轴标签 -->
                    <text x="330" y="15" font-size="10" fill="#333">位置 (m)</text>
                    <text x="-30" y="-65" font-size="10" fill="#333" transform="rotate(-90, -30, -65)">值 (N/N·m)</text>
                </g>
            </svg>
        `;
        
        const svg = diagramContainer.querySelector('svg');
        const group = svg.querySelector('g');
        
        // 计算数据范围
        const data = diagram.data;
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue || 1;
        
        // 计算缩放因子
        const scaleY = 50 / (range * 1.2);
        const scaleX = 320 / beamLength;
        
        // 计算零线位置（SVG坐标系的原点）
        const zeroY = 0;
        
        // 绘制零线（虚线）
        const zeroLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        zeroLine.setAttribute('x1', '0');
        zeroLine.setAttribute('y1', zeroY);
        zeroLine.setAttribute('x2', '320');
        zeroLine.setAttribute('y2', zeroY);
        zeroLine.setAttribute('stroke', '#999');
        zeroLine.setAttribute('stroke-width', '1');
        zeroLine.setAttribute('stroke-dasharray', '5,5');
        group.appendChild(zeroLine);
        
        // 绘制数据线
        const pathData = data.map((value, index) => {
            const x = index * (320 / (data.length - 1));
            const y = -value * scaleY; // 直接映射到SVG坐标系
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', diagram.color);
        path.setAttribute('stroke-width', '2');
        group.appendChild(path);
        
        // 添加填充区域
        const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const fillPathData = pathData + ` L 320 ${zeroY} L 0 ${zeroY} Z`;
        fillPath.setAttribute('d', fillPathData);
        fillPath.setAttribute('fill', diagram.color);
        fillPath.setAttribute('fill-opacity', '0.2');
        fillPath.setAttribute('stroke', 'none');
        group.appendChild(fillPath);
        
        // 添加数值标注
        const maxValueInData = Math.max(...data);
        const minValueInData = Math.min(...data);
        const maxIndex = data.indexOf(maxValueInData);
        const minIndex = data.indexOf(minValueInData);
        
        if (maxIndex !== -1) {
            const maxX = maxIndex * (320 / (data.length - 1));
            const maxY = -maxValueInData * scaleY;
            const maxText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            maxText.setAttribute('x', maxX);
            maxText.setAttribute('y', maxY - 5);
            maxText.setAttribute('text-anchor', 'middle');
            maxText.setAttribute('font-size', '10');
            maxText.setAttribute('fill', diagram.color);
            maxText.textContent = maxValueInData.toFixed(2);
            group.appendChild(maxText);
        }
        
        if (minIndex !== -1 && minValueInData !== maxValueInData) {
            const minX = minIndex * (320 / (data.length - 1));
            const minY = -minValueInData * scaleY;
            const minText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            minText.setAttribute('x', minX);
            minText.setAttribute('y', minY + 15);
            minText.setAttribute('text-anchor', 'middle');
            minText.setAttribute('font-size', '10');
            minText.setAttribute('fill', diagram.color);
            minText.textContent = minValueInData.toFixed(2);
            group.appendChild(minText);
        }
        
        // 添加刻度线
        const numTicks = 5;
        for (let i = 0; i <= numTicks; i++) {
            const x = (i / numTicks) * 320;
            const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            tick.setAttribute('x1', x);
            tick.setAttribute('y1', -3);
            tick.setAttribute('x2', x);
            tick.setAttribute('y2', 3);
            tick.setAttribute('stroke', '#333');
            tick.setAttribute('stroke-width', '1');
            group.appendChild(tick);
            
            const tickText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            tickText.setAttribute('x', x);
            tickText.setAttribute('y', 20);
            tickText.setAttribute('text-anchor', 'middle');
            tickText.setAttribute('font-size', '8');
            tickText.setAttribute('fill', '#333');
            tickText.textContent = ((i / numTicks) * beamLength).toFixed(1);
            group.appendChild(tickText);
        }
        
        gridContainer.appendChild(diagramContainer);
    });
    
    container.appendChild(gridContainer);
}
window.drawInternalForcesDiagram = drawInternalForcesDiagram;

