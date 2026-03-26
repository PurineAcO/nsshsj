import define
import solve
import re

# 核心：自动解析 (x,y) 格式坐标，提取数字
def parse_point(s):
    nums = list(map(float, re.findall(r'-?\d+\.?\d*', s)))
    return (nums[0], nums[1])

def create_mechanics_objects():
    mechanics_objects = []

    print("========== 静力学求解器 - 数组输入版 ==========\n")
    print("📌 输入规则：所有参数用空格分隔，支持直接输入 (x,y) 坐标！")
    print("支持类型：")
    print("1. 外力 (outerforce)        → 输入：值 作用点(x,y) 方向(x,y)")
    print("2. 外力矩 (outertorque)      → 输入：值 作用点(x,y)")
    print("3. 分布力 (fenbuforce)       → 输入：集度q 起点(x,y) 终点(x,y) 方向(x,y)")
    print("4. 分布力矩 (fenbutorque)    → 输入：集度m 起点(x,y) 终点(x,y)")
    print("5. 滑动铰 (hdjzz)            → 输入：位置(x,y) 方向(x,y)")
    print("6. 固定铰 (gdjzz)            → 输入：位置(x,y)")
    print("7. 固定支座 (gz)             → 输入：位置(x,y)\n")

    # ===================== 1. 外力（支持(x,y)输入）=====================
    n_force = int(input("请输入 外力 数量："))
    for i in range(n_force):
        parts = input(f"第{i+1}个外力（值 作用点(x,y) 方向(x,y)）：").split()
        value = float(parts[0])
        place = parse_point(parts[1])   # 解析(1,0)
        direc = parse_point(parts[2])   # 解析(0,1)
        mechanics_objects.append(define.outerforce(value, place, direc))

    # ===================== 2. 外力矩（支持(x,y)输入）=====================
    n_torque = int(input("\n请输入 外力矩 数量："))
    for i in range(n_torque):
        parts = input(f"第{i+1}个外力矩（值 作用点(x,y)）：").split()
        value = float(parts[0])
        place = parse_point(parts[1])   # 解析(2,0)
        mechanics_objects.append(define.outertorque(value, place))

    # ===================== 3. 分布力（支持(x,y)输入）=====================
    n_fenbu = int(input("\n请输入 分布力 数量："))
    for i in range(n_fenbu):
        parts = input(f"第{i+1}个分布力（q 起点(x,y) 终点(x,y) 方向(x,y)）：").split()
        q = float(parts[0])
        start = parse_point(parts[1])
        end = parse_point(parts[2])
        direc = parse_point(parts[3])
        mechanics_objects.append(define.fenbuforce(q, start, end, direc))

    # ===================== 4. 分布力矩（支持(x,y)输入）=====================
    n_fenbutorque = int(input("\n请输入 分布力矩 数量："))
    for i in range(n_fenbutorque):
        parts = input(f"第{i+1}个分布力矩（m 起点(x,y) 终点(x,y)）：").split()
        m = float(parts[0])
        start = parse_point(parts[1])
        end = parse_point(parts[2])
        mechanics_objects.append(define.fenbutorque(m, start, end))

    # ===================== 5. 滑动铰（支持(x,y)输入）=====================
    n_hdjzz = int(input("\n请输入 滑动铰 数量："))
    for i in range(n_hdjzz):
        parts = input(f"第{i+1}个滑动铰（位置(x,y) 方向(x,y)）：").split()
        place = parse_point(parts[0])
        direc = parse_point(parts[1])
        mechanics_objects.append(define.hdjzz(place, direc))

    # ===================== 6. 固定铰（支持(x,y)输入）=====================
    n_gdjzz = int(input("\n请输入 固定铰 数量："))
    for i in range(n_gdjzz):
        parts = input(f"第{i+1}个固定铰（位置(x,y)）：").split()
        place = parse_point(parts[0])
        mechanics_objects.append(define.gdjzz(place))

    # ===================== 7. 固定支座（支持(x,y)输入）=====================
    n_gz = int(input("\n请输入 固定支座 数量："))
    for i in range(n_gz):
        parts = input(f"第{i+1}个固定支座（位置(x,y)）：").split()
        place = parse_point(parts[0])
        mechanics_objects.append(define.gz(place))

    print("\n========== 所有对象创建完成！==========")
    print(f"总计对象：{len(mechanics_objects)} 个")
    return mechanics_objects


if __name__ == "__main__":
    all_objects = create_mechanics_objects()

    print("\n【对象列表预览】")
    for idx, obj in enumerate(all_objects):
        print(f"对象{idx+1} 类型：{type(obj).__name__}，参数：{obj.__dict__}")

    sol = solve.solver(all_objects)
    sol.solveequation()