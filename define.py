import numpy as np 

class outerforce:
    def __init__(self,value,place,direction):
        self.place = place
        self.direction = direction
        self.fx = value * self.direction[0]
        self.fy = value * self.direction[1]

class outertorque:
    def __init__(self,value,place):
        self.value = value
        self.place = place

class fenbuforce:
    def __init__(self,q,start,end,direction):
        if end < start:
            raise ValueError("分布力作用终点不能小于分布力作用起点")
        self.length = np.linalg.norm(np.array(end) - np.array(start))
        self.fx = q * self.length * direction[0]
        self.fy = q * self.length * direction[1]
        self.place = ((start[0]+end[0])/2, (start[1]+end[1])/2)

class fenbutorque:
    def __init__(self,m,start,end):
        if end < start:
            raise ValueError("分布力矩作用终点不能小于分布力矩作用起点")
        self.length = np.linalg.norm(np.array(end) - np.array(start))
        self.value = m * self.length
        self.place = ((start[0]+end[0])/2, (start[1]+end[1])/2)

class hdjzz:
    def __init__(self,place,direction):
        self.place = place
        self.direction = direction

class gdjzz:
    def __init__(self,place):
        self.place = place

class gz:
    def __init__(self,place):
        self.place = place