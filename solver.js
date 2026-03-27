// solver.js - 求解器核心逻辑

// 全局变量
let mechanicsObjects = [];
let globalUnits = {
    length: 'm',
    force: 'N',
    moment: 'N·m'
};

// 暴露全局变量
window.mechanicsObjects = mechanicsObjects;
window.globalUnits = globalUnits;

// 解析表达式
function parseExpression(expr) {
    try {
        // 使用 math.js 解析表达式
        return math.evaluate(expr);
    } catch (e) {
        console.error('表达式解析错误:', expr, e);
        return 0;
    }
}
window.parseExpression = parseExpression;

// 求解器类
class Solver {
    constructor(mechanicsObjects) {
        this.mechanicsObjects = mechanicsObjects;
        this.restrictiondic = {
            'gdjzz': [],
            'hdjzz': [],
            'gdzz': []
        };
        this.restrictioncnt = 3;
        this.matrixcnt = 0;
        this.A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.beta = [[0], [0], [0]];
        
        this.classifyObjects();
    }
    
    classifyObjects() {
        for (const obj of this.mechanicsObjects) {
            if (obj.type === 'gdjzz') {
                this.restrictiondic.gdjzz.push(obj);
                this.restrictioncnt -= 2;
            } else if (obj.type === 'hdjzz') {
                this.restrictiondic.hdjzz.push(obj);
                this.restrictioncnt -= 1;
            } else if (obj.type === 'gdzz') {
                this.restrictiondic.gdzz.push(obj);
                this.restrictioncnt -= 3;
            }
        }
    }
    
    countEquation() {
        for (const obj of this.mechanicsObjects) {
            if (obj.type === 'outerforce') {
                this.beta[0][0] -= obj.value * obj.direc[0];
                this.beta[1][0] -= obj.value * obj.direc[1];
                this.beta[2][0] -= obj.value * (obj.place[0] * obj.direc[1] - obj.place[1] * obj.direc[0]);
            } else if (obj.type === 'outertorque') {
                this.beta[2][0] -= obj.value;
            } else if (obj.type === 'fenbuforce') {
                // 分布力的处理
                const start = obj.start;
                const end = obj.end;
                const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
                const midX = (start[0] + end[0]) / 2;
                const midY = (start[1] + end[1]) / 2;
                const q = obj.q; 
                
                this.beta[0][0] -= q * length * obj.direc[0];
                this.beta[1][0] -= q * length * obj.direc[1];
                this.beta[2][0] -= q * length * (midX * obj.direc[1] - midY * obj.direc[0]);
            } else if (obj.type === 'fenbutorque') {
                // 分布力矩的处理
                const start = obj.start;
                const end = obj.end;
                const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
                const m = obj.m; 
                this.beta[2][0] -= m * length;
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
window.Solver = Solver;

// 获取对象类型的全称
function getObjectTypeName(type) {
    const typeMap = {
        'outerforce': '外力',
        'outertorque': '外力矩',
        'fenbuforce': '分布力',
        'fenbutorque': '分布力矩',
        'hdjzz': '滑动铰',
        'gdjzz': '固定铰',
        'gdzz': '固定支座',
        'beam': '梁'
    };
    return typeMap[type] || type;
}
window.getObjectTypeName = getObjectTypeName;

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
    
    // 显示各类对象
    for (const [typeName, objects] of Object.entries(objectsByType)) {
        confirmationHTML += `<h6 class="mt-3">${typeName} (${objects.length}个)</h6>`;
        confirmationHTML += '<ul class="list-group">';
        objects.forEach((obj, index) => {
            let detail = '';
            if (obj.type === 'outerforce') {
                detail = `大小: ${obj.value}${globalUnits.force}, 位置: (${obj.place[0]}, ${obj.place[1]}), 方向: (${obj.direc[0]}, ${obj.direc[1]})`;
            } else if (obj.type === 'outertorque') {
                detail = `大小: ${obj.value}${globalUnits.moment}, 位置: (${obj.place[0]}, ${obj.place[1]})`;
            } else if (obj.type === 'fenbuforce') {
                detail = `集度: ${obj.q}${globalUnits.force}/${globalUnits.length}, 起点: (${obj.start[0]}, ${obj.start[1]}), 终点: (${obj.end[0]}, ${obj.end[1]}), 方向: (${obj.direc[0]}, ${obj.direc[1]})`;
            } else if (obj.type === 'fenbutorque') {
                detail = `集度: ${obj.m}${globalUnits.moment}/${globalUnits.length}, 起点: (${obj.start[0]}, ${obj.start[1]}), 终点: (${obj.end[0]}, ${obj.end[1]})`;
            } else if (obj.type === 'beam') {
                detail = `起点: (${obj.start[0]}, ${obj.start[1]}), 终点: (${obj.end[0]}, ${obj.end[1]})`;
            } else if (obj.type === 'gdjzz' || obj.type === 'hdjzz' || obj.type === 'gdzz') {
                detail = `位置: (${obj.place[0]}, ${obj.place[1]})`;
                if (obj.type === 'hdjzz') {
                    detail += `, 方向: (${obj.direc[0]}, ${obj.direc[1]})`;
                }
            }
            
            confirmationHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
                ${index + 1}. ${detail}
                <button class="btn btn-sm btn-danger" onclick="removeObject('${obj.type}', ${index})">删除</button>
            </li>`;
        });
        confirmationHTML += '</ul>';
    }
    
    // 显示确认对话框
    const confirmationDiv = document.getElementById('object-confirmation');
    if (confirmationDiv) {
        confirmationDiv.innerHTML = confirmationHTML;
        confirmationDiv.style.display = 'block';
    }
}
window.showObjectConfirmation = showObjectConfirmation;

// 删除对象
function removeObject(type, index) {
    // 找到对应类型的对象
    const objectsOfType = mechanicsObjects.filter(obj => obj.type === type);
    if (index < objectsOfType.length) {
        const objToRemove = objectsOfType[index];
        const actualIndex = mechanicsObjects.indexOf(objToRemove);
        if (actualIndex > -1) {
            mechanicsObjects.splice(actualIndex, 1);
            showObjectConfirmation();
            updateVisualization();
        }
    }
}
window.removeObject = removeObject;

// 更新可视化
function updateVisualization() {
    // 触发可视化更新
    if (typeof visualizeMechanics === 'function') {
        visualizeMechanics();
    }
}
window.updateVisualization = updateVisualization;

// 计算梁上的内力（剪力、弯矩、轴力）
function calculateInternalForces(beam, mechanicsObjects, constraintForces) {
    const beamStart = beam.start;
    const beamEnd = beam.end;
    const beamLength = Math.sqrt(
        Math.pow(beamEnd[0] - beamStart[0], 2) + 
        Math.pow(beamEnd[1] - beamStart[1], 2)
    );
    
    // 判断梁的方向：水平还是垂直
    const isHorizontal = Math.abs(beamEnd[1] - beamStart[1]) < 0.001;
    const isVertical = Math.abs(beamEnd[0] - beamStart[0]) < 0.001;
    
    // 确定计算方向和起点
    let startPoint, endPoint, calculationDirection;
    if (isHorizontal) {
        // 水平梁：从左往右
        if (beamStart[0] < beamEnd[0]) {
            startPoint = beamStart;
            endPoint = beamEnd;
            calculationDirection = 'leftToRight';
        } else {
            startPoint = beamEnd;
            endPoint = beamStart;
            calculationDirection = 'rightToLeft';
        }
    } else if (isVertical) {
        // 垂直梁：从下往上
        if (beamStart[1] < beamEnd[1]) {
            startPoint = beamStart;
            endPoint = beamEnd;
            calculationDirection = 'bottomToTop';
        } else {
            startPoint = beamEnd;
            endPoint = beamStart;
            calculationDirection = 'topToBottom';
        }
    } else {
        // 斜梁：使用起点到终点的方向
        startPoint = beamStart;
        endPoint = beamEnd;
        calculationDirection = 'startToEnd';
    }
    
    // 沿梁长度方向取点
    const numPoints = 100;
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
        const x = (i / numPoints) * beamLength;
        let point;
        if (isHorizontal) {
            if (calculationDirection === 'leftToRight') {
                point = [startPoint[0] + x, startPoint[1]];
            } else {
                point = [startPoint[0] - x, startPoint[1]];
            }
        } else {
            if (calculationDirection === 'bottomToTop') {
                point = [startPoint[0], startPoint[1] + x];
            } else {
                point = [startPoint[0], startPoint[1] - x];
            }
        }
        points.push({ x, point });
    }
    
    // 收集所有力（约束力和外力）
    const allForces = [];
    
    // 添加约束力
    constraintForces.forEach(force => {
        allForces.push({
            type: 'constraint',
            value: force.value,
            position: force.position,
            direction: force.direction
        });
    });
    
    // 添加外力
    mechanicsObjects.forEach(obj => {
        if (obj.type === 'outerforce') {
            allForces.push({
                type: 'external',
                value: obj.value,
                position: obj.place,
                direction: obj.direc
            });
        }
    });
    
    // 计算每个点处的剪力
    const shearForces = points.map((p, index) => {
        let shearForce = 0;
        
        // 集中力和约束力的贡献
        allForces.forEach(force => {
            // 判断力是否在当前点的左侧（水平梁）或下方（垂直梁）
            let distanceFromStart;
            if (isHorizontal) {
                distanceFromStart = force.position[0] - startPoint[0];
            } else {
                distanceFromStart = force.position[1] - startPoint[1];
            }
            
            if (distanceFromStart < p.x) {
                // 根据梁方向和力方向确定剪力符号
                if (isHorizontal) {
                    // 水平梁：从左往右计算
                    // 力朝上为正，朝下为负（无论是约束力还是外力）
                    const verticalComponent = force.direction[1];
                    shearForce += force.value * verticalComponent;
                } else {
                    // 垂直梁：从下往上计算
                    // 力朝左为正，朝右为负（无论是约束力还是外力）
                    const horizontalComponent = force.direction[0];
                    shearForce -= force.value * horizontalComponent;
                }
            }
        });
        
        // 分布力的贡献（剪力的导数是分布力集度）
        mechanicsObjects.forEach(obj => {
            if (obj.type === 'fenbuforce') {
                const forceStart = obj.start;
                const forceEnd = obj.end;
                const q = obj.q; // 分布力集度
                
                let startDist, endDist;
                if (isHorizontal) {
                    startDist = forceStart[0] - startPoint[0];
                    endDist = forceEnd[0] - startPoint[0];
                } else {
                    startDist = forceStart[1] - startPoint[1];
                    endDist = forceEnd[1] - startPoint[1];
                }
                
                // 计算分布力对剪力的贡献
                if (p.x > startDist) {
                    const effectiveLength = Math.min(p.x, endDist) - startDist;
                    if (effectiveLength > 0) {
                        if (isHorizontal) {
                            // 水平梁：分布力的垂直分量影响剪力
                            const verticalComponent = obj.direc[1];
                            shearForce += q * effectiveLength * verticalComponent;
                        } else {
                            // 垂直梁：分布力的水平分量影响剪力
                            const horizontalComponent = obj.direc[0];
                            shearForce -= q * effectiveLength * horizontalComponent;
                        }
                    }
                }
            }
        });
        
        return shearForce;
    });
    
    // 通过积分计算弯矩（剪力的积分）
    // 初始弯矩应考虑固定支座的约束力矩
    let initialMoment = 0;
    
    // 检查固定支座的约束力矩
    // 固定支座的约束力矩是约束反力的一部分
    constraintForces.forEach(force => {
        if (force.direction[0] === 0 && force.direction[1] === 0) {
            // 固定支座的力矩（方向为[0,0]）
            // 初始弯矩与约束力矩方向相反
            initialMoment = -force.value;
        }
    });
    
    const bendingMoments = [];
    let momentIntegral = initialMoment;
    const dx = beamLength / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
        if (i > 0) {
            // 梯形法则积分
            momentIntegral += (shearForces[i] + shearForces[i-1]) * dx / 2;
        }
        bendingMoments.push(momentIntegral);
    }
    
    // 添加外力矩对弯矩的影响
    // 作用于某点的外力矩和该点弯矩数值变化方向是相反的
    mechanicsObjects.forEach(obj => {
        if (obj.type === 'outertorque') {
            const torquePosition = obj.place;
            let distanceFromStart;
            if (isHorizontal) {
                distanceFromStart = torquePosition[0] - startPoint[0];
            } else {
                distanceFromStart = torquePosition[1] - startPoint[1];
            }
            
            for (let i = 0; i <= numPoints; i++) {
                const x = (i / numPoints) * beamLength;
                if (x > distanceFromStart) {
                    bendingMoments[i] -= obj.value; // 外力矩与弯矩变化方向相反
                }
            }
        } else if (obj.type === 'fenbutorque') {
            const m = obj.m;
            const torqueStart = obj.start;
            const torqueEnd = obj.end;
            
            let startDist, endDist;
            if (isHorizontal) {
                startDist = torqueStart[0] - startPoint[0];
                endDist = torqueEnd[0] - startPoint[0];
            } else {
                startDist = torqueStart[1] - startPoint[1];
                endDist = torqueEnd[1] - startPoint[1];
            }
            
            for (let i = 0; i <= numPoints; i++) {
                const x = (i / numPoints) * beamLength;
                if (x > Math.min(startDist, endDist)) {
                    const effectiveLength = Math.min(x, Math.max(startDist, endDist)) - 
                                       Math.min(startDist, endDist);
                    bendingMoments[i] -= m * effectiveLength; // 分布力矩与弯矩变化方向相反
                }
            }
        }
    });
    
    // 计算轴力
    const axialForces = points.map((p, index) => {
        let axialForce = 0;
        
        allForces.forEach(force => {
            let distanceFromStart;
            if (isHorizontal) {
                distanceFromStart = force.position[0] - startPoint[0];
            } else {
                distanceFromStart = force.position[1] - startPoint[1];
            }
            
            if (distanceFromStart < p.x) {
                if (isHorizontal) {
                    // 水平梁：力在X方向的分量
                    const horizontalComponent = force.direction[0];
                    axialForce += force.value * horizontalComponent;
                } else {
                    // 垂直梁：力在Y方向的分量
                    const verticalComponent = force.direction[1];
                    axialForce += force.value * verticalComponent;
                }
            }
        });
        
        return axialForce;
    });
    
    // 移除边界条件修正，完全按照微分关系计算
    // 弯矩是剪力的积分，外力矩的影响方向与弯矩变化方向相反
    
    // 组合结果
    const internalForces = points.map((p, index) => ({
        x: p.x,
        point: p.point,
        shearForce: shearForces[index],
        bendingMoment: bendingMoments[index],
        axialForce: axialForces[index]
    }));
    
    return {
        beamLength,
        internalForces,
        isHorizontal,
        calculationDirection
    };
}
window.calculateInternalForces = calculateInternalForces;
