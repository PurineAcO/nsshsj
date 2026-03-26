import numpy as np 

class outerft:
    def __init__(self,value,place,typer):
        if typer == 'force' or typer == 'torque':
            self.type = typer
            self.value = value
            self.place = place
        else:
            raise ValueError('外力类型不符合要求')

class restriction:
    def __init__(self,place,typer,direction):
        if typer == 'hdjzz' or typer == 'gdjzz' or typer == 'gz':
            self.type = typer
            self.place = place
            self.direction = direction
            self.Fx = 0
            self.Fy = 0
            self.Fz = 0
            self.Mx = 0
            self.My = 0
            self.Mz = 0
        else:
            raise ValueError('约束类型不符合要求')

class solver:
    def __init__(self, outerft, restriction, outerftnum, restrictionnum):
        self.outerft = outerft
        self.restriction = restriction
        self.outerftnum = outerftnum
        self.restrictionnum = restrictionnum
    
    def solve(self):
        unknowns = []
        unknown_index_map = {}
        
        for i, res in enumerate(self.restriction):
            if res.type == 'hdjzz':
                unknowns.append((res, 'F', res.direction))
                unknown_index_map[(i, 'F')] = len(unknowns) - 1
            elif res.type == 'gdjzz':
                unknowns.append((res, 'Fx'))
                unknowns.append((res, 'Fy'))
                unknown_index_map[(i, 'Fx')] = len(unknowns) - 2
                unknown_index_map[(i, 'Fy')] = len(unknowns) - 1
            elif res.type == 'gz':
                unknowns.append((res, 'Fx'))
                unknowns.append((res, 'Fy'))
                unknowns.append((res, 'Mz'))
                unknown_index_map[(i, 'Fx')] = len(unknowns) - 3
                unknown_index_map[(i, 'Fy')] = len(unknowns) - 2
                unknown_index_map[(i, 'Mz')] = len(unknowns) - 1
        
        num_unknowns = len(unknowns)
        
        if num_unknowns > 3:
            raise ValueError("约束数量过多，超过平面静力学的3个平衡方程")
        
        A = np.zeros((3, num_unknowns))
        b = np.zeros(3)
        
        sum_Fx = 0
        sum_Fy = 0
        sum_M = 0
        
        for ft in self.outerft:
            if ft.type == 'force':
                fx, fy = ft.value
                x, y = ft.place
                sum_Fx += fx
                sum_Fy += fy
                sum_M += fx * y - fy * x
            elif ft.type == 'torque':
                sum_M += ft.value
        
        for (res, var_type, *dir_info) in unknowns:
            idx = unknowns.index((res, var_type, *dir_info))
            if var_type == 'Fx':
                A[0, idx] = 1
            elif var_type == 'Fy':
                A[1, idx] = 1
            elif var_type == 'F':
                if dir_info[0] == 'x':
                    A[0, idx] = 1
                elif dir_info[0] == 'y':
                    A[1, idx] = 1
            elif var_type == 'Mz':
                A[2, idx] = 1
        
        for (res, var_type, *dir_info) in unknowns:
            idx = unknowns.index((res, var_type, *dir_info))
            rx, ry = res.place
            if var_type == 'Fx':
                A[2, idx] = ry
            elif var_type == 'Fy':
                A[2, idx] = -rx
            elif var_type == 'F':
                if dir_info[0] == 'x':
                    A[2, idx] = ry
                elif dir_info[0] == 'y':
                    A[2, idx] = -rx
        
        b[0] = -sum_Fx
        b[1] = -sum_Fy
        b[2] = -sum_M
        
        if num_unknowns < 3:
            A = A[:, :num_unknowns]
            solution = np.linalg.lstsq(A, b[:num_unknowns], rcond=None)[0]
        else:
            solution = np.linalg.solve(A, b)
        
        for i, (res, var_type, *dir_info) in enumerate(unknowns):
            if var_type == 'Fx':
                res.Fx = solution[i]
            elif var_type == 'Fy':
                res.Fy = solution[i]
            elif var_type == 'F':
                if dir_info[0] == 'x':
                    res.Fx = solution[i]
                elif dir_info[0] == 'y':
                    res.Fy = solution[i]
            elif var_type == 'Mz':
                res.Mz = solution[i]
        
        return self.restriction

