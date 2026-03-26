import numpy as np 

class outerforce:
    def __init__(self,value,place,direction):
        """定义外力,要求`place`表示外力作用点,`direction`的值为二维向量"""
        self.place = place
        self.direction = direction
        self.fx = value * self.direction[0]
        self.fy = value * self.direction[1]

class outertorque:
    def __init__(self,value,place):
        """定义外力矩,要求`place`表示外力矩作用点,以逆时针为正"""
        self.value = value
        self.place = place

class hdjzz:
    def __init__(self,place,direction):
        """滑动铰支座,要求`place`表示铰动点,`direction`的值为二维向量,表示铰动方向"""
        self.place = place
        self.direction = direction

class gdjzz:
    def __init__(self,place):
        """固定铰支座,要求`place`表示铰动点"""
        self.place = place


class gz:
    def __init__(self,place):
        """固定支座,要求`place`表示支座点"""
        self.place = place